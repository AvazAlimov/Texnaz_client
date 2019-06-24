<template lang="pug">
    v-card(elevation="5").mx-2.mt-2
      v-card-text.pa-2
          .title.grey--text.text--darken-2.mt-2.text-md-center  {{ title }}
          canvas#totalBrandPie
</template>
<script>
/**
 * Expected Model
 *  {
 *    name: 'BrandName',
 *    quantity: 'TotalSoldQuantity',
 *  }
 */
import Chart from "chart.js";
import ColorGenerator from "../../utils/ColorGenerator";
export default {
  props: ["title", "models"],
  methods: {
    renderPie() {
      const total = this.models
        .map(el => el.quantity)
        .reduce((a, b) => a + b, 0);
      new Chart("totalBrandPie", {
        type: "pie",
        data: { 
          labels:
            total === 0
              ? ["Empty"]
              : this.models.map(
                  el =>
                    `${el.name} ${((el.quantity * 100) / total || 0).toFixed(
                      2
                    )}%`
                ),
          datasets: [
            {
              data: this.models.map(el => el.quantity),
              backgroundColor:
                total === 0
                  ? ["rgba(0,0,0,0.05)"]
                  : this.models.map(el => ColorGenerator.getRandomColor())
            }
          ]
        },
        options:{
          responsive:true
        }
      });
    }
  },
  mounted() {
    this.renderPie();
  }
};
</script>
<style scoped>
</style>
