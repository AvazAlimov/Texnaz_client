<template lang="pug">
  v-card.elevation-0.border.dashboardBorder
    v-container.dashboardCard.pa-0(fill-height)
      v-layout(justify-space-between column)
        v-layout.mb-2(row align-start justify-start)
          .my-3.ml-4.mr-2
            v-icon.tertiary--text.color-blue.pa-2 {{ icon }}
          .ma-2
            .display-1.font-weight-light.accent--text {{ title }}
            .subtitle.dashboardTertiary--text {{ subtitle }}
        div(v-if="value") 
          canvas(width="100vw")
</template>

<script>
import Chart from 'chart.js';

export default {
  props: ['icon', 'title', 'subtitle', 'colorSecondary', 'colorCard', 'caption', 'value'],
  mounted() {
    if (this.value) {
      const ctx = this.$el.querySelector('canvas').getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, this.colorSecondary);
      gradient.addColorStop(0.4, this.colorCard);
      // eslint-disable-next-line no-new
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          datasets: [
            {
              backgroundColor: gradient,
              data: this.value,
            },
          ],
        },
        options: {
          responsive: true,
          elements: {
            point: {
              radius: 0,
            },
          },
          layout: {
            padding: {
              left: -6,
              right: 4,
              top: 0,
              bottom: -2,
            },
          },
          legend: {
            display: false,
          },
          scales: {
            yAxes: [{
              gridLines: {
                drawBorder: false,
                display: false,
              },
              ticks: {
                display: false, // this will remove only the label
              },
            }],
            xAxes: [{
              gridLines: {
                drawBorder: false,
                display: false,
              },
              ticks: {
                display: false, // this will remove only the label
              },
            }],
          },
        },
      });
    }
  },
};
</script>

<style scoped>
span {
  float: right;
  margin-right: 16px;
  margin-top: 5px;
}
.line {
  margin-bottom: -5px;
}
</style>
