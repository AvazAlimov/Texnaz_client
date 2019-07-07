<template lang="pug">
    v-card.border.dashboardBorder.elevation-0
      v-container(fill-height).dashboardCard
        v-layout(align-space-between justify-space-between column fill-height)
          .title.text-sm-center.dashboardTertiary--text Показатели менеджеров
          canvas
</template>

<script>
import Chart from 'chart.js';

export default {
  props: ['dropdown', 'models', 'colorSecondary'],
  methods: {
    hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      } : null;
    },
    renderChart() {
      const ctx = this.$el.querySelector('canvas').getContext('2d');
      const isEmpty = typeof this.models === 'undefined' || this.models.length === 0;
      const datasets = this.models.map((manager, index) => {
        const range = (255 * (index + 1) / this.models.length).toFixed(0);
        const alpha = range / 255;
        const rgb = this.hexToRgb(this.colorSecondary);
        return {
          label: manager.name,
          data: manager.data.map(el => el.value),
          borderColor: `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`,
        };
      });

      // eslint-disable-next-line no-new
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: isEmpty ? ['Empty'] : [...this.models[0].data.map(el => el.date)],
          datasets,
        },
      });
    },
  },
  mounted() {
    this.renderChart();
  },
};
</script>
