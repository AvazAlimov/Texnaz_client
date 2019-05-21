<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'clients' }")
            v-icon arrow_back
        .title {{ id == null ? 'Добавить' : 'Сохранить' }} клиента

        v-flex(xs12).mt-3.border.white.pa-4
          v-layout(row wrap)
            v-flex(xs6)
              v-text-field(
                  v-model="client.icc"
                  label="ИКК"
                  color="secondary"
                  name="ИКК"
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
                  v-validate="'required'"
              )
              v-text-field(
                  v-model="client.phone"
                  label="Номер телефон"
                  color="secondary"
                  name="Номер телефон"
                  v-validate="'required'"
              )
            v-flex(xs6)
              v-text-field(
                  v-model="client.sphere"
                  label="Направление деятельности"
                  color="secondary"
                  name="Направление деятельности"
                  v-validate="'required'"
              )
              v-select(
                      v-model="province"
                      :items="provinces"
                      item-value="id"
                      item-text="name"
                      label="Область"
                      color="secondary")
              v-select(
                      v-model="client.regionId"
                      :items="filteredRegions"
                      item-text="name"
                      item-value="id"
                      label="Регион"
                      color="secondary"
                      name="Регион"
                      v-validate="'required'")
              v-select(
                      v-model="client.managerId"
                      :items="managers"
                      item-text="name"
                      item-value="id"
                      label="Менеджер"
                      color="secondary"
                      name="Менеджер"
                      v-validate="'required'")
            v-flex(xs12)
              v-layout(row wrap)
                v-layout
                  v-spacer
                  v-btn(:loading="loading"
                    :disabled="errors.items.length > 0"
                    flat color="secondary"
                    @click="submit") {{ id == null ? 'Добавить' : 'Сохранить' }}
</template>

<script>
import User from '@/services/User';
import Client from '@/services/Client';
import Region from '@/services/Region';

export default {
  name: 'Client',
  data() {
    return {
      id: null,
      province: null,
      client: {
        icc: '',
        name: '',
        itn: '',
        contactPerson: '',
        phone: '',
        regionId: null,
        sphere: '',
        managerId: null,
      },
      provinces: [],
      regions: [],
      managers: [],
      loading: false,
    };
  },
  computed: {
    filteredRegions() {
      if (this.province) {
        return this.regions.filter(region => region.provinceId === this.province);
      }
      return [];
    },
  },
  methods: {
    getAll() {
      this.loading = true;
      Promise.all([
        User.getAll(),
        Region.getAll(),
        Client.getAll(),
      ])
        .then((result) => {
          const [users, regions, clients] = result;
          this.managers = users.filter((user) => {
            const managerRole = user.roles.filter(role => role.id === 2);
            return managerRole.length;
          });

          regions.forEach((region) => {
            if (!this.provinces.find(province => province.id === region.provinceId)) {
              this.provinces.push(region.province);
            }
          });
          this.regions = regions;

          // eslint-disable-next-line no-nested-ternary
          clients.sort((a, b) => ((a.icc > b.icc) ? -1 : ((b.icc > a.icc) ? 1 : 0)));
          if (clients.length) {
            if (parseInt(clients[0].icc, 10)) {
              this.client.icc = parseInt(clients[0].icc, 10) + 1;
            } else {
              this.client.icc = '';
            }
          } else {
            this.client.icc = 1;
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
        .then(() => this.$router.push({ name: 'clients' }))
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
          this.province = client.region.provinceId;
        });
    }
  },
  mounted() {
    this.$validator.validateAll();
  },
};
</script>
