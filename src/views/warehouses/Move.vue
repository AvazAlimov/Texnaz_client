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
              ) Утверждение
            v-divider
            v-stepper-items
              v-stepper-content(step="1").pa-0
                SearchStock(v-model="stock" :warehouseId="$route.params.id" :items="selected")
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
                      td {{ props.item.quantity }}
                      td {{ props.item.defected ? 'Поврежден' : 'Хорошо' }}
                      td {{ props.item.arrival_date | moment('YYYY-MM-DD') }}
                      td {{ props.item.expiry_date | moment('YYYY-MM-DD') }}
                      td
                        v-text-field(
                          color="secondary"
                          v-model="props.item.move"
                          :name="props.item.id"
                          v-validate="{\
                            required: true,\
                            decimal: true,\
                            min_value: 0,\
                            excluded: '0',\
                            max_value: props.item.quantity\
                          }"
                        )
                v-divider
                v-layout(row wrap)
                  v-spacer
                  v-btn.ma-0.mb-1.mr-1(
                    flat color="secondary"
                    :disabled="errors.items.length > 0"
                  ) Завершить
</template>

<script>
export default {
  name: 'Move',
  data: () => ({
    step: 1,
    stock: null,
    selected: [],
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
        text: 'Количество для перемещение',
        value: 'quantity',
        width: 1,
      },
    ],
  }),
};
</script>

<style scoped>
.v-stepper,
.v-stepper__header {
    box-shadow: none;
}
</style>
