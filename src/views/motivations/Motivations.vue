<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12)
      .white.border
        .title.mx-4.my-3 Мотивации
        v-divider
        v-data-table(
          :headers="headers"
          :items="plans"
          :loading="loading"
          hide-actions)
          template(v-slot:items="props")
            td {{ props.item.manager.name }}
            td {{ props.item.start | moment('YYYY-MM-DD') }}
            td {{ props.item.end | moment('YYYY-MM-DD') }}
            td
              v-progress-linear(:value="(0 / props.item.total) * 100" color="secondary")
            td {{ 0 }} $
            td {{ props.item.createdAt | moment('YYYY-MM-DD') }}
        v-divider
        v-layout(row)
          v-spacer
          v-menu(offset-y)
            template(v-slot:activator="{ on }")
              v-btn.ma-0.mr-1(
                flat color="secondary"
                v-on="on") Добавить
            v-list
              v-list-tile(:to="{ name: 'plan' }")
                v-list-tile-title План
              v-list-tile(:to="{ name: 'percentage' }")
                v-list-tile-title Процент
              v-list-tile(:to="{ name: 'mix' }")
                v-list-tile-title Микс
</template>

<script>
import Plan from '@/services/Plan';

export default {
  name: 'Motivations',
  data: () => ({
    loading: false,
    plans: [],
    headers: [
      {
        text: 'Менеджер',
        value: 'menager.name',
      },
      {
        text: 'Срок от',
        value: 'start',
      },
      {
        text: 'Срок до',
        value: 'end',
      },
      {
        text: 'Прогресс',
        sortable: false,
      },
      {
        text: 'Вознаграждения',
        sortable: false,
      },
      {
        text: 'Добавлено',
        value: 'createdAt',
      },
    ],
  }),
  methods: {
    getAll() {
      Promise.all([
        Plan.getAll(),
      ])
        .then((results) => {
          [this.plans] = results;
        })
        .catch(error => this.$store.commit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
  },
  created() {
    this.getAll();
  },
};
</script>
