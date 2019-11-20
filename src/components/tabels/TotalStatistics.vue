<template lang="pug">
    v-layout(wrap)
        v-flex(xs12)
            v-layout(align-center justify-space-betweeb)
                v-select(
                    name="regions"
                    v-model="province"
                    label="Область"
                    :items="provinces"
                    item-text="name"
                    item-value="id"
                ).ma-2
                v-select(
                    name="types"
                    v-model="type"
                    :items="types"
                    label="Тип"
                    item-text="name"
                    item-value="id"
                ).ma-2
                v-select(
                    name="brands"
                    v-model="brand"
                    :items="brands"
                    item-text="name"
                    item-value="id"
                    label="Бренды"
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
                  )
                v-btn(icon @click="getItems()").secondary--text
                    v-icon table_chart

        v-flex(xs12)
            v-data-table(
                :loading="loading"
                :headers="headers"
                :items="items"
                no-data-text="Нет информации"
                hide-actions
            )
                template(v-slot:items="props")
                  tr(v-if="props.item.id"
                    @click="() => { props.expanded = !props.expanded }").grey.lighten-3
                    td
                      v-icon {{ props.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
                    td {{ props.item.province }}
                    td {{ props.item.ceo }}
                    td {{ props.item.numSupervisors }}
                    td {{ props.item.numManagers }}
                    td {{ props.item.numClients }}
                    td {{ props.item.numActiveClients }}
                    td {{ props.item.totalAmount || 0 | roundUp | readable }}
                template(v-slot:expand="props")
                    v-data-table(
                      :headers="expandedHeaders"
                      :items="props.item.expandedItems"
                      :loading="expandedLoading"
                      no-data-text="Нет информации"
                      hide-actions
                    )
                      template(v-slot:items="{ item }")
                        tr.teal.lighten-5
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
      startDate: '',
      endDate: '',
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
          text: '',
          value: '',
          sortable: false,
          width: 1,
        },
        {
          text: 'Область',
          value: 'province',
        },
        {
          text: 'Руководитель',
          value: 'ceo',
        },
        {
          text: 'Кол-во супервайзеров',
          value: 'numSupervisors',
        },
        {
          text: 'Кол-во менеджеров',
          value: 'numManagers',
        },
        {
          text: 'Кол-во клиентов',
          value: 'numClients',
        },
        {
          text: 'АКБ',
          value: 'numActiveClients',
        },
        {
          text: 'Общее кол-во',
          value: 'totalAmount',
        },
      ],
      items: [],
      expandedHeaders: [],
    };
  },
  methods: {
    filterDate(sales) {
      return sales.filter((sale) => {
        const dateSale = new Date(sale.createdAt);
        const start = new Date(this.startDate === '' ? null : this.startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(this.endDate === '' ? '12-12-9999' : this.endDate);
        end.setHours(23, 59, 59, 59);
        console.log(dateSale > start && dateSale < end);
        return dateSale > start && dateSale < end;
      });
    },
    filterItems(items) {
      return items.filter(item => (this.brand.includes(0) ? true
        : this.brand.includes(item.stock.product.brand)));
    },
    isActive(client, collection) {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return !!collection.filter(({ createdAt }) => lastMonth < new Date(createdAt)).length;
    },
    sort(array) {
      array.push({
        id: 0,
        name: 'Все',
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
    managerBrands(idManager, collection, province) {
      const managerBrands = [];
      const holder = collection
        .filter(({ shipped, managerId, provinceId }) => shipped
          && managerId === idManager && provinceId === province)
        .map(({ type, items, officialRate }) => ((type === 3 || type === 5)
          ? items.map(({
            paidPrice, quantity, commissionPriceUsd, stock,
          }) => ({
            total: this.type === 0 ? paidPrice : (commissionPriceUsd * quantity),
            id: stock.product.brand,
          }))
          : items.map(({
            paidPrice, quantity, commissionPrice, stock,
          }) => ({
            total: (this.type === 0 ? paidPrice : (commissionPrice * quantity)) / officialRate,
            id: stock.product.brand,
          }))));
      holder.forEach((brand) => { brand.forEach(item => managerBrands.push(item)); });
      return managerBrands;
    },
    getUsdPrice(type, item, officialRate) {
      switch (type) {
        case 1:
          return item.debtPrice
              / Number.parseFloat(officialRate);
        case 2:
          return item.debtPrice
              / Number.parseFloat(officialRate);
        case 3:
          return item.price.secondPrice * item.quantity;
        case 5:
          return item.commissionPriceUsd * item.quantity;
        default:
          return 0;
      }
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
          const payments = this.filterDate(collection)
            .filter(({ shipped, provinceId }) => shipped && provinceId === province.id)
            .map(({ items, type, officialRate }) => ((type === 3 || type === 5)
              ? this.filterItems(items).map(({ paidPrice }) => paidPrice).reduce((a, b) => a + b, 0)
              : this.filterItems(items).map(({ paidPrice }) => paidPrice / officialRate)
                .reduce((a, b) => a + b, 0)));

          const sales = this.filterDate(collection)
            .filter(({ shipped, provinceId }) => shipped && provinceId === province.id)
            .map(({ items, type, officialRate }) => this.filterItems(items)
              .map(item => this.getUsdPrice(type, item, officialRate))
              .reduce((a, b) => a + b, 0));

          const eheaders = this.brand.includes(0) ? this.brands
            : this.brand.map(brandId => this.brands.find(({ id }) => id === brandId));

          this.expandedHeaders = [
            {
              text: 'Имя',
              value: 'name',
            },
            {
              text: 'Подчинение',
              value: 'controller',
            },
            {
              text: 'Кол-во клиентов',
              value: 'clients',
            },
            {
              text: 'АКБ',
              value: 'activeClients',
            },
          ].concat(eheaders.map(el => ({ text: el.name, value: el.name })));

          if (this.province === 0 ? true
            : this.province === province.id) {
            this.items.push({
              id: province.id,
              province: province.name,
              ceo: territoryManager ? territoryManager.name : '-',
              numSupervisors: supervisors ? supervisors.length : '-',
              numManagers: managers ? managers.length : '-',
              numClients: clients ? clients.length : '-',
              numActiveClients: clients ? clients
                .filter(client => this.isActive(
                  client,
                  collection
                    .filter(({ approved, clientId }) => approved && clientId === client.id),
                )).length : '-',
              totalAmount: (this.type === 0 ? payments : sales).reduce((a, b) => a + b, 0),
              // Expanded
              expandedItems: managers.map(manager => ({
                name: manager.name,
                controller: manager.controller ? manager.controller.name : '-',
                clients: clients.filter(({ managerId }) => managerId === manager.id).length,
                activeClients: clients ? clients.filter(({ managerId }) => managerId === manager.id)
                  .filter(client => this.isActive(
                    client,
                    collection.filter(({ approved, clientId }) => approved
                      && clientId === client.id),
                  )).length : 0,
                // Expanded
                brands: eheaders.map((header) => {
                  const found = this.managerBrands(manager.id, collection, province.id)
                    .filter(({ id }) => header.id === id);
                  return found.length ? {
                    id: header.id,
                    total: found.reduce((a, b) => a + b.total, 0),
                  } : header;
                }),
              })),
            });
          }
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
