<template lang="pug">
    v-layout(wrap)
        v-flex(xs12)
            v-layout(align-center justify-space-betweeb)
                v-select(
                    name="regions"
                    v-model="province"
                    :items="provinces"
                    item-text="name"
                    label="Область"
                    item-value="id"
                ).ma-2
                v-select(
                    name="brands"
                    v-model="brand"
                    :items="brands"
                    label="Бренды"
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
                :headers="headers"
                :loading="loading"
                :items="items"
                no-data-text="Нет информации"
                hide-actions
            )
                template(v-slot:items="props")
                    tr(@click="() => { props.expanded = !props.expanded }").grey.lighten-3
                        td
                          v-icon {{ props.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
                        td {{ props.item.province }}
                        td {{ props.item.ceo }}
                        td {{ props.item.numSupervisors }}
                        td {{ props.item.numManagers }}
                        td {{ props.item.numClients }}
                        td {{ props.item.numActiveClients }}
                        td {{ props.item.totalAmount || 0 | roundUp | readable }}
                template(v-slot:expand="sales")
                    v-data-table(
                        :headers="expandedHeaders"
                        :items="sales.item.expandedItems"
                        no-data-text="Нет информации"
                        hide-actions
                    )
                      template(v-slot:items="{ item }")
                        tr.teal.lighten-5
                          td {{ item.name }}
                          td(v-for="b in item.brands") {{ b.price | roundUp | readable }}
</template>
<script>
import Province from '@/services/Province';
import Brand from '@/services/Brand';
import Territory from '@/services/Territory';
import Client from '@/services/Client';
import User from '@/services/User';
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
      brand: [0],
      brands: [],
      loading: false,
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
          text: 'Всего сумма',
          value: 'totalAmount',
        },
      ],
      items: [],
      expandedHeaders: [],
    };
  },
  methods: {
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
    filterDate(sales) {
      return sales.filter((sale) => {
        const dateSale = new Date(sale.createdAt);
        const start = new Date(this.startDate === '' ? null : this.startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(this.endDate === '' ? '12-12-9999' : this.endDate);
        end.setHours(23, 59, 59, 59);
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
        this.provinces.filter(({ id }) => (this.province === 0
          ? true : id === this.province) && id !== 0)
          .forEach((province) => {
            const territory = territories.find(({ provinces }) => provinces
              .map(item => item.id).includes(province.id));

            const territoryManager = territory ? this.getUsers(users, territory.id, 8) : null;
            const supervisors = territory ? this.getUsers(users, territory.id, 7) : [];
            const managers = territory ? this.getUsers(users, territory.id, 2) : [];
            const clients = allclients.filter(({ provinceId }) => provinceId === province.id);
            const sales = this.filterDate(collection)
              .filter(({ shipped, provinceId }) => shipped && provinceId === province.id);

            const salesPrice = sales.map(({ items, type, officialRate }) => this.filterItems(items)
              .map(item => this.getUsdPrice(type, item, officialRate)).reduce((a, b) => a + b, 0));

            const eheaders = this.brand.includes(0) ? this.brands
              : this.brand.map(brandId => this.brands.find(({ id }) => id === brandId));

            this.expandedHeaders = [
              {
                text: 'Имя',
                value: 'name',
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
              totalAmount: salesPrice.reduce((a, b) => a + b, 0),
              expandedItems: clients.map((client) => {
                const clientItems = [];
                sales.filter(({ clientId }) => clientId === client.id)
                  .forEach(({ type, officialRate, items }) => {
                    this.filterItems(items)
                      .forEach(item => clientItems.push({ type, officialRate, item }));
                  });
                return {
                  id: client.id,
                  name: client.name,
                  brands: eheaders.map(brand => ({
                    price: clientItems.filter(({ item }) => (item
                      ? item.stock.product.brand === brand.id : false))
                      .map(({
                        type,
                        officialRate,
                        item: { quantity, commissionPrice, commissionPriceUsd },
                      }) => (((type === 3 || type === 5) ? commissionPriceUsd
                        : commissionPrice) * quantity)
                    / ((type === 3 || type === 5) ? 1 : officialRate))
                      .reduce((a, b) => a + b, 0),
                  })),
                };
              }),
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
