<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12)
      v-layout(wrap align-center).ma-2
        v-btn(flat icon :to="{ name: 'motivations' }").dashboardTertiary--text
          v-icon arrow_back
        .title.dashboardTertiary--text Мотивация
      .white.border.pa-4
        v-layout(row wrap)
          v-flex(xs12 sm6)
            .title.mb-3 План

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

            v-text-field(
              v-model="total"
              color="secondary"
              label="Сумма плана в $"
              name="Сумма плана в $"
              v-validate="'required|decimal'")

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
            .title.mb-3 Пределы

            v-text-field(
              v-model="min"
              color="secondary"
              label="Минимальный"
              name="Минимальный"
              v-validate="'required|decimal|min_value:0|max_value:100'")

            v-layout(row wrap v-for="(range, index) in ranges" :key="index")
              v-flex(xs12)
                v-divider
              v-flex(extend)
                v-text-field(
                  v-model="range.from"
                  :label="`Выше (${ range.from }-${ ranges[index + 1] \
                    ? ranges[index + 1].from : '~' } %)`"
                  :name="`Выше (${ range.from }-${ ranges[index + 1] \
                    ? ranges[index + 1].from : '~' } %)`"
                  v-validate="'required|decimal|min_value:0|max_value:100'"
                  color="secondary")
              v-flex(extend)
                v-text-field(
                  v-model="range.percentage"
                  label="Процент (0-100 %)"
                  name="Процент (0-100 %)"
                  v-validate="'required|decimal|min_value:0|max_value:100'"
                  color="secondary")
              v-flex(shrink)
                v-btn.mt-3(color="red" flat icon @click="ranges.splice(index, 1)")
                  v-icon(small) close
            v-btn(outline color="secondary" block @click="addRange()") Добавить предел
          v-flex(xs12)
            v-layout(row)
              v-spacer
              v-btn(
                flat
                v-if="$hasRole(1)"
                color="secondary"
                :loading="loading"
                :disabled="errors.items.length > 0 || !!!ranges.length"
                @click="submit()") Завершить
</template>

<script>
import User from '@/services/User';
import Brand from '@/services/Brand';
import Plan from '@/services/Plan';

export default {
  name: 'Plan',
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
    method: 0,
    methods: [
      {
        id: 0,
        name: 'Накопительно',
      },
      {
        id: 1,
        name: 'Отдельно',
      },
    ],
    start: false,
    end: false,
    startDate: (new Date()).toISOString().substring(0, 10),
    endDate: (new Date()).toISOString().substring(0, 10),
    total: 0,
    min: 0,
    max: 0,
    ranges: [],
  }),
  methods: {
    getAll() {
      this.loading = true;
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
          if (this.$route.params.id) {
            Plan.get(this.$route.params.id)
              .then((plan) => {
                this.managerId = plan.managerId;
                this.type = plan.type;
                this.method = plan.method;
                this.startDate = this.$moment(plan.start).format('YYYY-MM-DD');
                this.endDate = this.$moment(plan.end).format('YYYY-MM-DD');
                this.total = plan.total;
                this.brand = plan.allBrands ? [0] : plan.brands.map(el => el.id);
                this.min = plan.min;
                this.ranges = plan.ranges.map(range => ({
                  from: range.from,
                  percentage: range.percentage,
                })).sort((a, b) => (a.from > b.from ? 1 : -1));
              })
              .catch(error => this.$emit('setMessage', error.message));
          }
        })
        .catch(error => this.$$emit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
    addRange() {
      const from = this.ranges.length
        ? (parseFloat(this.ranges[this.ranges.length - 1].from) || 0) + 1
        : 0;
      this.ranges.push({ from, percentage: 0 });
    },
    submit() {
      this.loading = true;
      const plan = {
        managerId: this.managerId,
        type: this.type,
        method: this.method,
        start: this.startDate,
        end: this.endDate,
        total: this.total,
        min: this.min,
        allBrands: this.brand.includes(0),
        brands: this.brand.includes(0) ? [] : this.brand,
        ranges: this.ranges,
      };
      (this.$route.params.id ? Plan.update(this.$route.params.id, plan) : Plan.create(plan))
        .then(() => this.$router.push({ name: 'motivations' }))
        .catch(error => this.$emit('setMessage', error.message))
        .finally(() => { this.loading = false; });
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
