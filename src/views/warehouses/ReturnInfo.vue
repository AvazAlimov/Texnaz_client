<template lang="pug">
    v-layout(wrap row)
        v-layout(row align-center)
            v-btn(icon flat :to="{ name: 'returns' }").dashboardTertiary--text
                v-icon arrow_back
            .title.dashboardTertiary--text Возврат
        v-flex(xs12)
            .white.border.mt-3
                v-layout(row wrap).pa-4
                    v-flex(xs12)
                      v-layout.mb-2(align-center)
                        .title Номер отгрузки
                        v-spacer
                          v-divider.mx-4
                        .subheading {{ sale.number? sale.number : '-' }}
                      v-layout.mb-2(align-center)
                        .title Дата заказа
                        v-spacer
                          v-divider.mx-4
                        .subheading {{ sale.createdAt | moment('HH:mm DD-MM-YYYY') }}
                      v-layout.mb-2(align-center)
                        .title Статус
                        v-spacer
                          v-divider.mx-4
                        .subheading {{ sale.approved > 0 ? 'согласованный' : 'не согласованный' }}
                      v-layout.mb-2(align-center)
                        .title Склад
                        v-spacer
                          v-divider.mx-4
                        .subheading {{ sale.warehouse.name }} {{ sale.warehouse.company }}
                      v-layout.mb-2(align-center)
                        .title ИКК клиента
                        v-spacer
                          v-divider.mx-4
                        .subheading {{ sale.client.icc }}
                      v-layout.mb-2(align-center)
                        .title Клиент
                        v-spacer
                          v-divider.mx-4
                        .subheading {{ sale.client.name }}
                      v-layout.mb-2(align-center)
                        .title Менеджер
                        v-spacer
                          v-divider.mx-4
                        .subheading {{ sale.manager.name }}
                      v-layout.mb-2(align-center)
                        .title Тип оплаты
                        v-spacer
                          v-divider.mx-4
                        .subheading {{ types.find(type => type.id == sale.type).name }}
                      v-layout.mb-2(align-center v-if="!$route.query.accounting")
                        .title Тип расчета
                        v-spacer
                          v-divider.mx-4
                        .subheading {{ payments.find(payment => payment.id == sale.form).name }}
                      v-layout.mb-2(align-center v-if="!$route.query.accounting")
                        .title Баланс клиента
                        v-spacer
                          v-divider.mx-4
                        .subheading {{ sale.client.balance | readable }} $
                      v-layout.mb-2(align-center v-if="!$route.query.accounting")
                        .title Сумма отгрузки
                        v-spacer
                          v-divider.mx-4
                        .subheading {{ totalPrice | readable}} $
                    v-flex(xs12)
                      v-data-table(
                        :headers="headers"
                        :items="sale.items"
                        hide-actions
                        :loading="loading"
                      )
                        template(v-slot:items="{ item }")
                          ReturnItem(
                          :item="item"
                          :type="sale.type"
                          :form="sale.form"
                          :quantityFromChild="(item) => quantityFromChild(item)"
                          :officialRate="sale.officialRate"
                          :exchangeRate="sale.exchangeRate")
                    v-flex(xs12)
                      v-layout(row wrap)
                        v-spacer
                        v-btn(flat
                          :disabled="errors.items.length > 0"
                          @click="submit"
                        ).ma-0.mt-2 ПОДТВЕРДИТЬ
</template>

<script>
import Sale from '@/services/Sale';
import ReturnClient from '@/services/ReturnClient';
import shipmentTypes from '@/assets/shipment_types.json';
import shipmentPayments from '@/assets/shipment_payments.json';

export default {
  name: 'ReturnInfo',
  data() {
    return {
      loading: false,
      types: shipmentTypes,
      payments: shipmentPayments,
      sales: [],
      totalPrice: 0,
      priceHolder: 0,
      itemsHolder: [],
      sale: {
        items: [],
        client: {
          payments: [],
        },
        warehouse: {},
        manager: {},
        type: 1,
        form: 1,
        createdAt: new Date(),
      },
      headers: [
        {
          text: 'Код товара',
          value: 'code',
        },
        {
          text: 'Наименование',
          value: 'name',
        },
        {
          text: 'Фасовка',
          value: 'packing',
        },
        {
          text: 'Цвет',
          value: 'color',
        },
        {
          text: 'Состояние',
          value: 'defected',
        },
        {
          text: 'Дата прибытия',
          value: 'arrivalDate',
        },
        {
          text: 'Срок действия',
          value: 'expiryDate',
        },
        {
          text: 'Скидка %',
          value: 'discount',
        },
        {
          text: 'Цена',
          value: 'price',
        },
        {
          text: 'Количество',
          value: 'quantity',
        },
        {
          text: 'Количество к возврату',
          sortable: false,
        },
      ],
    };
  },
  methods: {
    getAll() {
      this.loading = true;
      Sale.getAll()
        .then((sales) => {
          this.totalPrice = 0;
          this.sales = sales;
          this.sale = { ...this.sales.find(el => el.id === this.$route.params.returnId) };
          this.sale.items.forEach((item, index) => {
            this.totalPrice += this.getUsdPrice(this.sale.type, item, this.sale.officialRate);
            // eslint-disable-next-line no-param-reassign
            item.initial = sales
              .find(el => el.id === this.$route.params.returnId)
              .items[index].quantity;
            // eslint-disable-next-line no-param-reassign
            item.returnQuantity = 0;
          });
          this.priceHolder = this.totalPrice;
          this.itemsHolder = this.sale.items;
        })
        .catch((err) => { this.$store.commit('setMessage', err.messages); })
        .finally(() => { this.loading = false; });
    },
    submit() {
      this.quantityFromChild();
      const returnItem = {
        saleId: this.$route.params.returnId,
        totalPrice: this.priceHolder - this.totalPrice,
        number: this.sale.number,
        days: this.sale.days,
        clientId: this.sale.clientId,
        currentClientBalance: this.sale.client.balance,
        userId: this.sale.userId,
        managerId: this.sale.managerId,
        warehouseId: this.sale.warehouseId,
        exchangeRate: this.sale.exchangeRate,
        officialRate: this.sale.officialRate,
        form: this.sale.form,
        type: this.sale.type,
        items: [],
      };
      this.sale.items.forEach((item) => {
        returnItem.items.push({
          id: item.id,
          returnQuantity: item.returnQuantity,
          returnClientId: 1,
          stockId: item.stockId,
          priceId: item.priceId,
          quantity: item.initial,
          discount: item.discount,
          commissionPrice: item.commissionPrice,
          commissionPriceUsd: item.commissionPriceUsd,
          SaleCommissionPrice: item.SaleCommissionPrice || 0,
          SaleCommissionPriceUsd: item.SaleCommissionPriceUsd || 0,
          price: item.price,
        });
      });
      ReturnClient.create(returnItem)
        .then(() => { this.$router.push({ name: 'returns' }); })
        .catch((err) => { this.$store.commit('setMessage', err.message); });
    },
    quantityFromChild() {
      this.totalPrice = 0;
      this.sale.items.forEach((item) => {
        this.totalPrice += (
          (this.getUsdPrice(this.sale.type, item, this.sale.officialRate)
            / item.quantity) * item.returnQuantity
        );
        if (this.sale.type === 4 || this.sale.type === 5) {
          // eslint-disable-next-line max-len
          const { commissionPrice, commissionPriceUsd, quantity } = this.itemsHolder.find(({ id }) => id === item.id);
          // eslint-disable-next-line max-len, no-param-reassign
          item.SaleCommissionPrice = commissionPrice - (item.returnQuantity * (commissionPrice / quantity)); // oldC - ( quantity * singleC )
          // eslint-disable-next-line no-param-reassign, max-len
          item.SaleCommissionPriceUsd = commissionPriceUsd - (item.returnQuantity * (commissionPriceUsd / quantity));
          // eslint-disable-next-line no-param-reassign
          item.commissionPrice = item.returnQuantity * (commissionPrice / quantity);
          // eslint-disable-next-line no-param-reassign
          item.commissionPriceUsd = item.returnQuantity * (commissionPriceUsd / quantity);
        }
      });
      this.totalPrice = this.priceHolder - this.totalPrice;
    },
    getUsdPrice(type, item, officialRate) {
      switch (type) {
        case 1:
          return item.debtPrice
              / Number.parseFloat(officialRate)
              * ((100 - item.discount) / 100);
        case 2:
          return item.debtPrice
              / Number.parseFloat(officialRate)
              * ((100 - item.discount) / 100);
        case 3:
          return item.price.secondPrice * item.quantity * ((100 - item.discount) / 100);
        case 4:
          return (item.commissionPrice / Number.parseFloat(officialRate))
            * ((100 - item.discount) / 100);
        case 5:
          return item.commissionPriceUsd * ((100 - item.discount) / 100);
        default:
          return 0;
      }
    },
  },
  created() {
    this.getAll();
  },
};
</script>

<style>

</style>
