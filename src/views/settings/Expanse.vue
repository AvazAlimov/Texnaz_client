<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'expanses' }").tertiary--text
            v-icon arrow_back
        .title.tertiary--text {{ id == null ? 'Добавить' : 'Сохранить' }} поставщика
        v-flex(xs12).mt-3
            .border.white.pa-4
                v-text-field(
                    v-model="expanse.name"
                    label="Название"
                    name="name"
                    v-validate="'required'"
                    color="secondary")
                v-text-field(
                    v-model="expanse.value"
                    label="Значение"
                    name="value"
                    v-validate="'required|decimal'"
                    color="secondary")
                v-checkbox(
                  v-model="expanse.is_transport"
                  label="Для транспорта"
                  color="secondary")
                v-checkbox(
                  v-model="expanse.is_cash"
                  label="Наличные"
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
import Expanse from '@/services/Expanse';

export default {
  name: 'Expanse',
  $_veeValidate: {
    validator: 'new',
  },
  data() {
    return {
      id: null,
      expanse: {
        name: '',
        value: 0,
        is_transport: false,
        is_cash: false,
      },
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
        .then(() => this.$router.push({ name: 'expanses' }))
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => { this.loading = false; });
    },
    create() {
      this.execute(Expanse.create(this.expanse));
    },
    update() {
      this.execute(Expanse.update(this.id, this.expanse));
    },
  },
  created() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      Expanse.get(this.$route.params.id)
        .then((expanse) => {
          this.expanse = expanse;
        });
    }
  },
  mounted() {
    this.$validator.validateAll();
  },
};
</script>
