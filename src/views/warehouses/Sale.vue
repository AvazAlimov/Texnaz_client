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
                  v-select(v-model="client"
                    :items="filteredClients"
                    item-text="name"
                    return-object
                    v-validate="'required'"
                    label="Клиент"
                    color="secondary")

                  // Commented, cause it is not necessary now,
                    but if it removed backend responses 403 status
                    v-select(v-model="payment"
                      :items="payments"
                      item-text="name"
                      item-value="id"
                      label="Тип расчета"
                      color="secondary")

                    v-text-field(
                      color="secondary"
                      v-show="false"
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
                    :disabled="errors.items.length > 0 ||\
                    (oldNumber == number ? !$route.params.saleId : !isUnique)"
                    @click="submit()") Завершить
                .pa-4
                  v-text-field(
                    color="secondary"
                    v-model="number"
                    :error="(oldNumber == number ? !$route.params.saleId : !isUnique)"
                    label="Номер"
                    name="Номер"
                    v-validate="'required'")
                  .subheading Баланс клиента: {{ client.balance || 0 | roundUp | readable }} $
                  .subheading Итоговая цена: {{ getTotalPrice() | roundUp | readable }} $
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
import Stock from '@/services/Stock';
import Client from '@/services/Client';
import Configuration from '@/services/Configuration';
import shipmentTypes from '@/assets/shipment_types.json';
import shipmentPayments from '@/assets/shipment_payments.json';
import calculate from '@/utils/Sale';

export default {
  name: 'Sale',
  data: () => ({
    step: 1,
    days: 1,
    loading: false,
    oldNumber: '',
    number: '',
    isUnique: false,
    stock: null,
    sales: [],
    client: {},
    selected: [],
    clients: [],
    payment: 1,
    type: shipmentTypes[0],
    types: shipmentTypes,
    payments: shipmentPayments,
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
      if (this.$getUserId() === 1) {
        return this.clients;
      }
      return this.clients.filter(client => client.managerId === this.$getUserId());
    },
  },
  methods: {
    getDebt(type, item) {
      switch (type) {
        case 1:
          return (item.commissionPrice * item.sale) * ((100 - item.discount) / 100);
        case 3:
          return item.product.prices[0].secondPrice * item.sale * ((100 - item.discount) / 100);
        default:
          return 0;
      }
    },
    getAll() {
      this.loading = true;
      Promise.all([
        Client.getAll(),
        Configuration.getAll(),
        Sale.getAll(),
      ]).then((results) => {
        [this.clients, this.configurations, this.sales] = results;
        this.exchangeRate = (this.configurations.find(conf => conf.id === 4)).value;
        this.officialRate = (this.configurations.find(conf => conf.id === 5)).value;

        if (this.$route.params.saleId) {
          Sale.get(this.$route.params.saleId).then((sale) => {
            this.oldNumber = sale.number;
            this.number = sale.number;
            this.days = sale.days;
            this.type = shipmentTypes.find(item => item.id === sale.type);
            this.payment = sale.form;
            this.client = this.clients.find(client => client.id === sale.clientId);
            sale.items.forEach(async (item) => {
              const stock = await Stock.get(item.stock.id);
              stock.sale = item.quantity;
              stock.discount = item.discount;
              stock.commissionPrice = item.commissionPrice;
              stock.booked = 0;
              stock.bookings.forEach((booking) => {
                stock.booked += booking.quantity;
              });
              stock.sold = 0;
              stock.sales.forEach((saleItem) => {
                if (saleItem.approved === 0) { stock.sold += saleItem.quantity; }
              });
              this.selected.push(stock);
            });
            this.isUnique = true;
          }).catch(() => this.$router.push({ name: 'sale' }));
        }
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
        provinceId: this.client.provinceId,
        clientId: this.client.id,
        managerId: this.$getUserId(),
        warehouseId: parseInt(this.$route.params.id, 10),
        days: this.days,
        items: [],
      };
      this.selected.forEach((item) => {
        sale.items.push({
          stockId: item.id,
          priceId: item.product.prices[0].id,
          debtPrice: this.getDebt(this.type.id, item),
          paidPrice: 0,
          quantity: item.sale,
          discount: item.discount,
          commissionPrice: item.commissionPrice,
        });
      });
      (this.$route.params.saleId
        ? Sale.update(this.$route.params.saleId, sale)
        : Sale.create(sale)
      )
        .then(async () => {
          await calculate(this.client.id, this.exchangeRate);
          // this.$router.push({ name: 'information' });
          // window.location.reload();
        })
        .catch(error => this.$store.commit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
    getTotalPrice() {
      let price = 0;
      if (this.type) {
        this.selected.forEach((item) => { price += this.type.key === 'firstPrice' ? item[this.type.key] / this.officialRate : item[this.type.key]; });
      }
      return price;
    },
  },
  watch: {
    type(value) {
      console.log(value);
    },
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
