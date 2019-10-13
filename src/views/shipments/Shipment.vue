<template lang="pug">
    v-layout(row wrap align-center)
      v-btn(icon :to="{ name: 'shipments' }").tertiary--text
          v-icon arrow_back
      .title.tertiary--text Отгрузка
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
                .subheading {{ sale.client.balance | roundUp | readable}} $
              v-layout.mb-2(align-center v-if="!$route.query.accounting")
                .title Сумма отгрузки
                v-spacer
                  v-divider.mx-4
                .subheading {{ $getTotalPrice(sale, exchangeRate, officialRate) | roundUp }} $
              v-layout.mb-2(align-center v-if="!$route.query.accounting")
                .title Сумма отгрузки
                v-spacer
                  v-divider.mx-4
                .subheading {{ getPriceUzs(sale) || 0 | roundUp | readable}}
          v-divider
          v-data-table(
              :loading="loading"
              hide-actions
              :headers="headers"
              :items="sale.items")
              template(v-slot:items="props")
                td {{ props.item.stock.product.code }}
                td {{ props.item.stock.product.name }}
                td {{ props.item.stock.product.packing }}
                td {{ props.item.stock.product.color || '-' }}
                td {{ props.item.stock.defected ? 'поврежден' : 'хорошо'}}
                td {{ props.item.stock.arrival_date | moment('YYYY-MM-DD') }}
                td {{ props.item.stock.expiry_date | moment('YYYY-MM-DD') }}
                td {{ props.item.discount }}%
                td {{ props.item.quantity }}
                td {{ price(props.item)[0] | roundUp | readable }}
                td {{ price(props.item)[1] | roundUp | readable }}
          v-divider
          v-layout(row v-if="sale.approved < 1 && ($hasRole(1) || $hasRole(3)\
            || $hasRole(7) || $hasRole(8))")
            v-spacer
            v-btn.ma-0.mb-1.mr-1(
              :loading="loading"
              v-if="sale.approved != -1"
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
  computed: {
    headers() {
      return [
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
          value: 'aprice',
          width: 1,
        },
        {
          text: 'Сумма',
          value: 'price',
          sortable: false,
          width: 1,
        },
      ];
    },
  },
  methods: {
    // To get rid off eslint error in tables
    price(item) {
      return [
        this.$route.query.accounting ? this.anAccount(item) : this.getAPrice(item),
        this.$route.query.accounting ? this.accountantPrice(item) : this.getPrice(item),
      ];
    },
    getPriceUzs(sale) {
      return sale.items.reduce((a, { quantity, commissionPrice }) => a + (commissionPrice * quantity), 0);
    },
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
    getAPrice(item) {
      const itemPrice = this.$price(item.price, this.officialRate, this.exchangeRate);
      switch (this.sale.type) {
        case 1:
          return itemPrice.firstPrice;
        case 2:
          return (itemPrice.mixPriceNonCash / this.officialRate
          + itemPrice.mixPriceCash);
        case 3:
          return itemPrice.secondPrice;
        case 4:
          return item.commissionPrice / this.officialRate;
        default:
          return 0;
      }
    },
    anAccount(item) {
      switch (this.sale.type) {
        case 1:
          return item.price.firstPrice || 0;
        case 2:
          // mixPriceNonCash
          return item.price.mixPriceNonCash || 0;
        case 3:
          // mixPriceNonCash
          return item.price.mixPriceNonCash || 0;
        case 4:
          // commissionPrice
          return item.commissionPrice || 0;
        default:
          return 0;
      }
    },
    getPrice(item) {
      const itemPrice = this.$price(item.price, this.officialRate, this.exchangeRate);
      switch (this.sale.type) {
        case 1:
          return (itemPrice.firstPrice * item.quantity
          * (100 - item.discount) / 100);
        case 2:
          return (itemPrice.mixPriceNonCash / this.officialRate
          + itemPrice.mixPriceCash)
          * item.quantity
          * (100 - item.discount) / 100;
        case 3:
          return itemPrice.secondPrice
                  * item.quantity
                  * (100 - item.discount) / 100;
        case 4:
          return item.commissionPrice
                  * item.quantity
                  * (100 - item.discount) / 100;
        default:
          return 0;
      }
    },
    accountantPrice(item) {
      switch (this.sale.type) {
        case 1:
          return (item.price.firstPrice * item.quantity
                  * (100 - item.discount) / 100) || 0;
        case 2:
          // mixPriceNonCash
          return (item.price.mixPriceNonCash * item.quantity
                  * (100 - item.discount) / 100) || 0;
        case 3:
          // mixPriceNonCash
          return (item.price.mixPriceNonCash * item.quantity
                        * (100 - item.discount) / 100) || 0;
        case 4:
          // commissionPrice
          return (item.commissionPrice * item.quantity
                              * (100 - item.discount) / 100) || 0;
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
