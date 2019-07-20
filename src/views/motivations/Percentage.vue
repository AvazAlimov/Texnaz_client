<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12)
      .white.border.pa-4
        v-layout(row wrap)
          v-flex(xs12 sm6)
            .title.mb-3 Процент

            v-select(
              v-model="managerId"
              :items="managers"
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

            v-menu(v-model="start"
              :close-on-content-click="false"
              lazy transition="scale-transition"
              offset-y full-width min-width="290px")
              template(v-slot:activator="{ on }")
                v-text-field(readonly
                  color="secondary"
                  label="Срок от"
                  v-model="startDate"
                  v-on="on"
                  ref="start")
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
                  v-on="on"
                  name="end"
                  v-validate="'date_format:yyyy-MM-dd|after:start'")
              v-date-picker(
                color="secondary"
                v-model="endDate"
                @input="end = false")

            v-select(
              v-model="brand"
              :items="brands"
              :item-value="'id'"
              :item-text="'name'"
              color="secondary"
              label="Бренды"
              name="Бренды"
              v-validate="'required'"
              multiple)


          v-flex(xs12 sm6)
            .title.mb-3 Показатели

            v-text-field(
              v-model="min"
              color="secondary"
              label="Минимальный (0-100%)"
              name="Минимальный"
              v-validate="'required|decimal|min_value:0|max_value:100'")

            v-layout(row wrap v-for="(item, index) in percentages" :key="index")
              v-flex(xs12)
                v-divider
              v-flex(xs6)
                .subheading {{ brands.find(brand => brand.id == item.brandId).name }}
              v-flex(xs6)
                v-text-field(
                  hide-details
                  v-model="item.percentage"
                  label="Процент (0-100 %)"
                  name="Процент (0-100 %)"
                  v-validate="'required|decimal|min_value:0|max_value:100'"
                  color="secondary")
          v-flex(xs12)
            v-layout(row)
              v-spacer
              v-btn(
                flat
                color="secondary"
                :loading="loading"
                :disabled="errors.items.length > 0"
                @click="submit()") Завершить
</template>

<script>
import User from '@/services/User';
import Brand from '@/services/Brand';

export default {
  name: 'Percentage',
  data: () => ({
    loading: true,
    managerId: null,
    managers: [],
    brand: [0],
    brands: [
      {
        id: 0,
        name: 'Все бренды',
      },
    ],
    type: 0,
    types: [
      {
        id: 0,
        name: 'Оплата',
      },
      {
        id: 1,
        name: 'Отгрузка',
      },
    ],
    start: false,
    end: false,
    startDate: (new Date()).toISOString().substring(0, 10),
    endDate: (new Date()).toISOString().substring(0, 10),
    min: 0,
    percentages: [],
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
          brands
            .map(brand => ({
              id: brand.id,
              name: `${brand.manufacturer || ''} ${brand.name}`,
            }))
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .forEach(brand => this.brands.push(brand));
          this.brand = [0];
          if (this.$route.params.id) {
            //
          }
        })
        .catch(error => this.$$emit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
    submit() {
      //
    },
  },
  watch: {
    brand(value) {
      const brands = value.includes(0)
        ? this.brands.filter(brand => brand.id > 0).map(brand => brand.id)
        : value;
      brands.forEach((brand) => {
        if (!this.percentages.find(item => item.brandId === brand)) {
          this.percentages.push({
            brandId: brand,
            percentage: parseFloat(this.min) || 0,
          });
        }
      });
      if (!value.includes(0)) {
        for (let index = this.percentages.length - 1; index > -1; index -= 1) {
          if (!this.brand.includes(this.percentages[index].brandId)) {
            this.percentages.splice(index, 1);
          }
        }
      }
    },
  },
  created() {
    this.getAll();
  },
  mounted() {
    this.$validator.validateAll();
  },
};
</script>
