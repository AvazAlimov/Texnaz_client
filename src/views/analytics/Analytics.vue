<template lang="pug">
  v-layout(row wrap)
    v-flex.mb-3(xs12)
      v-btn.ma-0(small color="tertiary" @click="tab = 0"
        :flat="tab != 0" :outline="tab == 0"
        v-if="$hasRole(1)"
      ) Статистика
      v-btn.ma-0(small color="tertiary" @click="tab = 1"
        :flat="tab != 1" :outline="tab == 1"
      ) Менеджер

    v-layout(justify-center row wrap)
      //PreDashboard
      template(v-if="tab==1")
        // Manager view
        v-flex(xs12 v-if="$hasRole(2)")
          UserBookings(:userId="$getUserId()")
        v-flex(xs12 v-if="$hasRole(2)")
          UserSales(:userId="$getUserId()")

      //Dashboard
      template(v-if="tab==0 && $hasRole(1)")
        v-flex(xs6 md3 d-flex v-for="item in cards" :key="item.id")
          GraphCard(:icon="item.icon"
            :title="item.title"
            :subtitle="item.subtitle"
            :caption="item.caption"
            :value="item.value"
            :colorSecondary="colorSecondary"
            :colorCard="colorCard")
        v-flex(xs12 d-flex)
          ManagerStatistics(:models="managerStatistics"
          :data="managerStatistics[0].data"
          :colorSecondary="colorSecondary")
</template>

<script>
import Client from '@/services/Client';
import Sale from '@/services/Sale';
import Payment from '@/services/Payment';
import Configuration from '@/services/Configuration';
import Warehouse from '@/services/Warehouse';

export default {
  name: 'Analytics',
  data() {
    return {
      tab: this.$hasRole(1) ? 0 : 1,
      colorSecondary: this.$vuetify.theme.dashboardSecondary,
      colorCard: this.$vuetify.theme.dashboardCard,
      colorBorder: this.$vuetify.theme.dashboardBorder,
      cards: [
        {
          icon: 'person_outline',
          subtitle: 'Общее количество клиентов',
          title: '~',
        },
        {
          icon: 'person_outline',
          subtitle: 'Количество новых клиентов за последний месяц',
          title: '~',
        },
        {
          icon: 'timeline',
          subtitle: 'Задолженность / Коэффициент оплаты', // Old one 'Лидер продаж: в прошлом месяце',
          title: '~',
          caption: 'ПМ',
        },
        {
          icon: 'timeline',
          subtitle: 'Склад', // Old one 'Лидер продаж: за все время',
          title: '~',
          caption: 'ВВ',
        },
        {
          icon: 'trending_up',
          title: '~',
          subtitle: 'Общие отгрузки',
          value: [],
        },
        {
          icon: 'swap_vert',
          title: '~',
          subtitle: 'Общее поступление',
          value: [],
        },
        {
          icon: 'work_outline',
          title: '~',
          subtitle: 'Общая задолженность',
          value: [],
        },
        {
          icon: 'update',
          title: '~',
          subtitle: 'Общая просроченная задолженность',
          value: [],
        },
      ],
      brandsData: {
        data: [
          { name: 'Certa-Patina', quantity: 13 },
          { name: 'DALI - Decor', quantity: 23 },
          { name: 'Polchem', quantity: 35 },
        ],
      },
      clientData: {
        total: 15000,
        month: 12500,
      },
      managerStatistics: [
        {
          name: 'Общие отгрузки',
          data: [],
        },
        {
          name: 'Общее поступление',
          data: [],
        },
      ],
      rateCards: [
        {
          title: 'Задолженность / Коэффициент оплаты',
          rate: '48 %',
          delta: 15,
        },
        {
          title: 'Склад',
          rate: '~',
          delta: 15,
        },
        {
          title: 'Деятельность клиента',
          rate: '53 %',
          delta: -10,
        },
        {
          title: 'Общая прибыль',
          rate: '$ 200 000',
          delta: -25,
        },
        {
          title: 'Задолженность / Коэффициент оплаты',
          rate: '53 %',
          delta: 12,
        },
        {
          title: 'Склад',
          rate: '~',
          delta: 10,
        },
        {
          title: 'Деятельность клиента',
          rate: '48 %',
          delta: -11,
        },
        {
          title: 'Общая прибыль',
          rate: '$ 100 000',
          delta: -5,
        },
      ],
    };
  },
  methods: {
    // For Last month clients and managers
    getLastMonthData(clients) {
      return clients.filter((el) => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return (new Date(el.createdAt)).getTime() > lastMonth.getTime();
      });
    },
    // Checks whether the sale is late
    getDuration(startTime, duration) {
      const mm = (new Date()).getTime() - (new Date(startTime)).getTime();
      const days = Math.round(mm / (3600000 * 24));
      return duration < days;
    },
    // Gets total sale amount and sales array to show diagram
    getSales(sales, exchangeRate, officialRate) {
      let sale = sales.map(el => this.$getTotalPrice(el, exchangeRate, officialRate))
        .reduce((a, b) => a + b, 0);
      sale = this.$options.filters.roundUp(sale);
      return [
        `$ ${this.$options.filters.readable(sale)}`,
        sales.map(el => this.$getTotalPrice(el, exchangeRate, officialRate)),
        sales.map(el => this.$getTotalPrice(el, exchangeRate, officialRate))
          .reduce((a, b) => a + b, 0),
      ];
    },
    // Gets total payment amount and payments array to show diagram
    getPayments(payments) {
      let payment = payments.map(el => el.sum).reduce((a, b) => a + b, 0);
      payment = this.$options.filters.roundUp(payment);
      return [
        `$ ${this.$options.filters.readable(payment)}`,
        payments.map(el => el.sum),
        payments.map(el => el.sum).reduce((a, b) => a + b, 0),
      ];
    },
    // Gets total Late debt amount and its array to show diagram
    getLateDebt(sales, exR, ofR) {
      let debt = sales.filter(el => this.getDuration(el.createdAt, el.days))
        .reduce((a, b) => this.$getTotalPrice(a, exR, ofR) + this.$getTotalPrice(b, exR, ofR), 0);
      debt = this.$options.filters.roundUp(debt);
      return [
        `$ ${this.$options.filters.readable(debt)}`,
        sales.filter(el => this.getDuration(el.createdAt, el.days))
          .map(el => this.$getTotalPrice(el, exR, ofR)),
      ];
    },
    getPaymentStatistics(payments) {
      return payments.map(el => ({
        value: this.$options.filters.roundUp(el.sum),
        date: this.$moment(el.createdAt).format('DD-MM'),
      }));
    },
    getSalesStatistics(sales, exRate, offRate) {
      return sales.map(el => ({
        value: this.$options.filters.roundUp(this.$getTotalPrice(el, exRate, offRate)),
        date: this.$moment(el.createdAt).format('DD-MM'),
      }));
    },
    getAll() {
      Promise.all([
        Client.getAll(),
        Sale.getAll(),
        Configuration.getExchangeRate(),
        Configuration.getOfficialRate(),
        Payment.getAll(),
        Warehouse.getAll(),
      ]).then((data) => {
        const clients = this.$getClients(data[0]);
        const warehouseSum = this.$options.filters.roundUp(data[5]
          .map(el => el.totalPrice)
          .reduce((a, b) => a + b, 0));
        const totalDebt = this.getSales(data[1],
          data[2].value, data[3].value)[2] - this.getPayments(data[4])[2];
        // Общее количество клиентов
        this.cards[0].title = clients.length;
        // Количество новых клиентов за последний месяц
        this.cards[1].title = this.getLastMonthData(clients).length;
        // Задолженность / Коэффициент оплаты
        this.cards[2].title = `% ${totalDebt > 0 ? totalDebt / this.getPayments(data[4])[2] : 0}`;
        // Склад
        this.cards[3].title = `$ ${this.$options.filters.readable(warehouseSum)}`;
        // Общие отгрузки
        [this.cards[4].title, this.cards[4].value] = this.getSales(data[1],
          data[2].value, data[3].value);
        // Общее поступление
        [this.cards[5].title, this.cards[5].value] = this.getPayments(data[4]);
        // Общая задолженность
        this.cards[6].title = `$ ${this.$options.filters.readable(totalDebt > 0 ? totalDebt : 0)}`;
        this.cards[6].value = this.cards[4].value;
        // Общая просроченная задолженность
        [this.cards[7].title, this.cards[7].value] = this
          .getLateDebt(data[1], data[2].value, data[3].value);
        // Показатели статистика
        this.managerStatistics[0].data = this.getSalesStatistics(data[1]
          .sort((a, b) => (a.id > b.id ? 1 : -1)), data[2].value, data[3].value);
        this.managerStatistics[1].data = this.getPaymentStatistics(data[4]
          .sort((a, b) => (a.id > b.id ? 1 : -1)));
      });
    },
  },
  beforeMount() {
    this.getAll();
  },
};
</script>
