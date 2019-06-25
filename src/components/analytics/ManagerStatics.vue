<template lang="pug">
    v-card(elevation="0").border
      v-card-text.pt-4
        //Removed for data selector as pipeline
          v-overflow-btn(:items="dropdown" class="btn-viewer" label="Select")
        .title.text-md-center.mb-5 Manager Statics
        canvas#ManagerLineChart
</template>

<script>
/** 
 * Expected Model
 * {
 *    name: 'ManagerName',
 *    data: [
 *      {
 *        value: 'Number',
 *        date: 'Date When Achieved To The Value'
 *      }
 *      ...
 *    ]
 * }
 */
import Chart from "chart.js";
import ColorGenerator from "../../utils/ColorGenerator";

export default {
  props: ['dropdown','models'],
  methods: {
    dataSets(managers) {
      return managers.map(manager => {
        return {
          label: manager.name,
          data: manager.data.map(el => el.value),
          backgroundColor: [ColorGenerator.getRandomRGBA()]
        };
      });
    },
    renderChart() {
      const isEmpty = typeof this.models === "undefined" || this.models.length === 0;
      new Chart("ManagerLineChart", {
        type: "line",
        data: {
          labels: isEmpty ? ["Empty"] : [...this.models[0].data.map(el => el.date)],
          datasets: this.dataSets(this.models)
        },
      });
    }
  },
  mounted() {
    this.renderChart();
  }
};
</script>

<style scoped>
.btn-viewer {
  float: right;
  width: 100px;
}
canvas{
  height: 80%;
}
</style>
