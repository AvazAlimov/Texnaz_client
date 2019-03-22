<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon to="/expanses")
            v-icon arrow_back
        .title {{ id == null ? 'Добавить' : 'Редактировать' }} поставщика
        v-flex(xs12).mt-3
            .border.white.pa-4
                v-text-field(
                    v-model="expanse.name"
                    label="Название"
                    name="name"
                    v-validate="'required'")
                v-checkbox(v-model="expanse.is_transport" label="Для транспорта")
                v-checkbox(v-model="expanse.is_cash" label="Наличные")
                v-layout
                    v-spacer
                    v-btn(
                        :loading="loading"
                        :disabled="errors.items.length > 0"
                        flat color="primary"
                        @click="submit") {{ id == null ? 'Добавить' : 'Редактировать' }}
</template>

<script>
import Expanse from '../services/Expanse';

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
        .then(() => this.$router.push('/expanses'))
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
