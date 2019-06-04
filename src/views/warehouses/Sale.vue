<template lang="pug">
    v-layout(row)
        v-flex(xs12)
          v-stepper.border(v-model="step" non-linear)
            v-stepper-header
              v-stepper-step(
                step="1" editable
                color="secondary") Выборка
              v-divider.mx-0
              v-stepper-step(
                step="2" :editable="selected.length > 0"
                color="secondary") Определить количество
              v-divider.mx-0
              v-stepper-step(
                step="3" :editable="selected.length > 0 && errors.items.length == 0"
                color="secondary") Выбор клиента
            v-divider
            v-stepper-items
              v-stepper-content(step="1").pa-0
                SearchStock(v-model="stock" :warehouseId="$route.params.id" :items="selected")
                v-layout(row wrap)
                  v-spacer
                  v-btn.ma-0.my-1.mr-1(
                    flat color="secondary"
                    :disabled="selected.length == 0"
                    @click="step = 2") Далее

              v-stepper-content(step="2").pa-0
                v-data-table(
                    :headers="headers"
                    :items="selected"
                    hide-actions)
                    template(v-slot:items="props")
                      SaleItem(:item="props.item")
                v-divider
                v-layout(row wrap)
                  v-spacer
                  v-btn.ma-0.mb-1.mr-1(
                    flat color="secondary"
                    :disabled="errors.items.length > 0"
                    @click="step = 3") Далее

              v-stepper-content(step="3")
                v-select(v-model="type"
                  :items="types"
                  item-text="name"
                  item-value="id"
                  label="Тип оплаты"
                  color="secondary")
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
                .caption(v-if="client") Баланс клиента: {{ balance.toFixed(2) }} $
                .caption Итоговая цена: {{ getTotalPrice().toFixed(2) }} $
                v-layout(row wrap)
                  v-spacer
                  v-btn.ma-0.mb-1.mr-1(
                    flat
                    color="secondary"
                    :loading="loading"
                    :disabled="!client || !payment || !type"
                    @click="submit()") Завершить
</template>

<script>
import Client from '@/services/Client';
import Configuration from '@/services/Configuration';

export default {
  name: 'Sale',
  data: () => ({
    step: 1,
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
    type: 1,
    types: [
      {
        id: 1,
        name: 'B2C',
      },
      {
        id: 2,
        name: 'Цена с наценкой',
      },
      {
        id: 3,
        name: 'B2B',
      },
    ],
    headers: [
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
        text: 'B2C',
        value: 'price',
        sortable: false,
        width: 1,
      },
      {
        text: 'Цена с наценкой',
        value: 'price',
        sortable: false,
        width: 1,
      },
      {
        text: 'B2B',
        value: 'price',
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
    ],
    configurations: [],
  }),
  computed: {
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
      Promise.all([
        Client.getAll(),
        Configuration.getAll(),
      ]).then((results) => {
        [this.clients, this.configurations] = results;
      });
    },
    submit() {

    },
    getTotalPrice() {
      let price = 0;
      switch (this.type) {
        // B2C
        case 1:
          this.selected.forEach((item) => {
            price += item.firstPrice;
          });
          price /= this.configurations[5].value;
          break;

        // Цена с наценкой
        case 2:
          break;

        // B2B
        case 3:
          break;

        default:
          break;
      }
      return price;
    },
  },
  created() {
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
