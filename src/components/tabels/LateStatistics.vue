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
            LateStatisticsTable(
                :items="items"
                :headers="headers"
                :loading="loading"
                :expandedHeaders="expandedHeaders"
                :getPrice="getPrice"
            )
</template>
<script>
import Province from '@/services/Province';
import User from '@/services/User';
import Territory from '@/services/Territory';
import Sale from '@/services/Sale';

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
      brand: [0],
      brands: [],
      from: null,
      to: null,
      loading: false,
      expandedLoading: false,
      headers: [
        {
          text: 'Территория',
          value: 'province',
        },
        {
          text: 'Область',
          value: 'province',
        },
        {
          text: '< 30',
          value: 'tillThirty',
        },
        {
          text: '< 60',
          value: 'tillSixty',
        },
        {
          text: '< 90',
          value: 'tillNinety',
        },
        {
          text: '< 180',
          value: 'tillHuntreds',
        },
        {
          text: '180 <',
          value: 'tillMore',
        },
      ],
      items: [],
      expandedHeaders: [
        {
          text: 'Имя',
          value: 'clientName',
        },
        {
          text: '< 30',
          value: 'tillThirty',
        },
        {
          text: '< 60',
          value: 'tillSixty',
        },
        {
          text: '< 90',
          value: 'tillNinety',
        },
        {
          text: '< 180',
          value: 'tillHuntreds',
        },
        {
          text: '180 <',
          value: 'tillMore',
        },
      ],
    };
  },
  methods: {
    lateSales(sales) {
      sales.forEach((sale) => {
        const times = (new Date().getTime()) - (new Date(sale.createdAt).getTime());
        // eslint-disable-next-line no-param-reassign
        sale.lateDates = (times / (1000 * 3600 * 24));
        // eslint-disable-next-line no-param-reassign
        sale.totalPrice = sale.items.map(item => (sale.type === 3 ? item.debtPrice : (item.debtPrice
              / Number.parseFloat(sale.officialRate))));
      });
      return sales.filter(sale => !sale.isClosed && sale.shipped);
    },
    sort(array) {
      array.push({
        id: 0,
        name: 'Все',
      });
      array.sort((a, b) => (a > b ? 1 : -1));
    },
    getADay(from, to, { day, price }) {
      return (((to === -1) && (day < to))
        || ((day > from || day === from) && day < to)) ? price : 0;
    },
    getPrice(from, to, { sales }) {
      return sales.filter(sale => (((to === -1) && (sale.lateDates < to))
        || ((from < sale.lateDates || from === sale.lateDates) && sale.lateDates < to)))
        .map(sale => sale.totalPrice.reduce((a, b) => a + b, 0))
        .reduce((a, b) => a + b, 0);
    },
    getAll() {
      Province.getAll().then((result) => {
        this.provinces = result;
        this.sort(this.provinces);
      });
    },
    getUsers(users, idTerritory, roleId) {
      // if id 8 return only one element, else return as an array
      return roleId === 8 ? users.find(({ territoryId, roles }) => (territoryId === idTerritory
            && roles.map(({ id }) => id).includes(roleId)))
        : users.filter(({ territoryId, roles }) => (territoryId === idTerritory
            && roles.map(({ id }) => id).includes(roleId)));
    },
    getItems() {
      this.items = [];
      this.loading = true;
      Promise.all([
        Territory.getAll(),
        User.getAll(),
        Sale.getAll(),
      ]).then((result) => {
        const [territories, users, collection] = result;
        this.provinces.forEach((province) => {
          const territory = territories.find(({ provinces }) => provinces
            .map(item => item.id).includes(province.id));

          const managers = territory ? this.getUsers(users, territory.id, 2) : [];

          const sales = this.lateSales(collection)
            .filter(({ provinceId }) => provinceId === province.id);

          const clientIds = this.$unique(sales.map(({ client }) => client.id));

          this.items.push({
            id: province.id,
            territory: province.id !== 0 ? province.territory.name : '-',
            province: province.id !== 0 ? province.name : '-',
            sales,
            expandedItems: managers.map(manager => ({
              id: manager.id,
              name: manager.name,
              sales: sales.filter(({ managerId }) => managerId === manager.id),
              expandedUsers: clientIds.map((client) => {
                const sale = sales
                  .find(({ clientId, provinceId, client: { managerId } }) => client === clientId
                  && managerId === manager.id && provinceId === province.id);
                return {
                  id: sale ? sale.client.id : -1,
                  name: sale ? sale.client.name : '-',
                  sales: sale ? sales.filter(({ clientId }) => clientId === client) : [],
                };
              }),
            })),
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
