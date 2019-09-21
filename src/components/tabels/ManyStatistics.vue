<template lang="pug">
    v-layout(wrap)
        v-flex(xs12)
            v-layout(align-center)
                v-select(
                    name="territories"
                    v-model="territory"
                    :items="territories"
                    item-text="name"
                    item-value="id"
                    label="Territories"
                    v-validate="'required'"
                ).ma-2
                v-select(
                    v-model="province"
                    :items="provinces"
                    item-text="name"
                    item-value="id"
                    label="Regions"
                ).ma-2
                v-spacer
                v-menu(
                    v-model="startMenu"
                ).ma-2
                    template(v-slot:activator="{ on }")
                        v-text-field(
                            readonly
                            v-on="on"
                            v-model="start"
                            label="От"
                        )
                    v-date-picker(
                        v-model="start"
                        :max="maximum"
                    )
                v-menu(
                    v-model="endMenu"
                )
                    template(v-slot:activator="{ on }")
                        v-text-field(
                            v-on="on"
                            readonly
                            v-model="end"
                            label="До"
                        )
                    v-date-picker(
                        v-model="end"
                        :max="maximum"
                    )
                v-btn(icon :disabled="errors.items.length > 0" @click="generate").ma-2
                    v-icon table_chart
        v-flex(xs12)
            v-data-table(
                :headers="headers"
                :items="items"
                :loading="loading"
                fixed-height
            )
              template(v-slot:items="props")
                  tr(@click="() =>{props.expanded = !props.expanded}")
                    td {{ props.item.territory }}
                    td {{ props.item.province }}
                    td {{ props.item.sum | roundUp | readable}}
              template(v-slot:expand="props")
                .grey.lighten-4
                  v-data-table(
                      :headers="expandedHeaders"
                      :items="props.item.expandedItems"
                      hide-actions
                  )
                    template(v-slot:items="{ item }")
                      tr(v-if="item.provinces.length ? item.provinces.includes(props.item.id) : false")
                        td {{ item.name }}
                        td
                          v-chip(
                            v-for="role in item.roles"
                            :key="role.id"
                            color="secondary"
                            text-color="black"
                            outline
                            disabled
                          ) {{ role.name }}
                        td {{ item.sum | roundUp | readable}}

</template>
<script>
import Territory from '@/services/Territory';
import Province from '@/services/Province';
import Client from '@/services/Client';
import User from '@/services/User';
import Payment from '@/services/Payment';

export default {
  data() {
    return {
      loading: false,
      startMenu: false,
      start: null,
      endMenu: false,
      end: null,
      maximum: (new Date()).toISOString().substring(0, 10),
      territories: [],
      territory: null,
      allprovinces: [],
      tableProvinces: [],
      provinces: [],
      province: null,
      headers: [
        {
          text: 'Territory',
          value: 'territory',
        },
        {
          text: 'Region',
          value: 'province',
        },
        {
          text: 'Total sum',
          value: 'sum',
        },
      ],
      items: [],
      expandedHeaders: [
        {
          text: 'Name',
          value: 'name',
          width: 1,
        },
        {
          text: 'Role',
          value: 'roles',
          width: 1,
        },
        {
          text: 'Sum',
          value: 'sum',
          width: 1,
        },
      ],
      expandedItems: [],
      users: [],
      filteredUsers: [],
      payments: [],
    };
  },
  computed: {
    filteredPayments() {
      const start = new Date(this.start);
      start.setHours(0, 0, 0, 0);
      const end = new Date(this.end);
      end.setHours(23, 59, 59, 59);
      return (this.start && this.end) ? this.payments.filter(payment => (((new Date(payment.createdAt)) > start)
        && ((new Date(payment.createdAt)) < end))) : this.payments;
    },
  },
  methods: {
    getAll() {
      this.loading = true;
      Promise.all([
        Territory.getAll(),
        Province.getAll(),
        User.getAll(),
        Payment.getAll(),
      ]).then((result) => {
        [this.territories, this.allprovinces, this.users, this.payments] = result;
        this.territories.push({ id: 0, name: 'All' });
        this.territories.sort((a, b) => (a > b ? 1 : -1));
        this.provinces = this.allprovinces;
      }).catch((err) => { this.$store.commit('setMessage', err.message); })
        .finally(() => { this.loading = false; });
    },
    getProvinces(user) {
      const territory = this.territories.find(({ id }) => user.territoryId === id) || { provinces: [] };
      return user.controller ? this.users.find(({ id }) => id === user.controller.id).provinces.map(({ id }) => id) || []
        : territory.provinces.map(({ id }) => id);
    },
    generate() {
      this.expandedItems = this.filteredUsers.map(user => ({
        name: user.name,
        provinces: user.provinces,
        roles: user.roles.length > 1 ? user.roles.filter(role => role.id !== 2) : user.roles,
        sum: this.filteredPayments.filter(payment => payment.manager.id === user.id)
          .map(({ ratio, sum }) => (ratio === 1 ? sum : (sum / ratio)))
          .reduce((a, b) => a + b, 0),
      }));
      this.items = this.tableProvinces.map(province => ({
        id: province.id,
        territory: province.territory.name,
        province: province.name,
        sum: this.expandedItems.filter(item => item.provinces.includes(province.id))
          .reduce((a, b) => a + b.sum, 0),
        expandedItems: this.expandedItems,
      }));
    },
  },
  watch: {
    province(provinceId) {
      this.tableProvinces = [this.allprovinces.find(province => province.id === provinceId)];
      const territory = this.territories
        .find(({ provinces }) => provinces.map(({ id }) => id).includes(provinceId));
      this.filteredUsers = this.users
        .filter(({ territoryId }) => (territory ? (territoryId === territory.id) : false))
        .map(user => ({
          id: user.id,
          roles: user.roles,
          name: user.name,
          provinces: user.provinces ? user.provinces.map(el => el.id) : this.getProvinces(user),
        }));
    },
    territory(id) {
      this.filteredUsers = this.users
        .filter(({ territoryId }) => (id === 0 ? true : territoryId === id))
        .map(user => ({
          id: user.id,
          roles: user.roles,
          name: user.name,
          provinces: user.provinces ? user.provinces.map(el => el.id) : this.getProvinces(user),
        }));
      this.provinces = this.allprovinces
        .filter(({ territoryId }) => (id === 0 ? true : territoryId === id));
      this.tableProvinces = this.provinces;
    },
  },
  created() {
    this.getAll();
  },
};
</script>
<style scoped>
    tr:hover {
        cursor: pointer;
    }
</style>
