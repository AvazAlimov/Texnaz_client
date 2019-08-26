<template lang="pug">
  div
    v-layout(row wrap v-if="path == 'managers'")
        v-flex(xs12).mb-3
            .title.tertiary--text МЕНЕДЖЕРЫ
        v-flex(xs4 v-for="(manager, index) in managers" :key="index")
          Card(
            :title="manager.name"
            :subtitle="manager.username"
            icon="account_circle"
            :to="{ name: 'manager', params: { id: manager.id }}"
          )
        //
          v-flex(xs4)
            Card(
              title="Добавить"
              subtitle="Новый менеджер"
              icon="add"
              :to="{ name: 'template_manager' }"
            )
    router-view
</template>

<script>
import User from '@/services/User';

export default {
  name: 'Managers',
  data() {
    return {
      managers: [],
    };
  },
  computed: {
    path() {
      return this.$route.name;
    },
  },
  methods: {
    getAll() {
      this.managers = [];
      User.getAll()
        .then((users) => {
          this.managers = users.filter(user => user.roles.filter(role => role.id === 2));
        })
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => { this.loading = false; });
    },
  },
  created() {
    this.getAll();
  },
};
</script>
