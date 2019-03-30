<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon to="/")
            v-icon arrow_back
        .title ПОЛЬЗОВАТЕЛИ
        v-flex(xs12).mt-3
            .border.white
                v-data-table(:headers="headers" :items="users" hide-actions :loading="loading")
                    template(v-slot:items="props")
                        td {{ props.item.name }}
                        td {{ props.item.username }}
                        td
                          v-chip(
                            v-for="role in props.item.roles"
                            :key="role.id"
                            outline disabled
                            color="primary"
                            text-color="black") {{ role.name }}
                        td
                            v-layout
                                v-btn(icon :to="'/user/' + props.item.id").mx-0
                                    v-icon(color="primary" small) edit
                                v-btn(
                                  v-if="props.item.id > 1"
                                  icon
                                  @click="remove(props.item.id)").mx-0
                                    v-icon(color="primary" small) delete
                v-divider
                v-layout
                    v-spacer
                    v-btn.ma-2(flat color="primary" to="/user") Добавить
</template>

<script>
import User from '../services/User';

export default {
  name: 'Users',
  data() {
    return {
      headers: [
        {
          text: 'Имя',
          value: 'name',
        },
        {
          text: 'Имя пользователя',
          value: 'username',
        },
        {
          text: 'Роли',
          value: 'roles',
        },
        {
          sortable: false,
          width: 100,
        },
      ],
      users: [],
      loading: false,
    };
  },
  methods: {
    getAll() {
      this.loading = true;
      this.users = [];
      User.getAll()
        .then((users) => { this.users = users; })
        .catch(() => this.getAll())
        .finally(() => { this.loading = false; });
    },
    remove(id) {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (confirm('Это действие удалит элемент навсегда, вы уверены?')) {
        User.delete(id)
          .then(() => { this.getAll(); })
          .catch((error) => {
            this.$store.commit('setMessage', error.message);
          });
      }
    },
  },
  created() {
    this.getAll();
  },
};
</script>

<style scoped>
</style>
