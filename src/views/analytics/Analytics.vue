<template lang="pug">
  div
    v-layout(row align-center)
      v-btn(
        small
        flat
        color="secondary"
        @click="showDashboard=true; showPreDashboard=false"
      ) Show Dashboard
        v-icon(small right v-if="showDashboard===true") check
      v-btn(
        small
        flat
        color="secondary"
        @click="showDashboard=false; showPreDashboard=true"
      ) Show PreDashboard
        v-icon(small right v-if="showPreDashboard===true") check
    v-layout(justify-center row wrap)
    
      //PreDashboard
      template(v-if="showPreDashboard")
        // Ceo view
        v-flex(xs12 v-if="$hasRole(1)")
          .border.white.pa-4
            v-layout(row wrap align-center)
              v-flex(xs12).text-xs-center
                Map(:scale="1.2")
        // Manager view
        v-flex(xs12 v-if="$hasRole(2)")
          UserBookings(:userId="$getUserId()")
        v-flex(xs12 v-if="$hasRole(2)")
          UserSales(:userId="$getUserId()")

      //Dashboard
      template(v-if="showDashboard && $hasRole(2)")
        v-flex(lg3 md3 xs3 v-for="item in userContainerData" :key="item.id")
          UserContainer(
            :icon="item.icon" 
            :title="item.title" 
            :quantity="item.quantity"
            :color="item.color"
            :duration="item.duration"
            )

        v-flex(lg3 md3 xs3 v-for="item in userDataContainer" :key="item.id")    
          UserDataContainer(
            :icon="item.icon"
            :heading="item.heading"
            :subheading="item.subheading"
            :value="item.value"
            :color="item.color"
          )
        v-flex(lg4 md4 xs4)
          v-layout(row wrap)
            v-flex(xs12)
              TotalBrandPie(title="Pie chart", :models="TotalBrandPieData.data").ma-2
              Guage(
                :id="Guage.CurrentMonthPlan.id"
                :title="Guage.CurrentMonthPlan.title"
                :color="Guage.CurrentMonthPlan.color"
                :percent="Guage.CurrentMonthPlan.percent"
                ).ma-2
        v-flex(lg8 md8 xs8)
          .title.ma-3.text-md-center.display-2 Managers statics
          ManagerStatics(:dropdown="ManagerStatics.dropdown" :models="ManagerStatics.data")
        v-flex(lg4 md4 xs4)
          Guage(
            :id="Guage.PaymentDebt.id"
            :title="Guage.PaymentDebt.title"
            :color="Guage.PaymentDebt.color"
            :percent="Guage.PaymentDebt.percent"
          )
        v-flex(lg4 md4 xs4)
          Guage(
            :id="Guage.ActiveNoneActive.id"
            :title="Guage.ActiveNoneActive.title"
            :color="Guage.ActiveNoneActive.color"
            :percent="Guage.ActiveNoneActive.percent"
          )
        v-flex(lg4 md4 xs4)
          ClientData(
            :title="ClientData.title",
            :umumiy="ClientData.umumiy",
            :oy="ClientData.oy"
          )
</template>

<script>
export default {
  name: "Analytics",
  data() {
    return {
      showDashboard: true,
      showPreDashboard: false,
      userContainerData: [
        {
          icon: "person_outline",
          color: "blue",
          title: "Umumiy klientlar soni",
          quantity: 1250
        },
        {
          icon: "person_outline",
          color: "green",
          title: "Oxirgi oydagi yangi klientlar",
          quantity: 250
        },
        {
          icon: "person_outline",
          color: "green",
          title: "Sales Leader: Last Month",
          quantity: '$1mln',
          duration: 'LM'
        },
        {
          icon: "person_outline",
          color: "green",
          title: "Sales Leader: Whole time",
          quantity: '$15mln',
          duration: 'WM'
        }
      ],
      userDataContainer: [
        {
          icon: "person_outline",
          heading: "$1430",
          subheading: "Umumiy savdo",
          value: [1, 2, 6, 3, 4, 1, 5, 2, 3, 2, 0, 5],
          color: "#B7B1F7"
        },
        {
          icon: "person_outline",
          heading: "$1830",
          subheading: "Umumiy kirim",
          value: [2, 2, 3, 3, 7, 1, 3, 4, 3, 5, 1, 5],
          color: "#41E590"
        },
        {
          icon: "person_outline",
          heading: "$1930",
          subheading: "Umumiy qarz",
          value: [10, 12, 16, 13, 4, 9, 9, 3, 2, 4, 8, 5],
          color: "#FF7F7F"
        },
        {
          icon: "person_outline",
          heading: "$2430",
          subheading: "Umumiy kechiktirilgan qarz",
          value: [11, 21, 16, 13, 14, 11, 19, 17, 23, 12, 10, 15],
          color: "#FF7F7F"
        }
      ],
      ClientData: {
        title: "Client data",
        umumiy: 150000,
        oy: 150000
      },
      TotalBrandPieData: {
        data: [
          { name: "Kraska", quantity: 13 },
          { name: "Shotka", quantity: 23 },
          { name: "Oxak", quantity: 35 }
        ]
      },
      ManagerStatics: {
        dropdown: [1, 2, 3, 4],
        data: [
          {
            name: "Manager1",
            data: [
              {
                value: 9,
                date: "19.05"
              },
              {
                value: 11,
                date: "20.05"
              },
              {
                value: 4,
                date: "21.05"
              },
              {
                value: 15,
                date: "22.05"
              }
            ]
          },
          {
            name: "Manager2",
            data: [
              {
                value: 22,
                date: "19.05"
              },
              {
                value: 12,
                date: "20.05"
              },
              {
                value: 8,
                date: "21.05"
              },
              {
                value: 10,
                date: "22.05"
              }
            ]
          }
        ]
      },
      Guage: {
        CurrentMonthPlan: {
          id: 1,
          title: "Current month's plan",
          color: "#8FF272",
          percent: 85
        },
        PaymentDebt: {
          id: 2,
          title: "Payment/debt ratio",
          color: "#56D9FE",
          percent: 65
        },
        ActiveNoneActive: {
          id: 3,
          title: "Non Active / Active Clients",
          color: "#FF8373",
          percent: 20
        }
      }
    };
  }
};
</script>
