<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'products' }")
            v-icon arrow_back
        .title {{ id == null ? 'Добавить' : 'Сохранить' }} товар
        v-flex(xs12).mt-3
          .border.white.pa-4
            v-layout(row wrap)
              v-flex(xs12 d-flex)
                v-text-field(
                  v-model="product.name"
                  label="Наименование"
                  name="name"
                  v-validate="'required'"
                  color="secondary")
              v-flex(xs4 d-flex)
                .border.pa-4
                  .subheading.mb-2 Основные характеристики
                  v-text-field(
                    v-model="product.packing"
                    label="Фасовка"
                    name="packing"
                    v-validate="'required|decimal'"
                    color="secondary")
                  v-combobox(
                    v-model="product.color"
                    :items="colors"
                    label="Цвет"
                    color="secondary")
                  v-select(
                    v-model="product.brand"
                    :items="brands"
                    item-value="id"
                    label="Бренд"
                    name="brand"
                    v-validate="'required'"
                    color="secondary")
                    template(slot="item" slot-scope="data")
                      | {{ data.item.name }} / {{ data.item.country }}
                    template(slot="selection" slot-scope="data")
                      | {{ data.item.name }} / {{ data.item.country }}
                  v-select(
                    v-model="product.unit"
                    :items="units"
                    item-text="name"
                    item-value="id"
                    label="Единица"
                    name="unit"
                    v-validate="'required'"
                    color="secondary")
                  v-select(
                    v-model="product.type"
                    :items="types"
                    item-text="name"
                    item-value="id"
                    label="Тип"
                    clearable
                    color="secondary")
              v-flex(xs4 d-flex)
                .border.pa-4
                  .subheading.mb-2 Дополнительные характеристики
                  v-text-field(
                    v-model="product.code"
                    label="Код"
                    color="secondary")
                  v-select(
                    v-model="product.purpose"
                    :items="purposes"
                    item-text="number"
                    item-value="id"
                    label="Назначение"
                    clearable
                    color="secondary")
                  v-combobox(
                    v-model="product.tags"
                    :items="tags"
                    small-chips
                    deletable-chips
                    multiple
                    label="Теги"
                    clearable
                    color="secondary")
              v-flex(xs4 d-flex)
                .border.pa-4
                  .subheading.mb-2 Финансовые показатели
                  v-text-field(
                    v-model="product.excise"
                    label="Акциз %"
                    name="excise"
                    v-validate="'required|decimal|min:0|max:100'"
                    color="secondary")
                  v-text-field(
                    v-model="product.tax"
                    label="Пошлина %"
                    name="tax"
                    v-validate="'required|decimal|min:0|max:100'"
                    color="secondary")
                  v-text-field(
                    v-model="product.vat"
                    label="НДС %"
                    name="vat"
                    v-validate="'required|decimal|min:0|max:100'"
                    color="secondary")
                  v-text-field(
                    v-model="product.cleaning"
                    label="Очистка %"
                    name="cleaning"
                    v-validate="'required|decimal|min:0|max:100'"
                    color="secondary")
                  v-text-field(
                    v-model="product.discount"
                    label="Скидка %"
                    name="discount"
                    v-validate="'required|decimal|min:0|max:100'"
                    color="secondary")
              v-layout
                v-spacer
                v-btn(:loading="loading"
                  :disabled="errors.items.length > 0"
                  flat color="secondary"
                  @click="submit") {{ id == null ? 'Добавить' : 'Сохранить' }}
</template>

<script>
import Product from '@/services/Product';
import Unit from '@/services/Unit';
import ProductType from '@/services/ProductType';
import Purpose from '@/services/Purpose';
import Tag from '@/services/Tag';
import Brand from '@/services/Brand';
import Info from '@/services/Info';

export default {
  name: 'Product',
  $_veeValidate: {
    validator: 'new',
  },
  data() {
    return {
      id: null,
      product: {
        name: '',
        code: '',
        packing: 0,
        color: '',
        brand: null,
        unit: null,
        type: null,
        purpose: null,
        tags: [],
        cleaning: 0,
        tax: 0,
        vat: 0,
        excise: 0,
        discount: 0,
      },
      colors: [],
      brands: [],
      units: [],
      purposes: [],
      tags: [],
      types: [],
      loading: false,
    };
  },
  methods: {
    getAll() {
      this.loading = true;
      Promise.all([
        Info.getColors(),
        Unit.getAll(),
        ProductType.getAll(),
        Purpose.getAll(),
        Tag.getAll(),
        Brand.getAll(),
      ])
        .then((result) => {
          let tags = [];
          [this.colors, this.units, this.types, this.purposes, tags, this.brands] = result;
          tags.forEach((tag) => {
            this.tags.push(tag.name);
          });
        })
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => { this.loading = false; });
    },
    submit() {
      if (!this.id) this.create();
      else this.update();
    },
    execute(promise) {
      this.loading = true;
      promise
        .then(() => this.$router.push({ name: 'products' }))
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => { this.loading = false; });
    },
    create() {
      this.execute(Product.create(this.product));
    },
    update() {
      this.execute(Product.update(this.id, this.product));
    },
  },
  created() {
    this.getAll();
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      Product.get(this.$route.params.id)
        .then((product) => {
          this.product = product;
          this.product.tags = product.tags.map(tag => tag.name);
        });
    }
  },
  mounted() {
    this.$validator.validateAll();
  },
};
</script>
