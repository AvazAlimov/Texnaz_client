<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'shipments' }")
            v-icon arrow_back
        .title Отгрузка
        v-flex(xs12)
            .white.border.mt-3
                v-layout(row wrap).pa-4
                    v-flex(xs12)
                        v-layout.mb-2(align-center)
                          .title Номер отгрузки
                          v-spacer
                            v-divider.mx-4
                          .subheading {{ sale.id }}
                        v-layout.mb-2(align-center)
                          .title Дата заказа
                          v-spacer
                            v-divider.mx-4
                          .subheading {{ sale.createdAt | moment('HH:mm DD-MM-YYYY') }}
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
                        v-layout.mb-2(align-center)
                          .title Тип расчета
                          v-spacer
                            v-divider.mx-4
                          .subheading {{ payments.find(payment => payment.id == sale.form).name }}
                        v-layout.mb-2(align-center)
                          .title Баланс клиента
                          v-spacer
                            v-divider.mx-4
                          .subheading {{ getClientBalance().toFixed(2) }} $
                        v-layout.mb-2(align-center)
                          .title Сумма отгрузки
                          v-spacer
                            v-divider.mx-4
                          .subheading {{ getTotalPrice().toFixed(2) }} $
                v-divider
                v-data-table(
                    :loading="loading"
                    hide-actions
                    :headers="headers"
                    :items="sale.items")
                    template(v-slot:items="props")
                        td {{ props.item.stock.product.id }}
                        td {{ props.item.stock.product.name }}
                        td {{ props.item.stock.product.packing }}
                        td {{ props.item.stock.product.color || '-' }}
                        td {{ props.item.stock.defected ? 'поврежден' : 'хорошо'}}
                        td {{ props.item.stock.arrival_date | moment('YYYY-MM-DD') }}
                        td {{ props.item.stock.expiry_date | moment('YYYY-MM-DD') }}
                        td {{ props.item.discount }} %
                        td {{ props.item.quantity }}
                        td {{ getPrice(props.item).toFixed(2) }} $
                v-divider
                v-layout(row v-if="sale.approved < 1")
                    v-spacer
                    v-btn.ma-0.mb-1.mr-1(
                      :loading="loading"
                      flat color="secondary"
                      @click="approve()"
                    ) Подтвердить
                    v-btn.ma-0.mb-1.mr-1(
                      :loading="loading"
                      flat color="secondary"
                      @click="disapprove()"
                    ) Отменить
</template>

<script>
import Sale from '@/services/Sale';
import Configuration from '@/services/Configuration';

export default {
  name: 'Shipment',
  data: () => ({
    loading: false,
    exchangeRate: 1,
    officialRate: 1,
    configurations: [],
    headers: [
      {
        text: 'Код товара',
        value: 'product.code',
      },
      {
        text: 'Наименование',
        value: 'product.name',
      },
      {
        text: 'Фасовка',
        value: 'product.packing',
      },
      {
        text: 'Цвет',
        value: 'product.color',
      },
      {
        text: 'Состояние',
        value: 'defected',
      },
      {
        text: 'Дата прибытия',
        value: 'arrival_date',
      },
      {
        text: 'Срок действия',
        value: 'expiry_date',
      },
      {
        text: 'Скидка %',
        value: 'discount',
        width: 1,
      },
      {
        text: 'Количество',
        value: 'quantity',
        width: 1,
      },
      {
        text: 'Цена',
        value: 'price',
        sortable: false,
        width: 1,
      },
    ],
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
    payments: [
      {
        id: 1,
        name: 'Предоплата',
      },
      {
        id: 2,
        name: 'Частичная',
      },
      {
        id: 3,
        name: 'Реализация',
      },
    ],
    types: [
      {
        id: 1,
        name: 'B2C',
        key: 'firstPrice',
      },
      {
        id: 2,
        name: 'Цена с наценкой',
        key: 'mixPrice',
      },
      {
        id: 3,
        name: 'B2B',
        key: 'secondPrice',
      },
    ],
  }),
  methods: {
    getAll() {
      this.loading = true;
      Promise.all([
        Sale.get(this.$route.params.id),
        Configuration.getAll(),
      ])
        .then((results) => {
          [this.sale, this.configurations] = results;
          this.exchangeRate = (this.configurations.find(conf => conf.id === 4)).value;
          this.officialRate = (this.configurations.find(conf => conf.id === 5)).value;
        })
        .catch(error => this.$store.commit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
    getPrice(item) {
      switch (this.sale.type) {
        case 1:
          return (item.price.firstPrice * item.quantity
                      * (100 - item.discount) / 100)
                      / this.officialRate;
        case 2:
          return (item.price.mixPriceNonCash / this.exchangeRate
                      + item.price.mixPriceCash)
                      * item.quantity
                      * (100 - item.discount) / 100;
        case 3:
          return item.price.secondPrice
                      * item.quantity
                      * (100 - item.discount) / 100;
        default:
          return 0;
      }
    },
    getTotalPrice() {
      let price = 0;
      switch (this.sale.type) {
        case 1:
          this.sale.items.forEach((item) => {
            price += (item.price.firstPrice * item.quantity
                      * (100 - item.discount) / 100)
                      / this.officialRate;
          });
          break;
        case 2:
          this.sale.items.forEach((item) => {
            price += (item.price.mixPriceNonCash / this.exchangeRate
                      + item.price.mixPriceCash)
                      * item.quantity
                      * (100 - item.discount) / 100;
          });
          break;
        case 3:
          this.sale.items.forEach((item) => {
            price += item.price.secondPrice
                      * item.quantity
                      * (100 - item.discount) / 100;
          });
          break;
        default:
          break;
      }
      return price;
    },
    getClientBalance() {
      let balance = 0;
      if (this.sale.client.payments) {
        this.sale.client.payments.forEach((payment) => {
          if (payment.approved) { balance += payment.sum / payment.ratio; }
        });
      }
      return balance;
    },
    submit(promise) {
      this.loading = true;
      Promise.all([promise])
        .then(() => this.$router.push({ name: 'shipments' }))
        .catch(error => this.$store.commit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
    approve() {
      this.submit(Sale.approve(this.$route.params.id));
    },
    disapprove() {
      this.submit(Sale.disapprove(this.$route.params.id));
    },
  },
  created() {
    this.getAll();
  },
};
</script>
