<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'users' }").tertiary--text
            v-icon arrow_back
        .title.tertiary--text {{ id == null ? 'Добавить' : 'Сохранить' }} пользователя
        v-flex(xs12).mt-3
            .border.white.pa-4
                v-text-field(
                    v-model="user.name"
                    label="Имя"
                    name="name"
                    v-validate="'required'"
                   color="secondary")
                v-text-field(
                    v-model="user.username"
                    label="Имя пользователя"
                    name="username"
                    v-validate="'required'"
                    color="secondary")
                v-text-field(
                    v-model="user.password"
                    label="Пароль"
                    name="password"
                    v-validate="'required'"
                    color="secondary")
                v-select(
                    v-model="user.roles"
                    :items="fixedRoles"
                    label="Роли"
                    item-text="name"
                    item-value="id"
                    multiple
                    name="roles"
                    v-validate="'required'"
                    color="secondary")
                v-layout
                    v-spacer
                    v-btn(
                        :loading="loading"
                        :disabled="errors.items.length > 0"
                        flat color="secondary"
                        @click="submit") {{ id == null ? 'Добавить' : 'Сохранить' }}
</template>

<script>
import User from '@/services/User';
import Roles from '@/services/Roles';

export default {
  name: 'User',
  $_veeValidate: {
    validator: 'new',
  },
  data() {
    return {
      id: null,
      user: {
        name: '',
        username: '',
        password: '',
        roles: [],
      },
      fixedRoles: [],
      loading: false,
    };
  },
  methods: {
    submit() {
      if (!this.id) this.create();
      else this.update();
    },
    execute(promise) {
      this.loading = true;
      promise
        .then(() => this.$router.push({ name: 'users' }))
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => { this.loading = false; });
    },
    create() {
      this.execute(User.create(this.user));
    },
    update() {
      this.execute(User.update(this.id, this.user));
    },
  },
  created() {
    Roles.getAll().then((roles) => { this.fixedRoles = roles; });
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      User.get(this.$route.params.id)
        .then(({ name, username, roles }) => {
          this.user.name = name;
          this.user.username = username;
          this.user.roles = roles.map(role => role.id);
        });
    }
  },
  mounted() {
    this.$validator.validateAll();
  },
};
</script>
