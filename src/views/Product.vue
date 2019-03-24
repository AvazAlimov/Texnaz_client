<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon to="/products")
            v-icon arrow_back
        .title {{ id == null ? 'Добавить' : 'Редактировать' }} товар
        v-flex(xs12).mt-3
            .border.white.pa-4
                v-layout(row wrap)
                    v-flex(xs4)
                        v-text-field(
                            v-model="product.name"
                            label="Наименование"
                            name="name"
                            v-validate="'required'")
                        v-text-field(
                            v-model="product.code"
                            label="Код")
                        v-text-field(
                            v-model="product.packing"
                            label="Фасовка"
                            name="packing"
                            v-validate="'required|decimal'")
                        v-text-field(
                            v-model="product.color"
                            label="Цвет"
                            name="color"
                            v-validate="'required'")
                    v-flex(xs4)
                        v-select(
                            v-model="product.unit"
                            :items="units"
                            item-text="name"
                            item-value="id"
                            label="Единица"
                            name="unit"
                            v-validate="'required'")
                        v-select(
                            v-model="product.type"
                            :items="types"
                            item-text="name"
                            item-value="id"
                            label="Тип"
                            name="type"
                            v-validate="'required'")
                        v-select(
                            v-model="product.purpose"
                            :items="purposes"
                            item-text="number"
                            item-value="id"
                            label="Назначение"
                            clearable)
                        v-select(
                            v-model="product.tag"
                            :items="tags"
                            item-text="name"
                            item-value="id"
                            label="Тег"
                            clearable)
                    v-flex(xs4)
                        v-text-field(
                            v-model="product.cleaning"
                            label="Очистка %"
                            name="cleaning"
                            v-validate="'required|decimal|min:0|max:100'")
                        v-text-field(
                            v-model="product.vat"
                            label="НДС %"
                            name="vat"
                            v-validate="'required|decimal|min:0|max:100'")
                        v-text-field(
                            v-model="product.tax"
                            label="Налог %"
                            name="tax"
                            v-validate="'required|decimal|min:0|max:100'")
                        v-text-field(
                            v-model="product.excise"
                            label="Акциз %"
                            name="excise"
                            v-validate="'required|decimal|min:0|max:100'")
                v-layout
                    v-spacer
                    v-btn(
                        :loading="loading"
                        :disabled="errors.items.length > 0"
                        flat color="primary"
                        @click="submit") {{ id == null ? 'Добавить' : 'Редактировать' }}
</template>

<script>
import Product from '../services/Product';
import Unit from '../services/Unit';
import Type from '../services/Type';
import Purpose from '../services/Purpose';
import Tag from '../services/Tag';

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
        unit: null,
        type: null,
        purpose: null,
        tag: null,
        cleaning: '',
        tax: '',
        vat: '',
        excise: '',
      },
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
        Unit.getAll(),
        Type.getAll(),
        Purpose.getAll(),
        Tag.getAll(),
      ])
        .then((result) => {
          [this.units, this.types, this.purposes, this.tags] = result;
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
        .then(() => this.$router.push('/products'))
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
        });
    }
  },
  mounted() {
    this.$validator.validateAll();
  },
};
</script>
