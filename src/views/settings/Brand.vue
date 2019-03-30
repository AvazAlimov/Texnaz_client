<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'brands' }")
            v-icon arrow_back
        .title {{ id == null ? 'Добавить' : 'Редактировать' }} бренд
        v-flex(xs12).mt-3
            .border.white.pa-4
                v-text-field(
                    v-model="name"
                    label="Название"
                    name="name"
                    v-validate="'required'")
                v-text-field(
                    v-model="country"
                    label="Страна"
                    name="country"
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
      }));
    },
    update() {
      this.execute(Brand.update(this.id, {
        name: this.name,
        country: this.country,
      }));
    },
  },
  created() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      Brand.get(this.$route.params.id)
        .then(({ name, country }) => {
          this.name = name;
          this.country = country;
        });
    }
  },
  mounted() {
    this.$validator.validateAll();
  },
};
</script>
