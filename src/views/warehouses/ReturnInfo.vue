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
                        .subheading {{ $getClientBalance(sale.client) | roundUp }} $
                      v-layout.mb-2(align-center v-if="!$route.query.accounting")
                        .title Сумма отгрузки
                        v-spacer
                          v-divider.mx-4
                        .subheading {{ $getTotalPrice(sale, sale.exchangeRate, sale.officialRate) | roundUp | readable}} $
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
import shipmentTypes from '@/assets/shipment_types.json';
import shipmentPayments from '@/assets/shipment_payments.json';

export default {
  name: 'ReturnInfo',
  data() {
    return {
      loading: false,
      types: shipmentTypes,
      payments: shipmentPayments,
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
          text: 'Количество возврат',
          sortable: false,
        },
      ],
    };
  },
  methods: {
    getAll() {
      this.loading = true;
      Sale.get(this.$route.params.returnId)
        .then((sale) => {
          this.sale = { ...sale };
          // eslint-disable-next-line no-param-reassign
          this.sale.items.forEach((item, index) => { item.initial = sale.items[index].quantity; });
        })
        .catch((err) => { this.$store.commit('setMessage', err.messages); })
        .finally(() => { this.loading = false; });
    },
    submit() {
      Sale.return(this.sale.items)
        .then(() => { this.$router.push({ name: 'returns' }); })
        .catch((err) => { this.$store.commit('setMessage', err.message); });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

<style>

</style>
