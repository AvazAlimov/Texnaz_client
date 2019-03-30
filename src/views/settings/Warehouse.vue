<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'settings_warehouses' }")
            v-icon arrow_back
        .title {{ id == null ? 'Добавить' : 'Редактировать' }} склад
        v-flex(xs12).mt-3
            .border.white.pa-4
                v-text-field(
                    v-model="warehouse.name"
                    label="Название"
                    name="name"
                    v-validate="'required'")
                v-text-field(
                    v-model="warehouse.owner"
                    label="Владелец"
                    name="owner"
                    v-validate="'required'")
                v-text-field(
                    v-model="warehouse.address"
                    label="Адрес"
                    name="address"
                    v-validate="'required'")
                v-text-field(
                    v-model="warehouse.company"
                    label="Компания"
                    name="company"
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
import Warehouse from '@/services/Warehouse';

export default {
  name: 'Warehouse',
  $_veeValidate: {
    validator: 'new',
  },
  data() {
    return {
      id: null,
      warehouse: {
        name: '',
        owner: '',
        address: '',
        company: '',
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
        .then(() => this.$router.push({ name: 'settings_warehouses' }))
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => { this.loading = false; });
    },
    create() {
      this.execute(Warehouse.create(this.warehouse));
    },
    update() {
      this.execute(Warehouse.update(this.id, this.warehouse));
    },
  },
  created() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      Warehouse.get(this.$route.params.id)
        .then((warehouse) => { this.warehouse = warehouse; });
    }
  },
  mounted() {
    this.$validator.validateAll();
  },
};
</script>
