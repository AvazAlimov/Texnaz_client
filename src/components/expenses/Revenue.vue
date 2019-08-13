<template lang="pug">
    .border.white
        v-layout(wrap align-center).px-4.py-3.mb-2
            .title.mr-5 Прибыль
            //
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
            v-text-field(
              v-model="search"
              append-icon="search"
              label="Поиск"
            )
        v-layout
            v-flex(xs12)
                v-data-table(
                    :headers="headers"
                    hide-actions
                    :search="search"
                    :items="items"
                )
                  template(v-slot:items="{ item }")
                    td {{ item.year }}
                    td {{ getMonth(item.month) }}
                    td {{ item.totalPayments }}
                    td {{ item.totalExpanses }}
                    td {{ item.revenue }}
                    td {{ item.proporsion }}
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
      endDate: '',
      date: (new Date()).toISOString().substring(0, 7),
      items: [],
      payments: [],
      totalRevenue: 0,
    };
  },
  computed: {
    totalPayments() {
      return this.readable(this.payments
        .map(el => ((el.ratio === 1) ? el.sum : (el.sum / el.ratio)))
        .reduce((a, b) => a + b, 0));
    },
    totalExpanses() {
      return this.readable(this.expanses
        .map(el => el.value).reduce((a, b) => a + b, 0));
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
          text: `Оплаты ($${this.totalPayments})`,
          value: 'totalPayments',
        },
        {
          text: `Расходы ($${this.totalExpanses})`,
          value: 'totalExpanses',
        },
        {
          text: `Прибыль ($${this.readable(this.totalRevenue)})`,
          value: 'revenue',
        },
        {
          text: '%',
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
      this.totalRevenue = 0;
      Promise.all([
        Payment.getByUser(this.$getUserId()),
      ]).then((result) => {
        [this.payments] = result;

        this.payments.forEach((payment) => {
          const date = new Date(payment.createdAt);
          // eslint-disable-next-line no-param-reassign
          payment.date = `${date.getMonth()},${date.getFullYear()}`;
        });
        this.expanses.forEach((expanse) => {
          const date = new Date(expanse.createdAt);
          // eslint-disable-next-line no-param-reassign
          expanse.date = `${date.getMonth()},${date.getFullYear()}`;
        });
        const allmixed = [...new Set(this.payments.concat(this.expanses).map(el => el.date))];
        allmixed.forEach((el) => {
          const totalPayments = this.payments
            .filter(payment => payment.date === el)
            .map(payment => (payment.ratio === 1 ? payment.sum : (payment.sum / payment.ratio)))
            .reduce((a, b) => a + b, 0);
          const totalExpanses = this.expanses
            .filter(expanse => expanse.date === el)
            .map(expanse => expanse.value)
            .reduce((a, b) => a + b, 0);
          this.totalRevenue += totalPayments - totalExpanses;
          this.items.push({
            year: el.split(',')[1],
            month: el.split(',')[0],
            totalPayments: this.readable(totalPayments),
            totalExpanses: this.readable(totalExpanses),
            revenue: this.readable(totalPayments - totalExpanses),
            proporsion: this.readable(((totalPayments - totalExpanses) / totalExpanses) * 100),
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
