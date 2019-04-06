<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'selection' }")
            v-icon arrow_back
        .title Расходы по растаможке
        v-spacer
        .title 4/6

        v-flex.mt-3(xs12)
          Info(:batch="batch" :step="4")

        v-flex(xs12)
            .border.white
                .title.pa-4 Товары
                v-data-table(
                    :headers="headers"
                    :items="items"
                    no-data-text="Ничего не выбрано"
                    hide-actions)
                    template(v-slot:items="props")
                        CustomsItem(:item="props.item" :batch="batch")

        v-flex(xs12)
            v-layout
                v-spacer
                v-btn.ma-2(flat color="primary"
                  :loading="loading"
                  :disabled="errors.items.length > 0"
                  @click="submit") Завершить
</template>

<script>
import Batch from '@/services/Batch';
import Item from '@/services/Item';

export default {
  name: 'CustomsExpanses',
  data() {
    return {
      loading: false,
      batch: {
        expanses: [],
        items: [],
      },
      headers: [
        {
          text: 'Наименование',
          value: 'name',
          sortable: false,
        },
        {
          text: 'Фасовка',
          value: 'packing',
          sortable: false,
        },
        {
          text: 'Цвет',
          value: 'color',
          sortable: false,
        },
        {
          text: 'Количество',
          value: 'quantity',
          sortable: false,
        },
        {
          text: 'Вес',
          value: 'weight',
          sortable: false,
        },
        {
          text: 'Цена контрактная за фасовку',
          value: 'contract_price',
          sortable: false,
        },
        {
          text: 'Цена таможенная за фасовку',
          value: 'customs_price',
          sortable: false,
        },
        {
          text: 'Цена контрактная за кг',
          value: 'contract_price_per_unit',
          sortable: false,
        },
        {
          text: 'Цена таможенная за кг',
          value: 'customs_price_per_unit',
          sortable: false,
        },
        {
          text: 'Акциз %',
          value: 'excise',
          sortable: false,
        },
        {
          text: 'Пошлина %',
          value: 'tax',
          sortable: false,
        },
        {
          text: 'НДС %',
          value: 'vat',
          sortable: false,
        },
        {
          text: 'Очистка %',
          value: 'cleaning',
          sortable: false,
        },
        {
          text: 'Размер акциза',
          value: 'excise_value',
          sortable: false,
        },
        {
          text: 'Размер пошлины',
          value: 'tax_value',
          sortable: false,
        },
        {
          text: 'Размер НДС',
          value: 'vat_value',
          sortable: false,
        },
        {
          text: 'Размер очистки',
          value: 'cleaning_value',
          sortable: false,
        },
        {
          text: 'Себестоимость БН',
          value: 'cost_price_non_cash',
          sortable: false,
        },
      ],
      items: [],
    };
  },
  methods: {
    getAll() {
      Promise.all([
        Batch.get(this.$route.params.id),
      ]).then((results) => {
        [this.batch] = results;
        this.batch.items.forEach((item) => {
          this.items.push(item);
        });
      });
    },
    submit() {
      this.loading = true;
      const tasks = [];
      this.items.forEach((item) => {
        tasks.push(Item.update(item.id, item));
      });
      Promise.all(tasks)
        .then(() => { this.$router.push({ name: 'first_cost' }); })
        .catch((error) => { this.$store.commit('setMessage', error.message); })
        .finally(() => { this.loading = false; });
    },
  },
  created() {
    this.getAll();
  },
};
</script>
