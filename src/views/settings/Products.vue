<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'settings' }").tertiary--text
            v-icon arrow_back
        .title.tertiary--text ТОВАРЫ
        v-spacer
        v-btn(flat color="secondary"
            :to="{ name: 'product' }"
          ).tertiary--text Добавить
        v-layout(row wrap).border.white
          v-spacer
          v-flex(xs3).ml-3.mr-3
            v-text-field(
              v-model="search"
              append-icon="search"
              label="Поиск"
            )
          v-flex(xs12).mt-3
                v-data-table(
                  :headers="headers"
                  :items="products"
                  :search="search"
                  :loading="loading")
                    template(v-slot:items="props")
                        td {{ props.item.Brand.name }}
                        td {{ props.item.Brand.manufacturer }}
                        td {{ props.item.name }}
                        td {{ props.item.code || '-' }}
                        td {{ props.item.packing }}
                        td {{ props.item.color || '-' }}
                        td {{ getUnitName(props.item.unit) }}
                        td {{ getTypeName(props.item.type) }}
                        td {{ getPurposeName(props.item.purpose) }}
                        td {{ getTagName(props.item.tag) }}
                        td {{ props.item.cleaning }}%
                        td {{ props.item.vat }}%
                        td {{ props.item.tax }}%
                        td {{ props.item.excise }}%
                        td {{ props.item.discount }}%
                        td
                            v-layout
                                v-btn(icon
                                  :to="{ name: 'product', params: { id: props.item.id }}"
                                ).mx-0
                                    v-icon(color="secondary" small) edit
                                v-btn(icon @click="remove(props.item.id)").mx-0
                                    v-icon(color="red" small) delete
                v-divider
                v-layout
                    v-spacer
                    v-btn.ma-0.mb-1.mr-1(flat color="secondary"
                      :to="{ name: 'product' }"
                    ) Добавить
</template>

<script>
import Product from '@/services/Product';
import Unit from '@/services/Unit';
import ProductType from '@/services/ProductType';
import Purpose from '@/services/Purpose';
import Tag from '@/services/Tag';

export default {
  name: 'Products',
  data() {
    return {
      search: '',
      headers: [
        {
          text: 'Бренд',
          value: 'Brand.name',
        },
        {
          text: 'Производитель',
          value: 'Brand.manufacturer',
        },
        {
          text: 'Наименование',
          value: 'name',
        },
        {
          text: 'Код',
          value: 'code',
        },
        {
          text: 'Фасовка',
          value: 'packing',
        },
        {
          text: 'Цвет',
          value: 'color',
        },
        {
          text: 'Единица',
          value: 'unit',
        },
        {
          text: 'Тип',
          value: 'type',
        },
        {
          text: 'Назначение',
          value: 'purpose',
        },
        {
          text: 'Тег',
          value: 'tag',
          sortable: false,
        },
        {
          text: 'Очистка',
          value: 'cleaning',
          sortable: false,
        },
        {
          text: 'НДС',
          value: 'vat',
          sortable: false,
        },
        {
          text: 'Налог',
          value: 'tax',
          sortable: false,
        },
        {
          text: 'Акциз',
          value: 'excise',
          sortable: false,
        },
        {
          text: 'Скидка',
          value: 'discount',
          sortable: false,
        },
        {
          sortable: false,
          width: 100,
        },
      ],
      products: [],
      units: [],
      types: [],
      purposes: [],
      tags: [],
      loading: false,
    };
  },
  methods: {
    getAll() {
      this.loading = true;
      this.products = [];
      Promise.all([
        Unit.getAll(),
        ProductType.getAll(),
        Purpose.getAll(),
        Tag.getAll(),
        Product.getAll(),
      ])
        .then((result) => {
          [this.units, this.types, this.purposes, this.tags, this.products] = result;
        })
        .finally(() => { this.loading = false; });
    },
    remove(id) {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (confirm('Это действие удалит элемент навсегда, вы уверены?')) {
        Product.delete(id)
          .then(() => { this.getAll(); })
          .catch((error) => {
            this.$store.commit('setMessage', error.message);
          });
      }
    },
    getUnitName(id) {
      return (this.units.find(item => id === item.id) || { name: '-' }).name;
    },
    getTypeName(id) {
      return (this.types.find(item => id === item.id) || { name: '-' }).name;
    },
    getPurposeName(id) {
      return (this.purposes.find(item => id === item.id) || { number: '-' }).number;
    },
    getTagName(id) {
      return (this.tags.find(item => id === item.id) || { name: '-' }).name;
    },
  },
  created() {
    this.getAll();
  },
};
</script>
