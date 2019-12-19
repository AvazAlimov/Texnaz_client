<template lang="pug">
    v-layout(wrap row)
        v-layout(row align-center)
            v-btn(icon flat @click="$back()").dashboardTertiary--text
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
                        .title Баланс клиента
                        v-spacer
                          v-divider.mx-4
                        .subheading {{ sale.client.balance | readable }} $
                      v-layout.mb-2(align-center)
                        .title Сумма
                        v-spacer
                          v-divider.mx-4
                        .subheading {{ returnPrice }} $
        v-flex(xs12)
            v-data-table(
                :headers="headers"
                :items="sale.items"
                hide-actions
                :loading="loading"
            )
                template(v-slot:items="{ item }")
                    tr
                        td {{ item.stock.product.code }}
                        td {{ item.stock.product.name }}
                        td {{ item.stock.product.packing }}
                        td {{ item.stock.product.color ? item.stock.product.color : '-' }}
                        td {{ item.stock.defected ? 'поврежден' : 'хорошо' }}
                        td {{ item.stock.arrival_date | moment('YYYY-MM-DD') }}
                        td {{ item.stock.expiry_date | moment('YYYY-MM-DD') }}
                        td {{ item.stock.product.discount }}
                        td {{ getPrice(item) | readable }}
                        td {{ item.quantity }}
</template>
<script>
import ReturnClients from '@/services/ReturnClient';

export default {
  name: 'TableReturns',
  data() {
    return ({
      loading: false,
      returnPrice: 0,
      sale: {
        items: [],
        warehouse: {},
        client: {},
        manager: {},
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
      ],
    });
  },
  methods: {
    getAll() {
      this.loading = true;
      ReturnClients.get(this.$route.params.id)
        .then((data) => {
          this.sale = data;
          this.returnPrice = this.$getTotalPrice(this.sale,
            this.sale.exchangeRate, this.sale.officialRate);
        })
        .catch(err => this.$store.commit('setMessage', err))
        .finally(() => { this.loading = false; });
    },
    getPrice(item) {
      switch (this.sale.type) {
        case 1:
          return (this.$b2c(item.price, this.sale.officialRate, this.sale.exchangeRate)
                      * item.quantity
                      * (100 - item.discount) / 100)
                      / this.officialRate;
        case 2:
          return (item.price.mixPriceNonCash / this.sale.exchangeRate
                      + item.price.mixPriceCash)
                      * item.quantity
                      * (100 - item.discount) / 100;
        case 3:
          return item.price.secondPrice
                      * item.quantity
                      * (100 - item.discount) / 100;
        case 4:
          return (item.commissionPrice / this.sale.exchangeRate)
                  / item.quantity
                  * (100 - item.discount) / 100;
        case 5:
          return item.commissionPriceUsd / item.quantity
                  * (100 - item.discount) / 100;
        default:
          return 1;
      }
    },
  },
  created() {
    this.getAll();
  },
};
</script>
