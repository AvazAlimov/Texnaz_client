<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12)
      .white.border.pa-4
        v-layout(row wrap)
          v-flex(xs6)
            .title.mb-3 План

            v-combobox(
              v-model="manager"
              :items="managers"
              auto-select-first
              item-value="id"
              item-text="name"
              color="secondary"
              label="Менеджер"
              name="Менеджер"
              v-validate="'required'"
              clearable)

            v-select(
              v-model="type"
              :items="types"
              item-value="id"
              item-text="name"
              color="secondary"
              label="Выбрать тип"
              name="Выбрать тип"
              v-validate="'required'")

            v-select(
              v-model="method"
              :items="methods"
              item-value="id"
              item-text="name"
              color="secondary"
              label="Выбрать метод"
              name="Выбрать метод"
              v-validate="'required'")

            v-menu(v-model="start"
              :close-on-content-click="false"
              lazy transition="scale-transition"
              offset-y full-width min-width="290px")
              template(v-slot:activator="{ on }")
                v-text-field(readonly
                  color="secondary"
                  label="Срок от"
                  v-model="startDate"
                  v-on="on")
              v-date-picker(
                color="secondary"
                v-model="startDate"
                @input="start = false")

            v-menu(v-model="end"
              :close-on-content-click="false"
              lazy transition="scale-transition"
              offset-y full-width min-width="290px")
              template(v-slot:activator="{ on }")
                v-text-field(readonly
                  color="secondary"
                  label="Срок до"
                  v-model="endDate"
                  v-on="on")
              v-date-picker(
                color="secondary"
                v-model="endDate"
                @input="end = false")

            v-text-field(
              v-model="value"
              color="secondary"
              label="Размер"
              name="Размер"
              v-validate="'required'")

            v-combobox(
              v-if="type == 0"
              v-model="brand"
              :items="brands"
              auto-select-first
              item-value="id"
              item-text="name"
              color="secondary"
              label="Бренды"
              name="Бренды"
              v-validate="'required'"
              multiple)

          v-flex(xs6)
            .title.mb-3 Пределы

            v-text-field(
              v-model="min"
              color="secondary"
              label="Минимальный"
              name="Минимальный"
              v-validate="'required'")

            //v-text-field(
              v-model="max"
              color="secondary"
              label="Максимальный"
              name="Максимальный"
              v-validate="'required'")
            v-layout(row wrap v-for="(range, index) in ranges" :key="index")
              v-flex(extend)
                v-text-field(
                  v-model="range.from"
                  label="От части размера (%)"
                  name="От части размера (%)"
                  v-validate="'required'"
                  color="secondary"
                )
              v-flex(extend)
                v-text-field(
                  v-model="range.percentage"
                  label="Процент (%)"
                  name="Процент (%)"
                  v-validate="'required'"
                  color="secondary"
                )
              v-flex(shrink)
                v-btn.mt-3(color="red" flat icon @click="ranges.splice(index, 1)")
                  v-icon(small) close
            v-btn(outline color="secondary" block @click="addRange()") Добавить предел
</template>

<script>
import User from '@/services/User';
import Brand from '@/services/Brand';

export default {
  name: 'Plan',
  data: () => ({
    loading: true,
    manager: null,
    managers: [],
    brand: null,
    brands: [],
    type: 0,
    types: [
      {
        id: 0,
        name: 'Бренд',
      },
      {
        id: 1,
        name: 'Оплата',
      },
      {
        id: 2,
        name: 'Отгрузка',
      },
    ],
    method: 0,
    methods: [
      {
        id: 0,
        name: 'Отдельно',
      },
      {
        id: 1,
        name: 'Накопительно',
      },
    ],
    start: false,
    end: false,
    startDate: (new Date()).toISOString().substring(0, 10),
    endDate: (new Date()).toISOString().substring(0, 10),
    value: 0,
    min: 0,
    max: 0,
    ranges: [],
  }),
  methods: {
    getAll() {
      Promise.all([
        User.getAll(),
        Brand.getAll(),
      ])
        .then((results) => {
          const [users, brands] = results;
          this.managers = users
            .filter(user => user.roles
              .map(role => role.id)
              .includes(2));
          this.brands = brands.map(brand => ({
            id: brand.id,
            name: `${brand.manufacturer || ''} ${brand.name}`,
          }));
        })
        .catch(error => this.$$emit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
    addRange() {
      const from = this.ranges.length ? this.ranges[this.ranges.length - 1].from + 1 : 0;
      this.ranges.push({ from, percentage: 0 });
    },
  },
  created() {
    this.getAll();
  },
};
</script>
