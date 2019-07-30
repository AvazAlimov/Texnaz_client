<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12)
      v-layout(row align-center).ma-2
        v-btn(icon flat :to="{ name: 'motivations' }").dashboardTertiary--text
          v-icon arrow_back
        .title.dashboardTertiary--text Мотивация
      .white.border.pa-4
        v-layout(row wrap)
          v-flex(xs12 sm6)
            .title.mb-3 Микс
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

          v-flex.px-4(xs12 sm6)
            .title.mb-3 Пределы

            v-text-field(
              v-model="min"
              color="secondary"
              label="Минимальный"
              name="Минимальный"
              v-validate="'required|decimal|min_value:0|max_value:100'")

            v-layout.border.pa-2(row wrap v-for="(range, index) in ranges" :key="index")
              v-flex(grow)
                v-text-field(
                  hide-details
                  v-model="range.from"
                  label="Выше (0-100%)"
                  name="Выше (0-100%)"
                  v-validate="'required|decimal|min_value:0|max_value:100'"
                  color="secondary")
              v-flex(shrink)
                v-btn.mt-2(color="red" flat icon @click="ranges.splice(index, 1)")
                  v-icon(small) close
              v-flex(xs12)
                .title.mb-2 Показатели
                v-layout(row wrap v-for="(item, index) in range.percentages" :key="index")
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

            v-btn(outline color="secondary" block @click="addRange()") Управление брендами
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
import Mix from '@/services/Mix';

export default {
  name: 'Mix',
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
    total: 0,
    min: 0,
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
          this.brand = [0];
          if (this.$route.params.id) {
            Mix.get(this.$route.params.id)
              .then((mix) => {
                this.managerId = mix.managerId;
                this.type = mix.type;
                this.startDate = this.$moment(mix.start).format('YYYY-MM-DD');
                this.endDate = this.$moment(mix.end).format('YYYY-MM-DD');
                this.total = mix.total;
                this.brand = mix.ranges.length
                  ? mix.ranges[0].brands.map(brand => brand.brandId)
                  : [0];
                this.min = mix.min;
                this.ranges = mix.ranges.map(range => ({
                  from: range.from,
                  percentages: range.brands,
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
      this.ranges.push({
        from,
        percentages:
        this.brand.includes(0) ? this.brands.map(brand => ({
          brandId: brand.id,
          percentage: 0,
        }))
          : this.brand.map(brandId => ({
            brandId,
            percentage: 0,
          })),
      });
    },
    submit() {
      this.loading = true;
      const mix = {
        managerId: this.managerId,
        type: this.type,
        start: this.startDate,
        end: this.endDate,
        total: this.total,
        min: this.min,
        ranges: this.ranges.map(range => ({
          from: range.from,
          brands: range.percentages,
        })),
      };
      (this.$route.params.id ? Mix.update(this.$route.params.id, mix) : Mix.create(mix))
        .then(() => this.$router.push({ name: 'motivations' }))
        .catch(error => this.$emit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
  },
  watch: {
    brand(value) {
      const brands = value.includes(0)
        ? this.brands.filter(brand => brand.id > 0).map(brand => brand.id)
        : value;
      brands.forEach((brand) => {
        this.ranges.forEach((range) => {
          if (!range.percentages.find(item => item.brandId === brand)) {
            range.percentages.push({
              brandId: brand,
              percentage: parseFloat(this.min) || 0,
            });
          }
        });
      });
      if (!value.includes(0)) {
        this.ranges.forEach((range) => {
          for (let index = range.percentages.length - 1; index > -1; index -= 1) {
            if (!this.brand.includes(range.percentages[index].brandId)) {
              range.percentages.splice(index, 1);
            }
          }
        });
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
