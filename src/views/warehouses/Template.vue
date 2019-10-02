<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon @click="$router.go(-1)").tertiary--text
            v-icon arrow_back
        .title.tertiary--text {{ id == null ? 'Добавить' : 'Сохранить' }} склад
        v-flex(xs12).mt-3
            .border.white.pa-4
                v-text-field(
                    v-model="warehouse.name"
                    label="Название"
                    name="name"
                    v-validate="'required'"
                    color="secondary")
                v-text-field(
                    v-model="warehouse.company"
                    label="Компания"
                    name="company"
                    v-validate="'required'"
                    color="secondary")
                v-select(
                    v-model="warehouse.type"
                    :items="types"
                    label="Тип"
                    item-text="name"
                    item-value="id"
                    name="type"
                    v-validate="'required'"
                    color="secondary")
                v-select(
                  v-model="warehouse.provinceId"
                  :items="provinces"
                  item-text="name"
                  item-value="id"
                  label="Область"
                  name="province"
                  v-validate="'required'"
                )
                v-select(
                    v-model="warehouse.ownerId"
                    :items="users"
                    label="Ответственное лицо"
                    item-text="name"
                    item-value="id"
                    name="ownerId"
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
import Warehouse from '@/services/Warehouse';
import User from '@/services/User';
import Info from '@/services/Info';
import Province from '@/services/Province';

export default {
  name: 'WarehouseTemplate',
  $_veeValidate: {
    validator: 'new',
  },
  data() {
    return {
      id: null,
      warehouse: {
        name: '',
        company: '',
        provinceId: null,
        ownerId: null,
        type: null,
      },
      users: [],
      types: [],
      provinces: [],
      loading: false,
    };
  },
  methods: {
    getAll() {
      this.loading = true;
      Promise.all([
        User.getAll(),
        Info.getWarehouseTypes(),
        Province.getAll(),
      ])
        .then((result) => {
          [this.users, this.types, this.provinces] = result;
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
        .then(() => this.$router.go(-1))
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
    this.getAll();
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
