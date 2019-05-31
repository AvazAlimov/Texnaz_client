<template lang="pug">
    .pa-4
        v-layout(row wrap)
            v-flex(xs6 text-xs-center)
                .title Типы расходов
                canvas#pieChartForms
            v-flex(xs6 text-xs-center)
                .title Виды расходов
                canvas#pieChartTypes
            v-flex.mt-4(xs6 text-xs-center)
                .title Назначение расходов
                canvas#pieChartPurposes
            v-flex.mt-4(xs6 text-xs-center)
                .title Лицо
                canvas#pieChartPeople
</template>

<script>
import Chart from 'chart.js';
import ColorGenerator from '../../utils/ColorGenerator';

export default {
  name: 'ExpenseAnalytics',
  props: {
    expenses: {
      required: true,
    },
    types: {
      required: true,
    },
    forms: {
      required: true,
    },
    purposes: {
      required: true,
    },
    people: {
      required: true,
    },
  },
  computed: {
    total() {
      let sum = 0;
      this.expenses.forEach((element) => { sum += element.value; });
      return sum;
    },
  },
  methods: {
    data(set) {
      const forms = Array(set.length);
      this.expenses.forEach((expense) => {
        set.forEach((form, index) => {
          if (form.id === expense.formId) {
            forms[index] = (forms[index] || 0) + parseFloat(expense.value);
          }
        });
      });
      return {
        datasets: [{
          data: forms,
          backgroundColor: set.map(() => ColorGenerator.getRandomColor()),
        }],
        labels: set.map((form, index) => `${form.name} ${((forms[index] * 100 / this.total) || 0).toFixed(2)}%`),
      };
    },
    renderChart() {
      const charts = [
        {
          ctx: 'pieChartForms',
          set: this.forms,
        },
        {
          ctx: 'pieChartTypes',
          set: this.types,
        },
        {
          ctx: 'pieChartPurposes',
          set: this.purposes,
        },
        {
          ctx: 'pieChartPeople',
          set: this.people,
        },
      ];
      charts.forEach((chart) => {
        // eslint-disable-next-line no-new
        new Chart(chart.ctx, {
          type: 'pie',
          data: this.data(chart.set),
        });
      });
    },
  },
  mounted() {
    this.renderChart();
  },
};
</script>
