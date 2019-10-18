<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'clients' }").tertiary--text
            v-icon arrow_back
        .title.tertiary--text {{ id == null ? 'Добавить' : 'Сохранить' }} клиента

        v-flex(xs12).mt-3.border.white.pa-4
          v-layout(row wrap)
            v-flex(xs6)
              v-text-field(
                  v-model="client.icc"
                  label="ИКК"
                  color="secondary"
                  name="ИКК"
                  :error="client.icc === oldIcc ? !$route.params.id : !isUnique"
                  v-validate="'required'"
              )
              v-text-field(
                  v-model="client.name"
                  label="Наименование"
                  color="secondary"
                  name="Наименование"
                  v-validate="'required'"
              )
              v-text-field(
                  v-model="client.itn"
                  label="ИНН"
                  color="secondary"
                  name="ИНН"
                  v-validate="'required'"
              )
              v-text-field(
                  v-model="client.contactPerson"
                  label="Контактное лицо"
                  color="secondary"
                  name="Контактное лицо"
              )
              v-text-field(
                  v-model="client.phone"
                  label="+998123456789"
                  color="secondary"
                  name="Номер телефон"
                  v-validate="{\
                      required: true,\
                      phone: true,\
                      excluded: '',\
                    }"
              )
            v-flex(xs6)
              v-text-field(
                  v-model="client.sphere"
                  label="Направление деятельности"
                  color="secondary"
                  name="Направление деятельности"
              )
              v-select(
                      name="province"
                      v-model="client.provinceId"
                      :items="provinces"
                      item-value="id"
                      item-text="name"
                      label="Область"
                      v-validate="'required'"
                      color="secondary")
              // Supervisors list to filter managers dynamically
                v-select(
                        name="supervisor"
                        v-model="supervisor"
                        :items="supervisors"
                        item-value="id"
                        item-text="name"
                        label="Supervisors"
                        v-validate="'required'"
                        color="secondary")
              v-select(
                      v-model="client.managerId"
                      :items="mangers"
                      item-text="name"
                      item-value="id"
                      label="Менеджер"
                      color="secondary"
                      name="Менеджер"
                      v-validate="'required'")
              v-menu(
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px")
                template(v-slot:activator="{ on }")
                  v-text-field(
                    color="secondary"
                    v-model="client.createdAt"
                    label="Добавлен"
                    readonly v-on="on")
                v-date-picker(
                    color="secondary"
                    v-model="client.createdAt"
                    @input="menu = false")
            v-flex(xs12)
              v-layout(row wrap)
                v-layout
                  v-spacer
                  v-btn(:loading="loading"
                    :disabled="errors.items.length > 0 || !isUnique"
                    flat color="secondary"
                    @click="submit") {{ id == null ? 'Добавить' : 'Сохранить' }}
</template>

<script>
import User from '@/services/User';
import Client from '@/services/Client';
import Provinces from '@/services/Province';
import Territories from '@/services/Territory';


export default {
  name: 'Client',
  data() {
    return {
      id: null,
      menu: false,
      client: {
        icc: '',
        name: '',
        itn: '',
        contactPerson: '',
        phone: '',
        provinceId: null,
        regionId: 1,
        sphere: '',
        managerId: null,
        createdAt: (new Date()).toISOString().substring(0, 10),
      },
      supervisor: null,
      clients: [],
      users: [],
      provinces: [],
      regions: [],
      territories: [],
      loading: false,
      isUnique: false,
      oldIcc: '',
    };
  },
  computed: {
    filteredRegions() {
      if (this.province) {
        return this.regions.filter(region => region.provinceId === this.province);
      }
      return [];
    },
    supervisors() {
      const territory = this.territories.find(item => item.provinces
        .map(el => el.id).includes(this.client.provinceId));
      const supervisors = this.users.filter(user => (territory ? (user.territoryId === territory.id)
        && user.roles.map(role => role.id).includes(7) : false));
      return supervisors.filter(user => (user ? user.provinces
        .map(el => el.id).includes(this.client.provinceId) : false));
    },
    mangers() {
      const territory = this.territories.find(item => item.provinces
        .map(el => el.id).includes(this.client.provinceId));

      return (this.users.filter(user => this.supervisors
        .map(el => (el ? el.id : null)).includes(user.controller ? user.controller.id : -1)
          || (user.roles.map(role => role.id).includes(7)
            && user.provinces ? user.provinces
              .map(province => province.id).includes(this.client.provinceId) : false)
          || ((user.roles.map(role => role.id).includes(8))
            && (user.territoryId === (territory ? territory.id : -1)))));
    },
  },
  methods: {
    getAll() {
      this.loading = true;
      Promise.all([
        User.getAll(),
        Provinces.getAll(),
        Client.getAll(),
        Territories.getAll(),
      ])
        .then((result) => {
          [this.users, this.provinces, this.clients, this.territories] = result;

          if (!this.$route.params.id) {
            // eslint-disable-next-line no-nested-ternary
            this.clients.sort((a, b) => ((a.icc > b.icc) ? -1 : ((b.icc > a.icc) ? 1 : 0)));
            if (this.clients.length) {
              if (parseInt(this.clients[0].icc, 10)) {
                this.client.icc = (parseInt(this.clients[0].icc, 10) + 1).toString();
              } else {
                this.client.icc = '';
              }
            } else {
              this.client.icc = 1;
            }
          }
        })
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => { this.loading = false; });
    },
    submit() {
      if (!this.id) this.create();
      else this.update();
    },
    execute(promise) {
      this.loading = true;
      promise
        .then(() => {
          this.$router.push({ name: 'clients' });
          window.location.reload();
        })
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => { this.loading = false; });
    },
    create() {
      this.execute(Client.create(this.client));
    },
    update() {
      this.execute(Client.update(this.id, this.client));
    },
  },
  created() {
    this.getAll();
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      Client.get(this.$route.params.id)
        .then((client) => {
          this.client = client;
          this.oldIcc = client.icc;
          this.client.createdAt = this.client.createdAt.substring(0, 10);
          this.client.provinceId = client.province.id;
        });
    }
    this.isUnique = true;
  },
  watch: {
    client: {
      handler({ icc }) {
        Client.getByIcc(icc).then((clients) => {
          if (!this.$route.params.id) { this.isUnique = !clients.length; }
        });
      },
      deep: true,
    },
  },
  mounted() {
    this.$validator.validateAll();
  },
};
</script>
