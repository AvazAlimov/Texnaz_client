<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12)
      .white.border
        .title.mx-4.my-3 Мотивации
        v-divider
        v-data-table(
          :headers="headers"
          :items="motivations"
          :loading="loading"
          hide-actions)
          template(v-slot:items="props")
            td {{ props.item.manager.name }}
            td {{ props.item.start | moment('YYYY-MM-DD') }}
            td {{ props.item.end | moment('YYYY-MM-DD') }}
            td
              v-progress-linear(:value="props.item.progress \
              ? props.item.progress: 0" color="secondary")
            td {{ props.item.earned ? props.item.earned: 0 | roundUp | readable}} $
            td {{ props.item.createdAt | moment('YYYY-MM-DD HH:mm') }}
            td
              v-layout(row)
                v-spacer
                v-btn.ma-0(flat color="secondary" icon
                  :to="{\
                    name: props.item.motivationType == 0\
                      ? 'plan_edit'\
                      : (props.item.motivationType == 1\
                      ? 'percentage_edit'\
                      : 'mix_edit'),\
                      params: {id: props.item.id}\
                    }")
                  v-icon(small v-if="$hasRole(1)") edit
                  v-icon(small v-else) visibility
                v-btn.ma-0(flat color="red" icon
                  @click="remove(props.item.id, props.item.motivationType)")
                  v-icon(small) delete
        v-divider
        v-layout(row)
          v-spacer
          v-menu(offset-y v-if="$hasRole(1)")
            template(v-slot:activator="{ on }")
              v-btn.ma-0.mr-1(
                flat color="secondary"
                v-on="on") Добавить
            v-list
              v-list-tile(:to="{ name: 'plan' }")
                v-list-tile-title План
              v-list-tile(:to="{ name: 'percentage' }")
                v-list-tile-title Процент
              v-list-tile(:to="{ name: 'mix' }")
                v-list-tile-title Микс
</template>

<script>
import Plan from '@/services/Plan';
import Percentage from '@/services/Percentage';
import Mix from '@/services/Mix';
import Sale from '@/services/Sale';
import Payment from '@/services/Payment';

export default {
  name: 'Motivations',
  data: () => ({
    loading: false,
    motivations: [],
    headers: [
      {
        text: 'Менеджер',
        value: 'manager.name',
      },
      {
        text: 'Срок от',
        value: 'start',
      },
      {
        text: 'Срок до',
        value: 'end',
      },
      {
        text: 'Прогресс',
        sortable: false,
      },
      {
        text: 'Вознаграждения',
        sortable: false,
      },
      {
        text: 'Добавлено',
        value: 'createdAt',
      },
      {
        sortable: false,
      },
    ],
  }),
  methods: {
    getAll() {
      this.motivations = [];
      Promise.all([
        Plan.getAll(),
        Percentage.getAll(),
        Mix.getAll(),
        Sale.getAll(),
        Payment.getAll(),
      ])
        .then((results) => {
          results.forEach((collections, index) => {
            if (index <= 2) {
              collections.forEach((item) => {
                // eslint-disable-next-line no-param-reassign
                item.motivationType = index;
                this.calculate(index, item, [results[3], results[4]]);
                this.motivations.push(item);
              });
            }
          });
        })
        .catch(error => this.$store.commit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
    calculate(type, motivation, result) {
      switch (type) {
        case 0:
          this.plan(motivation, result);
          break;
        case 1:
          this.percent(motivation, result);
          break;
        case 2:
          this.mix(motivation, result);
          break;
        default:
          break;
      }
    },
    plan(motivation, [sales, payments]) {
      let total = 0;
      const brands = motivation.brands.length ? motivation.brands.map(el => el.id) : [];
      // Оплата или Отгрузка
      switch (motivation.type) {
        // Оплата
        case 0: {
          total = payments.filter(el => el.managerId === motivation.managerId)
            .filter((el) => {
              if (brands.length) {
                // When no brand selected at the time payment, Take as done for required brand
                return el.brandId ? true : brands.includes(el.brandId);
              }
              return true;
            })
            .map(el => (el.ratio === 1 ? el.sum : (el.sum / el.ratio)))
            .reduce((a, b) => a + b, 0);
          // eslint-disable-next-line no-param-reassign
          motivation.progress = (total * 100) / motivation.total;
          break;
        }
        // Отгрузка
        case 1: {
          total = sales.filter(el => el.managerId === motivation.managerId)
            .map((el) => {
              if (brands.length) {
                return el.items.filter(item => brands.includes(item.stock.product.brand));
              }
              return el;
            })
            .map(el => this.$getTotalPrice(el, el.exchangeRate, el.officialRate))
            .reduce((a, b) => a + b, 0);
          // eslint-disable-next-line no-param-reassign
          motivation.progress = (total * 100) / motivation.total;
          break;
        }
        default:
          break;
      }
      console.log(`Total: ${total}`);
      const range = motivation.ranges.length ? motivation.ranges
        .filter(el => el.from < motivation.progress).pop() : null;
      // Отдельно или Накопительно
      switch (motivation.method) {
        // Отдельно
        case 0: {
          // eslint-disable-next-line no-param-reassign
          motivation.earned = (total - (motivation.total
            * ((range ? range.from : 0) / 100))) * ((range ? range.percentage : 0) / 100);
          break;
        }
        // Накопительно
        case 1: {
          // eslint-disable-next-line no-param-reassign
          motivation.earned = total * ((range ? range.percentage : 0) / 100);
          break;
        }
        default:
          break;
      }
    },
    percent(motivation, [sales, payments]) {
      let total = 0;
      // Оплата или Отгрузка
      switch (motivation.type) {
        // Оплата
        case 0: {
          // Payments have only required brands.
          const filtered = payments.filter(el => (motivation.managerId === el.managerId))
            .filter(el => el.approved)
            .filter(payment => motivation.brands.map(el => el.brandId).includes(payment.brandId));
          // For every brand calculates its total payment
          motivation.brands.forEach((el) => {
            total += filtered.filter(payment => el.brandId === payment.brandId)
              .reduce((a, b) => {
                const first = a.ratio === 1 ? a.sum : (a.sum / a.ratio);
                const second = b.ratio === 1 ? b.sum : (b.sum / b.ratio);
                return (Number.isNaN(first) ? 0 : first) + (Number.isNaN(second) ? 0 : second);
              }, 0) * (el.percentage / 100);
          });
          break;
        }
        // Отгрузкаs
        case 1: {
          sales.filter(sale => motivation.managerId === sale.managerId)
            .filter(el => el.approved)
            .forEach((sale) => {
              const filteredItem = { ...sale };
              motivation.brands.forEach((el) => {
                filteredItem.items = sale.items
                  .filter(item => item.stock.product.brand === el.brandId);
                total += this.$getTotalPrice(filteredItem, filteredItem.exchangeRate,
                  filteredItem.officialRate) * (el.percentage / 100);
              });
            });
          break;
        }
        default:
          break;
      }
      // eslint-disable-next-line no-param-reassign
      motivation.earned = total;
    },
    mix(motivation, [sales, payments]) {
      let total = 0;
      let percent = 0;
      // Оплата или Отгрузка
      switch (motivation.type) {
        // Оплата
        case 0: {
          // Payments have only required brands.
          const filtered = payments.filter(payment => (motivation.managerId === payment.managerId))
            .filter(payment => payment.approved);

          motivation.ranges.forEach((range) => {
            range.brands.forEach((brand) => {
              filtered.forEach((payment) => {
                if (payment.brandId === brand.brandId) {
                  percent += (payment.ratio === 1 ? payment.sum : payment.sum / payment.ratio);
                  total += (payment.ratio === 1 ? payment.sum : payment.sum / payment.ratio)
                    * (brand.percentage / 100);
                }
              });
            });
          });
          break;
        }
        // Отгрузка
        case 1: {
          sales.filter(sale => motivation.managerId === sale.managerId)
            .filter(el => el.approved)
            .forEach((sale) => {
              const filteredItem = { ...sale };
              motivation.ranges.forEach((range) => {
                range.brands.forEach((brand) => {
                  filteredItem.items = sale.items
                    .filter(item => item.stock.product.brand === brand.brandId);
                  const money = this.$getTotalPrice(filteredItem,
                    filteredItem.exchangeRate, filteredItem.officialRate);
                  total += money * (brand.percentage / 100);
                  percent += money;
                });
              });
            });
          break;
        }
        default:
          break;
      }
      // eslint-disable-next-line no-param-reassign
      motivation.earned = total;
      // eslint-disable-next-line no-param-reassign
      motivation.progress = (percent * 100) / motivation.total;
    },
    remove(id, type) {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (confirm('Это действие удалит элемент навсегда, вы уверены?')) {
        let model = null;
        switch (type) {
          case 0:
            model = Plan;
            break;
          case 1:
            model = Percentage;
            break;
          case 2:
            model = Mix;
            break;
          default:
            return;
        }
        model.delete(id)
          .then(() => { this.getAll(); })
          .catch(error => this.$store.commit('setMessage', error.message));
      }
    },
  },
  created() {
    this.getAll();
  },
};
</script>
