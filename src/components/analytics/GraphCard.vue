<template lang="pug">
  v-card.elevation-0
    v-container.border.white.pa-0(fill-height)
      v-layout(justify-space-between column)
        v-layout.mb-2(row align-start justify-start)
          .my-3.ml-4.mr-2
            v-icon.color-blue.pa-2 {{ icon }}
          .ma-2
            .display-1 {{ title }}
            .subtitle {{ subtitle }}
        div(v-if="value")
          canvas(width="100vw")
</template>

<script>
import Chart from 'chart.js';

export default {
  props: ['icon', 'title', 'subtitle', 'color', 'caption', 'value'],
  mounted() {
    if (this.value) {
      const ctx = this.$el.querySelector('canvas').getContext('2d');
      // eslint-disable-next-line no-new
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          datasets: [
            {
              backgroundColor: this.color,
              borderColor: this.color,
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
