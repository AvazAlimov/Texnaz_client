<template lang="pug">
  v-layout(row wrap)
    v-flex.mb-3(xs12)
      v-btn.ma-0(small color="tertiary" @click="tab = 0"
        :flat="tab != 0" :outline="tab == 0"
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
      template(v-if="tab==0")
        v-flex(xs6 md3 d-flex v-for="item in cards" :key="item.id")
          GraphCard(:icon="item.icon"
            :title="item.title"
            :subtitle="item.subtitle"
            :caption="item.caption"
            :value="item.value"
            :colorSecondary="colorSecondary"
            :colorCard="colorCard")
        v-flex(xs12 md4)
          PieChart.mb-2(
            title="Диаграмма Брендов"
            :colorSecondary="colorSecondary"
            :models="brandsData.data")
          ClientData(
            :title="clientData.title",
            :total="clientData.total",
            :month="clientData.month")
        v-flex(xs12 md8 d-flex)
          ManagerStatistics(:models="managerStatistics.data" :colorSecondary="colorSecondary")
        v-flex(xs3 d-flex v-for="(rate, index) in rateCards" :key="index")
          RateCard(:title="rate.title" :rate="rate.rate"
          :delta="rate.delta" :colorBorder="colorBorder" :colorCard="colorCard")
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
      tab: 0,
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
          subtitle: 'Лидер продаж: в прошлом месяце',
          title: '$ 1.2 млн',
          caption: 'ПМ',
        },
        {
          icon: 'timeline',
          subtitle: 'Лидер продаж: за все время',
          title: '$ 15 млн',
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
          title: '$ 1930',
          subtitle: 'Общая задолженность',
          value: [10, 12, 16, 13, 4, 9, 9, 3, 2, 4, 8, 5],
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
      managerStatistics: {
        data: [
          {
            name: 'Manager1',
            data: [
              {
                value: 9,
                date: '19.05',
              },
              {
                value: 11,
                date: '20.05',
              },
              {
                value: 4,
                date: '21.05',
              },
              {
                value: 15,
                date: '22.05',
              },
            ],
          },
          {
            name: 'Manager2',
            data: [
              {
                value: 22,
                date: '19.05',
              },
              {
                value: 12,
                date: '20.05',
              },
              {
                value: 8,
                date: '21.05',
              },
              {
                value: 10,
                date: '22.05',
              },
            ],
          },
        ],
      },
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
      return [
        `$ ${sales.map(el => this.$getTotalPrice(el, exchangeRate, officialRate))
          .reduce((a, b) => a + b)}`,
        sales.map(el => this.$getTotalPrice(el, exchangeRate, officialRate)),
      ];
    },
    // Gets total payment amount and payments array to show diagram
    getPayments(payments) {
      return [
        `$ ${payments.map(el => el.sum).reduce((a, b) => a + b)}`,
        payments.map(el => el.sum),
      ];
    },
    // Gets total Late debt amount and its array to show diagram
    getLateDebt(sales, exR, ofR) {
      return [
        `$ ${sales.filter(el => this.getDuration(el.createdAt, el.days))
          .reduce((a, b) => this.$getTotalPrice(a, exR, ofR) + this.$getTotalPrice(b, exR, ofR), 0)}`,
        sales.filter(el => this.getDuration(el.createdAt, el.days))
          .map(el => this.$getTotalPrice(el, exR, ofR)),
      ];
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
        // Общее количество клиентов
        this.cards[0].title = clients.length;
        // Количество новых клиентов за последний месяц
        this.cards[1].title = this.getLastMonthData(clients).length;

        // Лидер продаж: в прошлом месяце
        //    Task Empty
        // Лидер продаж: за все время
        //    Task Empty

        // Общие отгрузки
        [this.cards[4].title, this.cards[4].value] = this.getSales(data[1],
          data[2].value, data[3].value);
        // Общее поступление
        [this.cards[5].title, this.cards[5].value] = this.getPayments(data[4]);

        // Общая задолженность
        //    Task Empty

        // Общая просроченная задолженность
        [this.cards[7].title, this.cards[7].value] = this
          .getLateDebt(data[1], data[2].value, data[3].value);

        this.rateCards[1].rate = data[5].reduce((a, b) => a.totalPrice + b.totalPrice);
        this.rateCards[5].rate = this.rateCards[1].rate;
      });
    },
  },
  beforeMount() {
    this.getAll();
  },
};
</script>
