<template lang="pug">
    v-layout(row)
        v-flex(xs12)
          v-stepper.border(v-model="step" non-linear)
            v-stepper-header
              v-stepper-step(
                step="1" editable
                color="secondary"
              ) Выборка
              v-divider.mx-0
              v-stepper-step(
                step="2" :editable="selected.length > 0"
                color="secondary"
              ) Определить количество
              v-divider.mx-0
              v-stepper-step(
                step="3" :editable="selected.length > 0 && errors.items.length == 0"
                color="secondary"
              ) Выбор клиента

            v-divider
            v-stepper-items
              v-stepper-content(step="1").pa-0
                SearchStock(v-model="stock" :warehouseId="$route.params.id" :items="selected")
                v-layout(row wrap)
                  v-spacer
                  v-btn.ma-0.my-1.mr-1(
                    flat color="secondary"
                    :disabled="selected.length == 0"
                    @click="step = 2"
                  ) Далее

              v-stepper-content(step="2").pa-0
                v-data-table(
                    :headers="headers"
                    :items="selected"
                    hide-actions)
                    template(v-slot:items="props")
                      td {{ props.item.product.code || '-' }}
                      td {{ props.item.product.Brand.name }} {{ props.item.product.name }}
                      td {{ props.item.product.packing }}
                      td {{ props.item.product.color || '-' }}
                      td {{ props.item.quantity - props.item.booked }}
                      td {{ props.item.defected ? 'Поврежден' : 'Хорошо' }}
                      td {{ props.item.arrival_date | moment('YYYY-MM-DD') }}
                      td {{ props.item.expiry_date | moment('YYYY-MM-DD') }}
                      td
                        v-text-field(
                          color="secondary"
                          v-model="props.item.discount"
                          name="discount"
                          v-validate="{\
                            required: true,\
                            decimal: true,\
                            min_value: 0,\
                            max_value: 100,\
                          }"
                        )
                      td
                        v-text-field(
                          color="secondary"
                          v-model="props.item.book"
                          :name="props.item.id"
                          v-validate="{\
                            required: true,\
                            decimal: true,\
                            min_value: 0,\
                            excluded: '0',\
                            max_value: props.item.quantity - props.item.booked\
                          }"
                        )
                v-divider
                v-layout(row wrap)
                  v-spacer
                  v-btn.ma-0.mb-1.mr-1(
                    flat color="secondary"
                    :disabled="errors.items.length > 0"
                    @click="step = 3"
                  ) Далее
              v-stepper-content(step="3")
                v-select(
                  v-model="client"
                  :items="clients"
                  item-text="name"
                  item-value="id"
                  label="Клиент"
                  color="secondary"
                )
                v-select(
                  v-model="type"
                  :items="types"
                  item-text="name"
                  item-value="id"
                  label="Тип оплаты"
                  color="secondary"
                )
                v-select(
                  v-model="payment"
                  :items="payments"
                  item-text="name"
                  item-value="id"
                  label="Тип расчета"
                  color="secondary"
                )

                v-layout(row wrap)
                  v-spacer
                  v-btn.ma-0.mb-1.mr-1(
                    flat
                    color="secondary"
                    :loading="loading"
                    :disabled="!client || !payment || !type"
                    @click="submit()"
                  ) Завершить
</template>

<script>

import Client from '@/services/Client';
// import Booking from '@/services/Booking';
import Permissions from '@/utils/Permissions';

export default {
  name: 'Sale',
  data: () => ({
    loading: false,
    step: 1,
    stock: null,
    selected: [],
    clients: [],
    client: null,
    user: JSON.parse(localStorage.getItem('user')),
    payment: 1,
    payments: [
      {
        id: 1,
        name: 'Полный',
      },
      {
        id: 2,
        name: 'Частично',
      },
    ],
    type: 1,
    types: [
      {
        id: 1,
        name: 'Цена 1',
      },
      {
        id: 2,
        name: 'Цена 2 (mix)',
      },
      {
        id: 3,
        name: 'Цена 3',
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
  }),
  methods: {
    getAll() {
      Promise.all([
        Client.getAll(),
      ]).then((results) => {
        [this.clients] = results;
      });
    },

    submit() {
    //   this.loading = true;
    //   const bookings = this.selected.map(booking => ({
    //     quantity: booking.book,
    //     stockId: booking.id,
    //     clientId: this.client,
    //     date: this.date,
    //     userId: this.user.id,
    //   }));
    //   Booking.createMultiple(bookings)
    //     .then(() => {
    //       window.location.reload();
    //     })
    //     .catch((error) => {
    //       this.$store.commit('setMessage', error.message);
    //     })
    //     .finally(() => { this.loading = false; });
    },
  },
  watch: {
    step(value) {
      if (value > 1) {
        new Promise(resolve => setTimeout(resolve, 100)).then(() => {
          this.$validator.validate();
        });
      }
    },
    selected(value) {
      value.forEach((element) => {
        // eslint-disable-next-line no-param-reassign
        element.discount = element.product.discount;
      });
    },
  },
  created() {
    if (!this.$hasPermission(Permissions.CAN_BOOK.name)) {
      this.$router.go(-1);
    }
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
