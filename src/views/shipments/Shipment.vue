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
                .subheading {{ $getTotalPrice(sale, exchangeRate, officialRate) | roundUp }} $
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
                td {{ props.item.discount }}%
                td {{ props.item.quantity }}
                td {{ getPrice(props.item) | roundUp }}$
          v-divider
          v-layout(row v-if="sale.approved < 1 && ($hasRole(1) || $hasRole(3))")
            v-spacer
            v-btn.ma-0.mb-1.mr-1(
              :loading="loading"
              flat color="secondary"
              @click="approve()"
            ) Подтвердить
            v-btn.ma-0.mb-1.mr-1(
              v-if="sale.approved != -1"
              :loading="loading"
              flat color="secondary"
              @click="disapprove()"
            ) Отменить
</template>

<script>
import Sale from '@/services/Sale';
import Configuration from '@/services/Configuration';
import shipmentTypes from '@/assets/shipment_types.json';
import shipmentPayments from '@/assets/shipment_payments.json';

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
    payments: shipmentPayments,
    types: shipmentTypes,
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
          console.log(this.sale);
        })
        .catch(error => this.$store.commit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
    getPrice(item) {
      switch (this.sale.type) {
        case 1:
          return (this.$b2c(item.price, this.officialRate, this.exchangeRate)
                      * item.quantity
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
        case 4:
          return item.commissionPrice / this.exchangeRate
                  * item.quantity
                  * (100 - item.discount) / 100;
        default:
          return 0;
      }
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
