<template lang="pug">
    v-layout(wrap)
      v-flex(xs12)
        v-layout(align-center)
          v-select(
              v-model="province"
              :items="provinces"
              item-text="name"
              item-value="id"
              label="Region"
          ).ma-2
          v-select(
              v-model="brand"
              :items="brands"
              label="Brands"
              item-text="name"
              item-value="id"
              clearable
              multiple
          ).ma-2
          v-menu(
              v-model="startMenu"
              full-width
              min-width="290px"
              :close-on-content-click="false"
          ).ma-2
              template(v-slot:activator="{ on }")
                  v-text-field(
                      readonly
                      v-model="startDate"
                      v-on="on"
                      label="From"
                  )
              v-date-picker(
                  v-model="startDate"
                  @input="() => { startMenu = false }"

              )
          v-menu(
              v-model="endMenu"
              full-width
              min-width="290px"
              :close-on-content-click="false"
          ).ma-2
              template(v-slot:activator="{ on }")
                  v-text-field(
                      readonly
                      v-model="endDate"
                      v-on="on"
                      label="To"
                  )
              v-date-picker(
                  v-model="endDate"
                  @input="() => { endMenu = false }"

              )
          v-btn(icon @click="getItems")
            v-icon table_chart
      v-flex(xs12)
        v-data-table(
          :headers="headers"
          :items="items"
          :loading="loading"
        )
          template(v-slot:items="props")
            tr(@click="props.expanded = !props.expanded")
              td {{ props.item.territory }}
              td {{ props.item.province }}
              td {{ props.item.quantity }}
              td {{ props.item.weight }}
              td {{ props.item.sum || 0| roundUp | readable}}
          template(v-slot:expand="sales")
            v-data-table(
              :items="sales.item.expandedItems"
              :headers="expandedHeader"
              hide-actions
            )
              template(v-slot:items="clients")
                tr(@click="clients.expanded = !clients.expanded")
                  td {{ clients.item.clientname }}
                  td {{ clients.item.totalWeight || 0 | roundUp | readable}}
                  td {{ clients.item.totalQuantity }}
                  td {{ clients.item.sum || 0 | roundUp | readable}}
              template(v-slot:expand="products")
                v-data-table(
                  :headers="productsHeader"
                  :items="products.item.productItems"
                  hide-actions
                )
                  template(v-slot:items="{ item }")
                    tr
                      td {{ item.code }}
                      td {{ item.name }}
                      td {{ item.packing }}
                      td {{ item.color || 'None'}}
                      td {{ item.quantity }}


</template>
<script>
import Province from '@/services/Province';
import Brand from '@/services/Brand';
import Territory from '@/services/Territory';
import Sale from '@/services/Sale';

export default {
  data: () => ({
    loading: false,
    province: {},
    provinces: [],
    brand: [0],
    brands: [],
    startMenu: false,
    startDate: '',
    endMenu: false,
    endDate: '',
    territories: [],
    sales: [],
    items: [],
    headers: [
      {
        text: 'Territory',
        value: 'territory',
      },
      {
        text: 'Province',
        value: 'province',
      },
      {
        text: 'Total quantity',
        value: 'quantity',
      },
      {
        text: 'Total weight',
        value: 'weight',
      },
      {
        text: 'Sale sum',
        value: 'sum',
      },
    ],
    expandedHeader: [
      {
        text: 'Client name',
        value: 'clientname',
      },
      {
        text: 'Total weight',
        value: 'totalWeight',
      },
      {
        text: 'Total quantity',
        value: 'totalQuantity',
      },
      {
        text: 'Sum',
        value: 'sum',
      },
    ],
    productsHeader: [
      {
        text: 'Code',
        value: 'code',
      },
      {
        text: 'Name',
        value: 'name',
      },
      {
        text: 'Packing',
        value: 'packing',
      },
      {
        text: 'Color',
        value: 'color',
      },
      {
        text: 'Quantity',
        value: 'quantity',
      },
    ],
  }),
  methods: {
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
    getSale(id) {
      return new Promise((resolve, reject) => {
        (id === 0 ? Sale.getAllByShipped() : Sale.getByProvince(id))
          .then(sales => resolve(this.filterDate(sales).length
            ? this.filterDate(sales).map(sale => ({
              provinceId: sale.provinceId,
              clientName: sale.client.name,
              quantity: sale.items.reduce((a, b) => a + b.quantity, 0),
              weight: this.filterItems(sale.items)
                .map(item => ({ q: item.quantity, w: item.stock.product.packing }))
                .reduce((a, b) => a + (b.q * b.w), 0),
              number: Number.parseFloat(sale.number),
              isClosed: sale.isClosed,
              client: sale.client,
              items: sale.items,
              sum: this.filterItems(sale.items)
                .map(({ debtPrice, paidPrice }) => (debtPrice === 0 ? paidPrice : debtPrice))
                .map(price => (sale.type === 3 ? price : (price / sale.officialRate)))
                .reduce((a, b) => a + b, 0),
            })) : []))
          .then(error => reject(error));
      });
    },
    getAll() {
      this.loading = true;
      Promise.all([
        Province.getAll(),
        Brand.getAll(),
        Territory.getAll(),
      ]).then((result) => {
        [this.provinces, this.brands, this.territories] = result;
        this.provinces.push({
          id: 0,
          name: 'All',
        });
        this.brands.push({
          id: 0,
          name: 'All',
        });
        this.provinces.sort((a, b) => (a > b ? 1 : -1));
        this.brands.sort((a, b) => (a > b ? 1 : -1));
      })
        .catch((error) => { this.$store.commit('setMessage', error.message); })
        .finally(() => { this.loading = false; });
    },
    createItem(province, clients, data) {
      const byProvince = array => array.filter(({ provinceId }) => provinceId === province.id);
      const byClient = (array, clientId) => array.filter(({ client }) => client.id === clientId);
      const byAClient = (array, clientId) => array.find(({ client }) => client.id === clientId);

      if (province.territory) {
        this.items.push({
          id: province.id,
          territory: province.territory.name,
          province: province.name,
          quantity: byProvince(data).reduce((a, b) => a + b.quantity, 0),
          weight: byProvince(data).reduce((a, b) => a + b.weight, 0),
          sum: byProvince(data).reduce((a, b) => a + b.sum, 0),
          expandedItems: byProvince(clients).map(provinceClient => ({
            id: provinceClient.id,
            clientname: provinceClient.name,
            totalWeight: byClient(data, provinceClient.id).reduce((a, b) => a + b.weight, 0),
            totalQuantity: byClient(data, provinceClient.id).reduce((a, b) => a + b.quantity, 0),
            sum: byClient(data, provinceClient.id).reduce((a, b) => a + b.sum, 0),
            productItems: byAClient(data, provinceClient.id).items.map(item => ({
              code: item.stock.product.code,
              name: item.stock.product.name,
              packing: item.stock.product.packing,
              color: item.stock.product.color,
              quantity: item.quantity,
            })),
          })),
        });
      }
    },
    getItems() {
      this.items = [];
      this.getSale(this.province)
        .then((data) => {
          const makeUnique = allClients => allClients.filter(({ id }, i) => data
            .map(({ client }) => client.id).indexOf(id) === i);

          const clients = makeUnique(data.map(({ client }) => client));

          if (this.province === 0) {
            this.provinces.forEach((province) => {
              this.createItem(province, clients, data);
            });
          } else {
            this.createItem(this.provinces.find(({ id }) => this.province === id), clients, data);
          }
        });
    },
  },
  created() {
    this.getAll();
  },
};
</script>