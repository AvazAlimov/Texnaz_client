<template lang="pug">
    v-layout(wrap)
        v-flex(xs12)
            v-layout(align-center justify-space-betweeb)
                v-select(
                    name="regions"
                    v-model="province"
                    :items="provinces"
                    item-text="name"
                    item-value="id"
                ).ma-2
                v-select(
                    name="types"
                    v-model="type"
                    :items="types"
                    item-text="name"
                    item-value="id"
                ).ma-2
                v-select(
                    name="brands"
                    v-model="brand"
                    :items="brands"
                    item-text="name"
                    item-value="id"
                ).ma-2
                v-menu(
                  v-model="startMenu"
                  :close-on-content-click="false"
                  full-width
                  min-width="290px"
                ).ma-2
                  template(v-slot:activator="{ on }")
                    v-text-field(
                      readonly
                      v-on="on"
                      v-model="startDate"
                      label="От"
                    )
                  v-date-picker(
                    v-model="startDate"
                    @input="startMenu = false"
                    :max="maximum"
                  )
                v-menu(
                  v-model="endMenu"
                  :close-on-content-click="false"
                  full-width
                  min-width="290px"
                ).ma-2
                  template(v-slot:activator="{ on }")
                    v-text-field(
                      readonly
                      v-on="on"
                      v-model="endDate"
                      label="До"
                    )
                  v-date-picker(
                    v-model="endDate"
                    @input="endMenu = false"
                    :max="maximum"
                  )
                v-btn(icon @click="getItems()").secondary--text
                    v-icon table_chart

        v-flex(xs12)
            v-data-table(
                :loading="loading"
                :headers="headers"
                :items="items"
            )
                template(v-slot:items="{ item }")
                    tr
                        td {{ item.province }}
                        td {{ item.ceo }}
                        td {{ item.numSupervisors }}
                        td {{ item.numManagers }}
                        td {{ item.numClients }}
                        td -
                        td -
</template>
<script>
import Province from '@/services/Province';
import Brand from '@/services/Brand';
import User from '@/services/User';
import Client from '@/services/Client';

export default {
  data() {
    return {
      maximum: (new Date()).toISOString().substring(0, 10),
      startDate: (new Date()).toISOString().substring(0, 10),
      endDate: (new Date()).toISOString().substring(0, 10),
      startMenu: false,
      endMenu: false,
      province: 0,
      provinces: [],
      type: 0,
      types: [
        {
          id: 0,
          name: 'Оплата',
        },
        {
          id: 1,
          name: 'Отгрузка',
        },
      ],
      brand: 0,
      brands: [],
      from: null,
      to: null,
      loading: false,
      headers: [
        {
          text: 'Province',
          value: 'province',
        },
        {
          text: 'CEO',
          value: 'ceo',
        },
        {
          text: 'numSupervisors',
          value: 'numSupervisors',
        },
        {
          text: 'numManagers',
          value: 'numManagers',
        },
        {
          text: 'numClients',
          value: 'numClients',
        },
        {
          text: 'numActives',
          value: 'numActives',
        },
        {
          text: 'totalAmount',
          value: 'totalAmount',
        },
      ],
      items: [],
    };
  },
  methods: {
    sort(array) {
      array.push({
        id: 0,
        name: 'All',
      });
      array.sort((a, b) => (a > b ? 1 : -1));
    },
    getAll() {
      Promise.all([
        Province.getAll(),
        Brand.getAll(),
      ]).then((result) => {
        [this.provinces, this.brands] = result;
        this.sort(this.provinces);
        this.sort(this.brands);
      });
    },
    getItems() {
      this.items = [];
      this.loading = true;
      Promise.all([
        this.province === 0 ? Province.getAll() : Province.get(this.province),
        this.province === 0 ? User.getAll() : User.getByProvince(this.province),
        this.province === 0 ? Client.getAll() : Client.getByProvince(this.province),
      ]).then((result) => {
        const [provinces, users, clients] = result;
        provinces.forEach((province) => {
          const findCeo = users.find(user => user.province.id === province.id
                && user.roles.map(role => role.id).includes(8));
          this.items.push({
            province: province.name,
            ceo: findCeo ? findCeo.name : '-',
            numSupervisors: users.filter(user => user.province.id === province.id
                && user.roles.map(role => role.id).includes(7)).length,
            numManagers: users.filter(user => user.province.id === province.id
                && user.roles.map(role => role.id).includes(2)).length,
            numClients: clients.filter(client => client.province.id === province.id).length,
          });
        });
      })
        .catch((err) => {
          this.$store.commit('setMessage', err.message);
        })
        .finally(() => { this.loading = false; });
    },
  },
  created() {
    this.getAll();
  },
};
</script>
