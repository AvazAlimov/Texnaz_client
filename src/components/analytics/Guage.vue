<template lang="pug">
  v-card.border.elevation-0
    v-container
      v-layout(row wrap)
          v-flex(xs12 md12 lg12 sm12).text-md-center
            .title.grey--text.text--darken-2 {{ title }}
            .pa-2
              canvas(:id="`GuageChart${id}`")
              span.display-1.font-weight-medium {{ percent }}%
</template>

<script>
import Chart from 'chart.js';

export default {
  props: ['id', 'title', 'color', 'percent'],
  methods: {
    renderGuage() {
      // eslint-disable-next-line no-new
      new Chart(`GuageChart${this.id}`, {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: [this.percent, 100 - this.percent],
              backgroundColor:
                this.percent === undefined
                  ? ['rgba(0,0,0,0.05)']
                  : [this.color, '#A0A1A5'],
            },
          ],
        },
        options: {
          circumference: Math.PI,
          rotation: -Math.PI,
        },
      });
    },
  },
  mounted() {
    this.renderGuage();
  },
};
</script>

<style scoped>
span{
  position: absolute;
  transform: translateY(-32px) translateX(-25px)
}
</style>
