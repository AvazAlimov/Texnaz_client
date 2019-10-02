<template lang="pug">
    .border.white
        v-layout(wrap align-center).px-4.py-3.mb-2
            .title.mr-5 Прибыль
            v-menu(
              v-model="start"
              :close-on-content-click="false"
              min-width="290px"
            ).mr-2
              template(v-slot:activator="{ on }")
                v-text-field(
                  readonly
                  v-on="on"
                  label="Дата"
                  v-model="startDate"
                )
              v-date-picker(
                v-model="startDate"
                @input="start = false"
                type="month"
              )
            v-menu(
              v-model="end"
              :close-on-content-click="false"
              min-width="290px"
            ).ml-2
              template(v-slot:activator="{ on }")
                v-text-field(
                  readonly
                  v-on="on"
                  label="Дата"
                  v-model="endDate"
                )
              v-date-picker(
                v-model="endDate"
                @input="end = false"
                type="month"
              )
            v-spacer
        v-layout
            v-flex(xs12)
                v-data-table(
                    :headers="headers"
                    :items="filteredData"
                )
                  template(v-slot:items="{ item }")
                    td {{ item.year }}
                    td {{ item.month }}
                    td {{ readable(item.totalPayments) }}
                    td {{ readable(item.totalExpanses) }}
                    td {{ readable(item.revenue) }}
                    td {{ readable(item.proporsion) }}
</template>
<script>
import Payment from '@/services/Payment';

export default {
  props: {
    expanses: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      start: false,
      end: false,
      search: '',
      startDate: '',
      endDate: (new Date()).toISOString().substring(0, 7),
      date: (new Date()).toISOString().substring(0, 7),
      items: [],
      payments: [],
    };
  },
  computed: {
    filteredData() {
      const start = new Date(this.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 59);
      return this.items.filter(el => new Date(el.date).getTime() >= start.getTime()
        && new Date(el.date).getTime() <= end.getTime());
    },
    totalPayments() {
      return this.filteredData
        .map(el => el.totalPayments)
        .reduce((a, b) => a + b, 0);
    },
    totalExpanses() {
      return this.filteredData
        .map(el => el.totalExpanses).reduce((a, b) => a + b, 0);
    },
    totalRevenue() {
      return this.totalPayments - this.totalExpanses;
    },
    totalProportion() {
      return this.filteredData
        .map(el => el.proporsion)
        .reduce((a, b) => a + b, 0)
        / this.filteredData.length;
    },
    headers() {
      return [
        {
          text: 'Год',
          value: 'year',
        },
        {
          text: 'Месяц',
          value: 'month',
        },
        {
          text: `Оплаты ($${this.readable(this.totalPayments)})`,
          value: 'totalPayments',
        },
        {
          text: `Расходы ($${this.readable(this.totalExpanses)})`,
          value: 'totalExpanses',
        },
        {
          text: `Прибыль ($${this.readable(this.totalRevenue)})`,
          value: 'revenue',
        },
        {
          text: `% ${Number.isNaN(this.totalProportion) ? 0 : this.readable(this.totalProportion)}`,
          value: 'proporsion',
        },
      ];
    },
  },
  methods: {
    readable(value) {
      return this.$options.filters.readable(
        this.$options.filters.roundUp(value),
      );
    },
    getMonth(index) {
      const month = [];
      month[0] = 'January';
      month[1] = 'February';
      month[2] = 'March';
      month[3] = 'April';
      month[4] = 'May';
      month[5] = 'June';
      month[6] = 'July';
      month[7] = 'August';
      month[8] = 'September';
      month[9] = 'October';
      month[10] = 'November';
      month[11] = 'December';
      return month[index];
    },
    getAll() {
      Promise.all([
        Payment.getByUser(this.$getUserId()),
      ]).then((result) => {
        [this.payments] = result;

        this.payments.forEach((payment) => {
          const date = new Date(payment.createdAt);
          // eslint-disable-next-line no-param-reassign
          payment.date = `${date.getFullYear()},${date.getMonth()}`;
        });
        this.expanses.forEach((expanse) => {
          const date = new Date(expanse.createdAt);
          // eslint-disable-next-line no-param-reassign
          expanse.date = `${date.getFullYear()},${date.getMonth()}`;
        });
        const allmixed = [...new Set(this.payments.concat(this.expanses).map(el => el.date))]
          .sort((a, b) => (new Date(a).getTime() > new Date(b).getTime() ? 1 : -1));
        console.log(allmixed);
        this.startDate = (new Date(allmixed[0])).toISOString().substring(0, 7);
        allmixed.forEach((el) => {
          const totalPayments = this.payments
            .filter(payment => payment.date === el)
            .map(payment => (payment.ratio === 1 ? payment.sum : (payment.sum / payment.ratio)))
            .reduce((a, b) => a + b, 0);
          const totalExpanses = this.expanses
            .filter(expanse => expanse.date === el)
            .map(expanse => expanse.value)
            .reduce((a, b) => a + b, 0);
          this.items.push({
            date: `${el.split(',')[0]}-${Number(el.split(',')[1]) + 1}`,
            year: el.split(',')[0],
            month: this.getMonth(el.split(',')[1]),
            totalPayments,
            totalExpanses,
            revenue: totalPayments - totalExpanses,
            proporsion: ((totalPayments - totalExpanses) / totalExpanses) * 100,
          });
        });
      });
    },
  },
  created() {
    this.getAll();
  },
};
</script>
