<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'purposes' }")
            v-icon arrow_back
        .title {{ id == null ? 'Добавить' : 'Редактировать' }} назначение
        v-flex(xs12).mt-3
            .border.white.pa-4
                v-text-field(
                    v-model="number"
                    label="Номер"
                    mask="########"
                    name="number"
                    v-validate="'required'")
                v-textarea(
                    v-model="description"
                    label="Описание"
                    name="description"
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
import Purpose from '@/services/Purpose';

export default {
  name: 'Purpose',
  $_veeValidate: {
    validator: 'new',
  },
  data() {
    return {
      id: null,
      number: '',
      description: '',
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
        .then(() => this.$router.push({ name: 'purposes' }))
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => { this.loading = false; });
    },
    create() {
      this.execute(Purpose.create({
        number: this.number,
        description: this.description,
      }));
    },
    update() {
      this.execute(Purpose.update(this.id, {
        number: this.number,
        description: this.description,
      }));
    },
  },
  created() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      Purpose.get(this.$route.params.id)
        .then(({ number, description }) => {
          this.number = number;
          this.description = description;
        });
    }
  },
  mounted() {
    this.$validator.validateAll();
  },
};
</script>
