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
                  v-model="user.provinceId"
                  :items="provinces"
                  label="Область"
                  item-text="name"
                  item-value="id"
                  name="province"
                  v-validate="'required'"
                  color="secondary"
                )
                v-select(
                    v-model="user.roles"
                    :items="fixedRoles"
                    label="Роли"
                    :disabled="!!errors.items.find(item => item.field === 'province')"
                    item-text="name"
                    item-value="id"
                    multiple
                    name="roles"
                    v-validate="'required'"
                    color="secondary")
                v-select(
                    v-model="user.controllerId"
                    :items="controllers"
                    :label="extraLabel"
                    v-show="isEnabled"
                    item-text="name"
                    item-value="id"
                    name="controller"
                    v-validate="isEnabled ? 'required' : ''"
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
import Province from '@/services/Province';

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
        controllerId: null,
        provinceId: null,
        roles: [],
      },
      users: [],
      provinces: [],
      fixedRoles: [],
      controllerId: [],
      loading: false,
    };
  },
  computed: {
    extraLabel() {
      return this.user.roles.find(role => role === 2 || role === 9) ? 'Supervisor' : 'CEO';
    },
    controllers() {
      if (this.user.roles.find(role => role === 2 || role === 9)) {
        return this.users.filter(user => user.province.id === this.user.provinceId && user.roles
          .map(role => role.id).includes(7));
      }

      return this.users.filter(user => user.province.id === this.user.provinceId && user.roles
        .map(role => role.id).includes(8));
    },
    isEnabled() {
      return this.user.roles.length
        ? !!this.user.roles.find(role => role === 2 || role === 7 || role === 9) : false;
    },
  },
  methods: {
    submit() {
      if (!this.user.roles
        .find(role => role === 2 || role === 7)) { this.user.controllerId = null; }
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
    Promise.all([
      Roles.getAll(),
      Province.getAll(),
      User.getAll(),
    ])
      .then((result) => { [this.fixedRoles, this.provinces, this.users] = result; });
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      User.get(this.$route.params.id)
        .then((user) => {
          this.user.name = user.name;
          this.user.username = user.username;
          this.user.roles = user.roles.map(role => role.id);
          this.user.provinceId = user.province.id;
        });
    }
  },
  mounted() {
    this.$validator.validateAll();
  },
};
</script>
