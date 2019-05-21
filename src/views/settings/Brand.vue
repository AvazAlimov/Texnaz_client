<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'brands' }")
            v-icon arrow_back
        .title {{ id == null ? 'Добавить' : 'Сохранить' }} бренд
        v-flex(xs12).mt-3
            .border.white.pa-4
                v-text-field(
                    color="secondary"
                    v-model="name"
                    label="Название"
                    name="name"
                    v-validate="'required'")
                v-text-field(
                    color="secondary"
                    v-model="manufacturer"
                    label="Производитель"
                    name="Производитель"
                    v-validate="'required'")
                v-text-field(
                    color="secondary"
                    v-model="country"
                    label="Страна"
                    name="country"
                    v-validate="'required'")
                v-layout
                    v-spacer
                    v-btn(
                        :loading="loading"
                        :disabled="errors.items.length > 0"
                        flat color="secondary"
                        @click="submit") {{ id == null ? 'Добавить' : 'Сохранить' }}
</template>

<script>
import Brand from '@/services/Brand';

export default {
  name: 'Brand',
  $_veeValidate: {
    validator: 'new',
  },
  data() {
    return {
      id: null,
      name: '',
      country: '',
      manufacturer: '',
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
        .then(() => this.$router.push({ name: 'brands' }))
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => { this.loading = false; });
    },
    create() {
      this.execute(Brand.create({
        name: this.name,
        country: this.country,
        manufacturer: this.manufacturer,
      }));
    },
    update() {
      this.execute(Brand.update(this.id, {
        name: this.name,
        country: this.country,
        manufacturer: this.manufacturer,
      }));
    },
  },
  created() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      Brand.get(this.$route.params.id)
        .then(({ name, country, manufacturer }) => {
          this.name = name;
          this.country = country;
          this.manufacturer = manufacturer;
        });
    }
  },
  mounted() {
    this.$validator.validateAll();
  },
};
</script>
