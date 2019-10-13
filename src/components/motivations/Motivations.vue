<template lang="pug">
  .white.border
    v-layout(align-center).mx-4.my-3
      .title.mr-4 Мотивации
      v-menu(
              v-model="startMenu"
              full-width
              min-width="290px"
              :close-on-content-click="false"
      ).ma-2
        template(v-slot:activator="{ on }")
            v-text-field(
                readonly
                v-model="startDate"
                v-on="on"
                label="От"
            )
        v-date-picker(
            v-model="startDate"
            @input="() => { startMenu = false }"
        )
      v-menu(
              v-model="endMenu"
              full-width
              min-width="290px"
              :close-on-content-click="false"
      ).ma-2
        template(v-slot:activator="{ on }")
            v-text-field(
                readonly
                v-model="endDate"
                v-on="on"
                label="До"
            )
        v-date-picker(
            v-model="endDate"
            @input="() => { endMenu = false }"
        )
      v-spacer
      v-text-field(
              v-model="search"
              label="Поиск"
              append-icon="search"
      )
    v-data-table(
      :headers="headers"
      :items="filteredData(false)"
      :loading="loading"
      :search="search"
      hide-actions)
      template(v-slot:items="{ item }")
        td {{ item.territory }}
        td {{ item.role }}
        td {{ item.name }}
        td {{ item.start || 0 | moment('DD-MM-YYYY')}}
        td {{ item.end || 0 | moment('DD-MM-YYYY')}}
        td {{ item.plan }}
        td {{ item.total || 0 | roundUp | readable}}
        td {{ item.progress || 0 | roundUp | readable}} %
        td {{ item.type ? 'Отгрузка' : 'Оплата'}}
        td {{ item.earned || 0 | roundUp | readable}}
        td
          v-layout(row)
              v-spacer
              v-btn.ma-0(flat color="secondary" icon
                :to="{ name: 'plan_edit', params: {id: item.id} }")
                v-icon(small v-if="$hasRole(1)") edit
                v-icon(small v-else) visibility
        //
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
    v-divider.my-4
    .title.mx-4.my-3 История
    v-data-table(
      :headers="headers"
      :items="filteredData(true)"
      :loading="loading"
      :search="search").mt-2
      template(v-slot:items="{ item }")
        tr.red.lighten-4
          td {{ item.territory }}
          td {{ item.role }}
          td {{ item.name }}
          td {{ item.start || 0 | moment('DD-MM-YYYY')}}
          td {{ item.end || 0 | moment('DD-MM-YYYY')}}
          td {{ item.plan }}
          td {{ item.total || 0 | roundUp | readable}}
          td {{ item.progress || 0 | roundUp | readable}} %
          td {{ item.type ? 'Отгрузка' : 'Оплата'}}
          td {{ item.earned || 0 | roundUp | readable}}
          td
            v-layout(row)
                v-spacer
                v-btn.ma-0(flat color="secondary" icon
                  :to="{ name: 'plan_edit', params: {id: item.id, readOnly: true} }")
                  v-icon(small) visibility
</template>

<script>
import Plan from '@/services/Plan';
import Percentage from '@/services/Percentage';
import Mix from '@/services/Mix';
import Sale from '@/services/Sale';
import Payment from '@/services/Payment';
import User from '@/services/User';

export default {
  name: 'Motivations',
  props: {
    userId: {
      required: false,
    },
  },
  data: () => ({
    loading: false,
    motivations: [],
    search: '',
    roles: [],
    headers: [
      {
        text: 'Территория',
        value: 'territory',
      },
      {
        text: 'Роль',
        value: 'role',
      },
      {
        text: 'Имя',
        value: 'name',
      },
      {
        text: 'Дата начала',
        value: 'start',
      },
      {
        text: 'Дата окончания',
        value: 'end',
      },
      {
        text: 'План',
        value: 'plan',
      },
      {
        text: 'Результат',
        value: 'total',
      },
      {
        text: '%',
        value: 'progress',
      },
      {
        text: 'Тип',
        value: 'type',
      },
      {
        text: '$',
        value: 'earned',
      },
      {
        sortable: false,
      },
    ],
    items: [],
    startMenu: false,
    startDate: '',
    endMenu: false,
    endDate: '',
  }),
  methods: {
    filterDate(items) {
      return items.filter(({ createdAt }) => {
        const dateMotivation = new Date(createdAt);
        const start = new Date(this.startDate === '' ? null : this.startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(this.endDate === '' ? '12-12-9999' : this.endDate);
        end.setHours(23, 59, 59, 59);
        return dateMotivation > start && dateMotivation < end;
      });
    },
    filterDay(items, isLate) {
      const now = new Date();
      return this.filterDate(items).filter(({ end }) => (isLate
        ? (new Date(end)) < now : (new Date(end)) >= now));
    },

    filteredData(isLate) {
      if (this.roles.includes(7)) {
        return this.filterDay(this.items, isLate).filter(({ user: { controller } }) => (controller
          ? controller.id === this.userId : false));
      } if (this.roles.includes(8)) {
        return this.filterDay(this.items, isLate).filter(({ user: { territory } }) => (territory
          ? territory.id === this.user.territoryId : false));
      } if (this.roles.includes(2)) {
        return this.filterDay(this.items, isLate).filter(({ user: { id } }) => id === this.userId);
      }

      return this.filterDay(this.items, isLate);
    },
    getAll() {
      this.loading = true;
      Promise.all([
        Plan.getAll(),
        Sale.getAll(),
        Payment.getAll(),
        User.getAll(),
      ]).then((results) => {
        const [plans, sales, payments, users] = results;
        const user = users.find(({ id }) => id === this.userId);
        this.roles = user ? user.roles.map(({ id }) => id) : [];
        plans.forEach((plan) => {
          switch (plan.roleId) {
            case 2: // Manager
              this.items.push({
                ...plan,
                territory: plan.user.territory.name,
                role: plan.role.name,
                name: plan.user.name,
                start: plan.start,
                end: plan.end,
                plan: plan.total,
                type: plan.type,
                ...this.plan(plan, sales, payments, [plan.userId]),
              });
              break;
            case 7: // Supervisor
              this.items.push({
                ...plan,
                territory: plan.user.territory.name,
                role: plan.role.name,
                name: plan.user.name,
                start: plan.start,
                end: plan.end,
                plan: plan.total,
                type: plan.type,
                ...this.plan(plan, sales, payments, users
                  .filter(({ controller }) => (controller
                    ? controller.id === plan.userId : false))
                  .map(({ id }) => id)),
              });
              break;
            case 8: // Territory manager
              this.items.push({
                ...plan,
                territory: plan.user.territory.name,
                role: plan.role.name,
                name: plan.user.name,
                start: plan.start,
                end: plan.end,
                plan: plan.total,
                type: plan.type,
                ...this.plan(plan, sales, payments, users
                  .filter(({ territoryId }) => (territoryId
                    ? territoryId === plan.user.territory.id : false))
                  .map(({ id }) => id)),
              });
              break;
            default:
              break;
          }
        });
      }).catch(error => this.$store.commit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
    // returns { total, progress, earned }
    /**
     * motivation {
     *  userId: 0,
     *  brands: [],
     *  ranges: [],
     * }
     */
    plan(motivation, sales, payments, managerIds) {
      const result = {};
      const brands = motivation.brands.length ? motivation.brands.map(el => el.brandId) : [];
      // Оплата или Отгрузка
      switch (motivation.type) {
        // Оплата
        case 0: {
          result.total = managerIds.map(managerId => (brands.length ? sales
            .filter(el => el.managerId === managerId
              && el.shipped && new Date(el.createdAt) < new Date(motivation.end))
            .map(sale => sale.items
              .filter((item) => {
                if (brands.length) {
                // When no brand selected at the time payment, Take as done for required brand
                  return item.stock.product.Brand
                    ? brands.includes(item.stock.product.Brand.id) : false;
                }
                return true;
              })
              .map(item => (sale.type === 3
                ? item.paidPrice : (item.paidPrice / sale.officialRate)))
              .reduce((a, b) => a + b, 0))
            .reduce((a, b) => a + b, 0)
            : payments
              .filter(payment => payment.managerId === managerId && payment.approved)
              .map(payment => (payment.ratio === 1
                ? payment.sum : (payment.sum / payment.exchangeRate)))
              .reduce((a, b) => a + b, 0)))
            .reduce((a, b) => a + b, 0);
          result.progress = (result.total * 100) / motivation.total;
          break;
        }
        // Отгрузка
        case 1: {
          result.total = managerIds.map(managerId => sales.filter(el => el.managerId === managerId
            && el.shipped && new Date(el.createdAt) > new Date(motivation.start))
            .map((el) => {
              if (brands.length) {
                return el.items.filter(item => brands.includes(item.stock.product.brand));
              }
              return el;
            })
            .map(el => this.$getTotalPrice(el, el.exchangeRate, el.officialRate))
            .reduce((a, b) => a + b, 0))
            .reduce((a, b) => a + b, 0);

          result.progress = (result.total * 100) / motivation.total;
          break;
        }
        default:
          break;
      }
      // Отдельно или Накопительно
      let earned = 0;
      switch (motivation.method) {
        // Накопительно
        case 0: {
          const range = motivation.ranges.length ? motivation.ranges
            .filter(el => el.from < result.progress).pop() : null;
          // eslint-disable-next-line no-param-reassign
          earned = result.total * ((range ? range.percentage : 0) / 100);
          break;
        }
        // Отдельно
        case 1: {
          const ranges = motivation.ranges.length ? motivation.ranges
            .filter(el => el.from < result.progress) : null;
          ranges.forEach((range) => {
            earned += (result.total - (motivation.total
                        * ((range ? range.from : 0) / 100)))
                        * ((range ? range.percentage : 0) / 100);
          });
          break;
        }
        default:
          break;
      }

      result.earned = earned || result.total * (motivation.min / 100);

      return result;
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
    <!-- Changed product logic
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
              collections.filter((item) => {
                if (this.userId) {
                  return item.managerId === this.userId;
                }
                return true;
              }).forEach((item) => {
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

          const totalPrice = filtered
            .map(payment => (payment.ratio === 1 ? payment.sum : (payment.sum / payment.ratio)))
            .reduce((a, b) => a + b, 0);
          motivation.ranges.forEach((range) => {
            const decide = totalPrice >= motivation.total * (range.from / 100);
            range.brands.forEach((brand) => {
              filtered.forEach((payment) => {
                if (payment.brandId === brand.brandId) {
                  percent += (payment.ratio === 1 ? payment.sum : payment.sum / payment.ratio);
                  if (decide) {
                    total += (payment.ratio === 1 ? payment.sum : payment.sum / payment.ratio)
                    * (brand.percentage / 100);
                  }
                }
              });
            });
          });
          break;
        }
        // Отгрузка
        case 1: {
          const filtered = sales.filter(sale => motivation.managerId === sale.managerId)
            .filter(el => el.approved);

          const totalPrice = filtered
            .map(sale => this.$getTotalPrice(sale, sale.exchangeRate, sale.officialRate))
            .reduce((a, b) => a + b, 0);

          filtered.forEach((sale) => {
            const filteredItem = { ...sale };
            motivation.ranges.forEach((range) => {
              const decide = totalPrice >= motivation.total * (range.from / 100);
              range.brands.forEach((brand) => {
                filteredItem.items = sale.items
                  .filter(item => item.stock.product.brand === brand.brandId);
                const money = this.$getTotalPrice(filteredItem,
                  filteredItem.exchangeRate, filteredItem.officialRate);
                percent += money;
                if (decide) {
                  total += money * (brand.percentage / 100);
                }
              });
            });
          });
          break;
        }
        default:
          break;
      }
      // eslint-disable-next-line no-param-reassign
      motivation.earned = total === 0 ? percent * (motivation.min / 100) : total;
      // eslint-disable-next-line no-param-reassign
      motivation.progress = (percent * 100) / motivation.total;
    },
