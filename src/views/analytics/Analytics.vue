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
          title: 1250,
        },
        {
          icon: 'person_outline',
          subtitle: 'Количество новых клиентов за последний месяц',
          title: 250,
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
          title: '$ 1430',
          subtitle: 'Общая продажа',
          value: [10, 2, 6, 3, 4, 1, 5, 2, 3, 2, 0, 5],
        },
        {
          icon: 'swap_vert',
          title: '$ 1830',
          subtitle: 'Общий доход',
          value: [2, 2, 3, 3, 7, 1, 3, 4, 3, 5, 1, 5],
        },
        {
          icon: 'work_outline',
          title: '$ 1930',
          subtitle: 'Общий задолженность',
          value: [10, 12, 16, 13, 4, 9, 9, 3, 2, 4, 8, 5],
        },
        {
          icon: 'update',
          title: '$ 2430',
          subtitle: 'Общая просроченная задолженность',
          value: [11, 21, 16, 13, 14, 11, 19, 17, 23, 12, 10, 15],
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
          rate: '$ 150 000',
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
          rate: '$ 125 000',
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
};
</script>
