<template lang="pug">
    v-layout(row)
        v-flex(xs12)
          v-stepper.border(v-model="step" non-linear)
            v-stepper-header
              v-stepper-step(step="1" color="secondary") Выбор клиента
              v-divider.mx-0
              v-stepper-step(step="2" color="secondary") Выборка
              v-divider.mx-0
              v-stepper-step(step="3" color="secondary") Определить количество
            v-divider
            v-stepper-items
              v-stepper-content.pa-0(step="1")
                v-layout.grey.lighten-2(row wrap)
                  v-spacer
                  v-btn.ma-0.mt-1(
                    flat color="secondary"
                    :loading="loading"
                    :disabled="!client || !payment || !type"
                    @click="step = 2")
                      | Далее
                      v-icon.ml-2 keyboard_arrow_right
                .pa-4
                  v-select(v-model="type"
                    :items="types"
                    item-text="name"
                    label="Тип оплаты"
                    color="secondary"
                    return-object)
                  v-select(v-model="payment"
                    :items="payments"
                    item-text="name"
                    item-value="id"
                    label="Тип расчета"
                    color="secondary")
                  v-select(v-model="client"
                    :items="filteredClients"
                    item-text="name"
                    return-object
                    label="Клиент"
                    color="secondary")
                  v-text-field(
                    color="secondary"
                    type="number"
                    v-model="days"
                    label="Количество дней платежа"
                    name="Количество дней платежа"
                    v-validate="'required|numeric|min_value:1'"
                    :suffix="dueDate")

              v-stepper-content.pa-0(step="2")
                v-layout.grey.lighten-2(row wrap align-center)
                  v-btn.ma-0.mt-1(flat color="secondary" @click="step = 1")
                    v-icon.mr-2 keyboard_arrow_left
                    | Назад
                  v-spacer
                  .subheading.mt-1 Выбрано: {{ selected.length }}
                  v-spacer
                  v-btn.ma-0.mt-1(
                    flat color="secondary"
                    :disabled="selected.length == 0"
                    @click="step = 3")
                      | Далее
                      v-icon.ml-2 keyboard_arrow_right
                v-divider
                SearchStock(v-model="stock" :warehouseId="$route.params.id" :items="selected")
              v-stepper-content.pa-0(step="3")
                v-layout.grey.lighten-2(row wrap)
                  v-btn.ma-0.mt-1(flat color="secondary" @click="step = 2")
                    v-icon.mr-2 keyboard_arrow_left
                    | Назад
                  v-spacer
                  v-btn.ma-0.mt-1(
                    flat color="secondary"
                    :disabled="errors.items.length > 0 || !isUnique"
                    @click="submit()") Завершить
                .pa-4
                  v-text-field(
                    color="secondary"
                    v-model="number"
                    :error="!isUnique"
                    label="Номер"
                    name="Номер"
                    v-validate="'required'")
                  .subheading Баланс клиента: {{ balance.toFixed(2) }} $
                  .subheading Итоговая цена: {{ getTotalPrice().toFixed(2) }} $
                v-divider
                v-data-table(
                    :headers="headers"
                    :items="selected"
                    hide-actions)
                    template(v-slot:items="props")
                      SaleItem(
                        :type="type"
                        :item="props.item"
                        :exchangeRate="exchangeRate"
                        :officialRate="officialRate")
</template>

<script>
import Sale from '@/services/Sale';
import Client from '@/services/Client';
import Configuration from '@/services/Configuration';

export default {
  name: 'Sale',
  data: () => ({
    step: 1,
    days: 1,
    user: JSON.parse(localStorage.getItem('user')),
    loading: false,
    stock: null,
    client: null,
    selected: [],
    clients: [],
    payment: 1,
    payments: [
      {
        id: 1,
        name: 'Предоплата',
      },
      {
        id: 2,
        name: 'Частичная',
      },
      {
        id: 3,
        name: 'Реализация',
      },
    ],
    type: null,
    number: '',
    isUnique: false,
    types: [
      {
        id: 1,
        name: 'B2C',
        key: 'firstPrice',
      },
      {
        id: 2,
        name: 'Цена с наценкой',
        key: 'mixPrice',
      },
      {
        id: 3,
        name: 'B2B',
        key: 'secondPrice',
      },
      {
        id: 4,
        name: 'Оплаты по комиссии',
        key: 'price',
      },
    ],
    configurations: [],
    exchangeRate: 1,
    officialRate: 1,
  }),
  computed: {
    headers() {
      return [
        {
          text: 'Код товара',
          value: 'product.code',
        },
        {
          text: 'Наименование',
          value: 'product.name',
        },
        {
          text: 'Фасовка',
          value: 'product.packing',
        },
        {
          text: 'Цвет',
          value: 'product.color',
        },
        {
          text: 'Количество на складе',
          value: 'quantity',
        },
        {
          text: 'Состояние',
          value: 'defected',
        },
        {
          text: 'Дата прибытия',
          value: 'arrival_date',
        },
        {
          text: 'Срок действия',
          value: 'expiry_date',
        },
        {
          text: this.type.name,
          sortable: false,
          width: 1,
        },
        {
          text: 'Скидка %',
          value: 'discount',
          width: 1,
        },
        {
          text: 'Количество',
          value: 'quantity',
          width: 1,
        },
      ];
    },
    dueDate() {
      return this.$moment(new Date()).add(this.days, 'd').format('YYYY-MM-DD');
    },
    filteredClients() {
      if (this.user.id === 1) {
        return this.clients;
      }
      return this.clients.filter(client => client.managerId === this.user.id);
    },
    balance() {
      if (this.client) {
        let balance = 0;
        this.client.payments.forEach((payment) => {
          if (payment.approved) {
            balance += payment.sum / payment.ratio;
          }
        });
        return balance;
      }
      return 0;
    },
  },
  methods: {
    getAll() {
      this.loading = true;
      Promise.all([
        Client.getAll(),
        Configuration.getAll(),
      ]).then((results) => {
        [this.clients, this.configurations] = results;
        this.exchangeRate = (this.configurations.find(conf => conf.id === 4)).value;
        this.officialRate = (this.configurations.find(conf => conf.id === 5)).value;
      })
        .catch(error => this.$store.commit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
    submit() {
      this.loading = true;
      const sale = {
        number: this.number,
        type: this.type.id,
        form: this.payment,
        clientId: this.client.id,
        managerId: this.user.id,
        warehouseId: parseInt(this.$route.params.id, 10),
        items: [],
      };
      this.selected.forEach((item) => {
        sale.items.push({
          stockId: item.id,
          priceId: item.product.prices[0].id,
          quantity: item.sale,
          discount: item.discount,
          commissionPrice: item.commissionPrice,
        });
      });
      Sale.create(sale)
        .then(() => {
          this.$router.push({ name: 'information' });
          window.location.reload();
        })
        .catch(error => this.$store.commit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
    getTotalPrice() {
      let price = 0;
      if (this.type) {
        this.selected.forEach((item) => { price += item[this.type.key]; });
      }
      return price;
    },
  },
  watch: {
    number(value) {
      this.isUnique = true;
      if (value) {
        Sale.getByNumber(value).then((sales) => {
          this.isUnique = !(sales.length);
        });
      }
    },
  },
  created() {
    [this.type] = this.types;
    this.getAll();
  },
};
</script>

<style scoped>
.v-stepper,
.v-stepper__header {
    box-shadow: none;
}
</style>
