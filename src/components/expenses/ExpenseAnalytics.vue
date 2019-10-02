<template lang="pug">
  .px-4.pb-4
    v-layout(row wrap)
      v-flex(xs12)
        v-layout(row align-center)
            .title.mr-2 От:
            v-dialog(
              v-model="startModal"
              full-width
              width="290px")
              template(v-slot:activator="{ on }")
                v-text-field(
                  clearable
                  color="secondary"
                  v-model="start"
                  readonly
                  v-on="on"
                  style="max-width: 120px;")
              v-date-picker(
                v-model="start"
                no-title
                @input="startModal = false"
                color="secondary")
            .title.ml-4.mr-2 До:
            v-dialog(
              v-model="endModal"
              full-width
              width="290px")
              template(v-slot:activator="{ on }")
                v-text-field(
                  clearable
                  color="secondary"
                  v-model="end"
                  readonly
                  v-on="on"
                  style="max-width: 120px;")
              v-date-picker(
                v-model="end"
                no-title
                @input="endModal = false"
                color="secondary")

      v-flex.mt-4(xs6 text-xs-center)
        .title Типы расходов
        canvas#pieChartForms
      v-flex.mt-4(xs6 text-xs-center)
        .title Виды расходов
        canvas#pieChartTypes
      v-flex.mt-4(xs6 text-xs-center)
        .title Назначение расходов
        canvas#pieChartPurposes
      v-flex.mt-4(xs6 text-xs-center)
        .title Лицо
        canvas#pieChartPeople
      v-flex(xs12 text-xs-center).mt-4
        v-layout(row align-center justify-center)
          .title.mr-2 Распределение по
          v-select(
            v-model="format"
            :items="ranges"
            item-text="title"
            item-value="format"
            color="secondary"
            style="max-width: 100px;")
        canvas#histogram
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
  data: () => ({
    start: null,
    end: null,
    startModal: false,
    endModal: false,
    barChart: null,
    format: 'YYYY-MM-DD',
    ranges: [
      {
        format: 'YYYY-MM-DD',
        title: 'дням',
      },
      {
        format: 'YYYY-MM',
        title: 'месяцам',
      },
      {
        format: 'YYYY',
        title: 'годам',
      },
    ],
  }),
  computed: {
    inPeriodExpenses() {
      let filtered = JSON.parse(JSON.stringify(this.expenses));
      if (this.start) {
        filtered = filtered.filter(item => this.$moment(item.createdAt)
          .isAfter(this.$moment(this.start)));
      }
      if (this.end) {
        filtered = filtered.filter(item => this.$moment(item.createdAt)
          .isBefore(this.$moment(this.end).add(1, 'd')));
      }
      return filtered;
    },
    total() {
      let sum = 0;
      this.inPeriodExpenses.forEach((item) => { sum += item.value; });
      return sum;
    },
  },
  methods: {
    data({ set, key }) {
      const forms = Array(set.length);
      this.inPeriodExpenses.forEach((expense) => {
        set.forEach((form, index) => {
          if (form.id === expense[key]) {
            forms[index] = (forms[index] || 0) + parseFloat(expense.value);
          }
        });
      });
      const isEmpty = forms.reduce((a, b) => a + b, 0) === 0;
      return {
        datasets: [{
          data: isEmpty ? [100] : forms,
          backgroundColor: isEmpty ? ['rgba(0, 0, 0, 0.05)']
            : set.map(() => ColorGenerator.getRandomColor()),
        }],
        labels: isEmpty ? ['Нет расходов']
          : set
            .filter((form, index) => forms[index] > 0)
            .map((form, index) => `${form.name} ${((forms[index] * 100 / this.total) || 0).toFixed(2)}%`),
      };
    },
    renderPieCharts() {
      const charts = [
        {
          ctx: 'pieChartForms',
          set: this.forms,
          key: 'formId',
        },
        {
          ctx: 'pieChartTypes',
          set: this.types,
          key: 'typeId',
        },
        {
          ctx: 'pieChartPurposes',
          set: this.purposes,
          key: 'purposeId',
        },
        {
          ctx: 'pieChartPeople',
          set: this.people,
          key: 'personId',
        },
      ];
      charts.forEach((chart) => {
        // eslint-disable-next-line no-new
        new Chart(chart.ctx, {
          type: 'pie',
          data: this.data(chart),
        });
      });
    },
    renderBarChart() {
      const labels = [...new Set(
        this.inPeriodExpenses.map(a => this.$moment(a.createdAt).format(this.format)),
      // eslint-disable-next-line no-nested-ternary
      )].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
      const data = Array(labels.length);
      this.inPeriodExpenses.forEach((expense) => {
        const label = this.$moment(expense.createdAt).format(this.format);
        const index = labels.lastIndexOf(label);
        data[index] = (data[index] || 0) + expense.value;
      });
      if (this.barChart) this.barChart.destroy();
      this.barChart = new Chart('histogram', {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }],
        },
        options: {
          legend: { display: false },
          scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
        },
      });
    },
  },
  watch: {
    format() {
      this.renderBarChart();
    },
    start() {
      this.renderBarChart();
      this.renderPieCharts();
    },
    end() {
      this.renderBarChart();
      this.renderPieCharts();
    },
  },
  mounted() {
    this.renderPieCharts();
    this.renderBarChart();
  },
};
</script>
