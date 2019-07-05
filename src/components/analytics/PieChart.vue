<template lang="pug">
  v-card.border.dashboardBorder.elevation-0.dashboardTertiary--text
    v-card-text.pa-3.primary
      .title.text-md-center  {{ title }}
      canvas(height="200")
</template>

<script>
import Chart from 'chart.js';

export default {
  props: ['title', 'models', 'color'],
  methods: {
    hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      } : null;
    },
    renderPie() {
      const ctx = this.$el.querySelector('canvas').getContext('2d');
      const total = this.models.map(el => el.quantity).reduce((a, b) => a + b, 0);
      // eslint-disable-next-line no-new
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: total === 0
            ? ['Empty']
            : this.models.map(el => `${el.name} ${((el.quantity * 100) / total || 0).toFixed(2)}%`),
          datasets: [
            {
              data: this.models.map(el => el.quantity),
              backgroundColor: total === 0
                ? ['rgba(0,0,0,0.05)']
                : this.models.map((model, index) => {
                  const range = (255 * (index + 1) / this.models.length).toFixed(0);
                  const alpha = range / 255;
                  const rgb = this.hexToRgb(this.$vuetify.theme.dashboardSecondary);
                  return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
                }),
            },
          ],
        },
        options: { responsive: true },
      });
    },
  },
  mounted() {
    this.renderPie();
  },
};
</script>
