<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'units' }").tertiary--text
            v-icon arrow_back
        .title.tertiary--text {{ id == null ? 'Добавить' : 'Сохранить' }} единицу измерения
        v-flex(xs12).mt-3
            .border.white.pa-4
                v-text-field(
                    v-model="name"
                    label="Наименование"
                    name="name"
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
import Unit from '@/services/Unit';

export default {
  name: 'Unit',
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
        .then(() => this.$router.push({ name: 'units' }))
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => { this.loading = false; });
    },
    create() {
      this.execute(Unit.create({
        name: this.name,
      }));
    },
    update() {
      this.execute(Unit.update(this.id, {
        name: this.name,
      }));
    },
  },
  created() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      Unit.get(this.$route.params.id)
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
