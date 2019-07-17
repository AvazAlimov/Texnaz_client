<template lang="pug">
    v-layout(wrap)
        .border.white
            v-data-table(
                :headers="headers"
                :items="users"
                hide-actions
            )
                template(v-slot:items="props")
                    LateDebt(:user="props.item")
</template>

<script>
import Sale from '@/services/Sale';
import Configuration from '@/services/Configuration';

export default {
  data() {
    return {
      headers: [
        {
          text: 'Икк',
          value: 'icc',
        },
        {
          text: 'Наименование',
          value: 'name',
        },
        {
          text: 'Дата отгрузки',
          value: 'saleDate',
        },
        {
          text: 'Сумма долги',
          value: 'salePrice',
        },
        {
          text: 'Менеджер',
          value: 'manager',
        },
        {
          text: 'количество дней',
          value: 'debt',
        },
      ],
      users: [
        {
          icc: 12,
          name: 12,
          saleDate: 12,
          salePrice: 12,
          manager: 12,
          daysLate: 12,
        },
      ],
    };
  },
  methods: {
    getDuration(startTime, duration) {
      const mm = (new Date()).getTime() - (new Date(startTime)).getTime();
      const days = Math.round(mm / (3600000 * 24));
      return duration < days ? days : '';
    },
    getAll() {
      this.users = [];
      Promise.all([
        Sale.getAll(),
        Configuration.getExchangeRate(),
        Configuration.getOfficialRate(),
      ]).then((result) => {
        result[0].forEach((el) => {
          const duration = this.getDuration(el.createdAt, el.days);
          if (duration) {
            this.users.push({
              icc: el.client.icc,
              name: el.client.name,
              saleDate: el.createdAt,
              salePrice: this.$getTotalPrice(el, result[1].value, result[2].value)
               - el.client.payments.map(payment => payment.sum).reduce((a, b) => a + b, 0),
              manager: el.manager.name,
              daysLate: duration,
            });
          }
        });
      });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

<style>

</style>
