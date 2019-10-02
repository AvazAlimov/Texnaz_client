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
                    clearable
                    multiple
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
                template(v-slot:items="props")
                  tr(@click="() => { props.expanded = !props.expanded }")
                    td {{ props.item.province }}
                    td {{ props.item.ceo }}
                    td {{ props.item.numSupervisors }}
                    td {{ props.item.numManagers }}
                    td {{ props.item.numClients }}
                    td {{ props.item.numActiveClients }}
                    td {{ props.item.totalAmount || 0 | roundUp | readable }}
                template(v-slot:expand="props")
                  .grey.lighten-4
                    v-data-table(
                      :headers="expandedHeaders"
                      :items="props.item.expandedItems"
                      :loading="expandedLoading"
                      hide-actions
                    )
                      template(v-slot:items="{ item }")
                        tr
                          td {{ item.name }}
                          td {{ item.controller }}
                          td {{ item.clients }}
                          td {{ item.activeClients }}
                          td(v-for="(el, index) in item.brands"
                            :key="index") {{ el.total || 0 | roundUp | readable }}
</template>
<script>
import Province from '@/services/Province';
import Brand from '@/services/Brand';
import User from '@/services/User';
import Client from '@/services/Client';
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
      brand: [0],
      brands: [],
      from: null,
      to: null,
      loading: false,
      expandedLoading: false,
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
          text: 'numActivesClients',
          value: 'numActiveClients',
        },
        {
          text: 'totalAmount',
          value: 'totalAmount',
        },
      ],
      items: [],
      expandedHeaders: [],
    };
  },
  methods: {
    isActive(client, collection) {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return !!collection.filter(({ createdAt }) => lastMonth < new Date(createdAt)).length;
    },
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
    getUsers(users, idTerritory, roleId) {
      // if id 8 return only one element, else return as an array
      return roleId === 8 ? users.find(({ territoryId, roles }) => (territoryId === idTerritory
            && roles.map(({ id }) => id).includes(roleId)))
        : users.filter(({ territoryId, roles }) => (territoryId === idTerritory
            && roles.map(({ id }) => id).includes(roleId)));
    },
    managerBrands(idManager, collection) {
      const managerBrands = [];
      const holder = collection
        .filter(({ shipped, managerId }) => shipped && managerId === idManager)
        .map(({ type, items, officialRate }) => (type === 3
          ? items.map(({ paidPrice, debtPrice, stock }) => ({
            total: this.type === 0 ? paidPrice : debtPrice,
            id: stock.product.brand,
          }))
          : items.map(({ paidPrice, debtPrice, stock }) => ({
            total: (this.type === 0 ? paidPrice : debtPrice) / officialRate,
            id: stock.product.brand,
          }))));
      holder.forEach((brand) => { brand.forEach(item => managerBrands.push(item)); });
      return managerBrands;
    },
    getItems() {
      this.items = [];
      this.loading = true;
      Promise.all([
        Territory.getAll(),
        User.getAll(),
        Client.getAll(),
        Sale.getAll(),
      ]).then((result) => {
        const [territories, users, allclients, collection] = result;
        this.provinces.forEach((province) => {
          const territory = territories.find(({ provinces }) => provinces
            .map(item => item.id).includes(province.id));

          const territoryManager = territory ? this.getUsers(users, territory.id, 8) : null;
          const supervisors = territory ? this.getUsers(users, territory.id, 7) : [];
          const managers = territory ? this.getUsers(users, territory.id, 2) : [];
          const clients = allclients.filter(({ provinceId }) => provinceId === province.id);
          const payments = collection
            .filter(({ shipped, provinceId }) => shipped && provinceId === province.id)
            .map(({ items, type, officialRate }) => (type === 3
              ? items.map(({ paidPrice }) => paidPrice).reduce((a, b) => a + b, 0)
              : items.map(({ paidPrice }) => paidPrice / officialRate).reduce((a, b) => a + b, 0)));

          const sales = collection
            .filter(({ shipped, provinceId }) => shipped && provinceId === province.id)
            .map(({ items, type, officialRate }) => (type === 3
              ? items.map(({ debtPrice }) => debtPrice)
                .reduce((a, b) => a + b, 0)
              : items.map(({ debtPrice }) => debtPrice / officialRate).reduce((a, b) => a + b, 0)));

          const eheaders = this.brand.includes(0) ? this.brands
            : this.brand.map(brandId => this.brands.find(({ id }) => id === brandId));

          this.expandedHeaders = [
            {
              text: 'name',
              value: 'name',
            },
            {
              text: 'controller',
              value: 'controller',
            },
            {
              text: 'totalClients',
              value: 'clients',
            },
            {
              text: 'activeClients',
              value: 'activeClients',
            },
          ].concat(eheaders.map(el => ({ text: el.name, value: el.name })));

          this.items.push({
            id: province.id,
            province: province.name,
            ceo: territoryManager ? territoryManager.name : '-',
            numSupervisors: supervisors ? supervisors.length : '-',
            numManagers: managers ? managers.length : '-',
            numClients: clients ? clients.length : '-',
            numActiveClients: clients ? clients
              .filter(client => this.isActive(client, collection.filter(({ approved, clientId }) => approved && clientId === client.id))).length : '-',
            totalAmount: (this.type === 0 ? payments : sales).reduce((a, b) => a + b, 0),
            expandedItems: managers.map(manager => ({
              name: manager.name,
              controller: manager.controller ? manager.controller.name : '-',
              clients: clients.filter(({ managerId }) => managerId === manager.id).length,
              activeClients: clients.filter(({ managerId }) => managerId === manager.id)
                .map(client => this.isActive(
                  client,
                  collection.filter(({ approved, clientId }) => approved && clientId === client.id),
                )).length,
              brands: eheaders.map((header) => {
                const found = this.managerBrands(manager.id, collection)
                  .filter(({ id }) => header.id === id);
                return found.length ? {
                  id: header.id,
                  total: found.reduce((a, b) => a + b.total, 0),
                } : header;
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
