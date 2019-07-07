<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'regions' }").tertiary--text
            v-icon arrow_back
        .title.tertiary--text {{ id == null ? 'Добавить' : 'Сохранить' }} регион
        v-flex(xs12).mt-3
            .border.white.pa-4
                v-text-field(
                    v-model="region.name"
                    label="Регион"
                    name="name"
                    v-validate="'required'"
                    color="secondary")
                v-select(
                    v-model="region.provinceId"
                    :items="provinces"
                    label="Область"
                    item-text="name"
                    item-value="id"
                    name="province"
                    v-validate="'required'"
                    color="secondary")
                v-layout
                    v-spacer
                    v-btn(
                        :loading="loading"
                        :disabled="errors.items.length > 0"
                        flat color="secondary"
                        @click="submit") {{ id == null ? 'Добавить' : 'Сохранить' }}
</template>

<script>
import Region from '@/services/Region';
import Province from '@/services/Province';

export default {
  name: 'Region',
  $_veeValidate: {
    validator: 'new',
  },
  data() {
    return {
      id: null,
      provinces: [],
      region: {
        name: '',
        provinceId: '',
      },
      loading: false,
    };
  },
  methods: {
    getAll() {
      this.loading = true;
      this.provinces = [];
      Province.getAll()
        .then((provinces) => {
          this.provinces = provinces;
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
        .then(() => this.$router.push({ name: 'regions' }))
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => { this.loading = false; });
    },
    create() {
      this.execute(Region.create(this.region));
    },
    update() {
      this.execute(Region.update(this.id, this.region));
    },
  },
  created() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      Region.get(this.$route.params.id)
        .then((region) => {
          this.region = region;
        });
    }
  },
  mounted() {
    this.getAll();
    this.$validator.validateAll();
  },
};
</script>
