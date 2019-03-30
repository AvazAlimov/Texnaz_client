<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon to="/types")
            v-icon arrow_back
        .title {{ id == null ? 'Добавить' : 'Редактировать' }} тип продукта
        v-flex(xs12).mt-3
            .border.white.pa-4
                v-text-field(
                    v-model="name"
                    label="Наименование"
                    name="name"
                    v-validate="'required'")
                v-layout
                    v-spacer
                    v-btn(
                        :loading="loading"
                        :disabled="errors.items.length > 0"
                        flat color="primary"
                        @click="submit") {{ id == null ? 'Добавить' : 'Редактировать' }}
</template>

<script>
import ProductType from '../services/ProductType';

export default {
  name: 'ProductType',
  $_veeValidate: {
    validator: 'new',
  },
  data() {
    return {
      id: null,
      name: '',
      loading: false,
    };
  },
  methods: {
    submit() {
      if (!this.id) this.create();
      else this.update();
    },
    execute(promise) {
      this.loading = true;
      promise
        .then(() => this.$router.push('/product_types'))
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => { this.loading = false; });
    },
    create() {
      this.execute(ProductType.create({
        name: this.name,
      }));
    },
    update() {
      this.execute(ProductType.update(this.id, {
        name: this.name,
      }));
    },
  },
  created() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      ProductType.get(this.$route.params.id)
        .then(({ name }) => {
          this.name = name;
        });
    }
  },
  mounted() {
    this.$validator.validateAll();
  },
};
</script>
