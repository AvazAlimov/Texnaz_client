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
                    name="password"
                    v-model="user.password"
                    label="Пароль"
                    v-validate="'required'"
                    color="secondary")
                v-select(
                  name="territory"
                  v-model="user.territoryId"
                  label="Tерритория"
                  :items="territories"
                  item-text="name"
                  item-value="id"
                  v-validate="'required'"
                )
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
                v-select(
                  name="province"
                  label="Область"
                  v-model="user.provinces"
                  v-show="user.roles.includes(7)"
                  :items="provinces"
                  item-text="name"
                  item-value="id"
                  v-validate="user.roles.includes(7) ? 'required' : ''"
                  multiple
                  clearable
                )

                // If it is Manager
                v-select(
                  name="supervisors"
                  label="Supervisors"
                  v-model="user.controllerId"
                  :items="supervisors"
                  v-show="user.roles.includes(2)"
                  item-text="name"
                  v-validate="user.roles.includes(2) ? 'required' : ''"
                  item-value="id"
                )
                // If it is Supervisor
                v-select(
                  name="ceoes"
                  label="Территориальный менеджер"
                  v-model="user.controllerId"
                  :items="ceoes"
                  v-show="user.roles.includes(7)"
                  item-text="name"
                  v-validate="user.roles.includes(7) ? 'required' : ''"
                  item-value="id"
                )
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
import Territory from '@/services/Territory';

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
        territoryId: null,
        provinces: [],
        roles: [],
      },
      users: [],
      territories: [],
      provinces: [],
      fixedRoles: [],
      loading: false,
    };
  },
  computed: {
    supervisors() {
      return this.users.filter(user => (user.territoryId === this.user.territoryId)
        && user.roles.map(role => role.id).includes(7));
    },
    ceoes() {
      return this.users.filter(user => (user.territoryId === this.user.territoryId)
       && user.roles.map(role => role.id).includes(8));
    },
  },
  watch: {
    user: {
      handler(user) {
        this.provinces = user.territoryId
          ? this.territories.find(el => el.id === user.territoryId).provinces : [];
      },
      deep: true,
    },
  },
  methods: {
    submit() {
      if (!this.user.roles
        .find(role => role === 2 || role === 7)) { this.user.controllerId = null; }
      if (!this.user.roles
        .find(role => role === 7)) { this.user.provinces = null; }
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
      Territory.getAll(),
      User.getAll(),
    ])
      .then((result) => { [this.fixedRoles, this.territories, this.users] = result; });
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
