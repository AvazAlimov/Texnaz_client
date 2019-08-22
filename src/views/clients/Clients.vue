<template lang="pug">
  div
    v-layout(row wrap v-if="$route.name == 'clients'")
        v-flex(xs12).mb-3
          v-layout(wrap)
            .title.tertiary--text КЛИЕНТЫ
            v-spacer
            .subheading.tertiary--text Общий баланс: {{ totalBalance | roundUp | readable}}
        v-flex(xs12)
          .border.white
            v-text-field(
              v-model="search"
              append-icon="search"
              label="Поиск"
            ).ma-4
            v-data-table(
              :loading="loading"
              hide-actions
              :headers="headers"
              :items="myClients"
              :pagination.sync="pagination"
            )
              template(v-slot:items="{ item }")
                td {{ item.icc }}
                td {{ item.name }}
                td {{ item.balance | roundUp | readable }}
                td {{ item.inn || '-' }}
                td {{ item.contactPerson || '-' }}
                td {{ item.phone || '-' }}
                td {{ item.province }}
                td {{ item.sphere || '-' }}
                td {{ item.manager }}
                td {{ item.createdAt | moment('YYYY-MM-DD') }}
                td
                  v-layout(v-if="$hasRole(1)")
                      v-btn(icon
                        :to="{ name: 'client', params: { id: item.id }}"
                      ).mx-0
                          v-icon(color="secondary" small) edit
                      v-btn(icon @click="remove(item.id)").mx-0
                          v-icon(color="red" small) delete
            v-divider
            .text-xs-center.py-2
              v-pagination(v-model="pagination.page" color="secondary" :length="pages")
            v-divider
            v-layout(row v-if="$hasRole(1) || $hasRole(3) || $hasRole(6)")
              v-spacer
              v-btn.ma-2(
                flat color="secondary"
                :to="{ name: 'client' }"
              ) Добавить
    router-view
</template>

<script>
import Client from '@/services/Client';
import Sale from '@/services/Sale';

export default {
  name: 'Clients',
  data() {
    return {
      search: '',
      loading: false,
      sales: [],
      headers: [
        {
          text: 'ИКК',
          value: 'icc',
        },
        {
          text: 'Наименование',
          value: 'name',
        },
        {
          text: 'Баланс',
          value: 'balance',
        },
        {
          text: 'ИНН',
          value: 'itn',
        },
        {
          text: 'Контактное лицо',
          value: 'contactPerson',
        },
        {
          text: 'Номер телефон',
          value: 'phone',
        },
        {
          text: 'Область',
          value: 'region.province.name',
        },
        {
          text: 'Направление деятельности',
          value: 'sphere',
        },
        {
          text: 'Менеджер',
          value: 'manager.name',
        },
        {
          text: 'Добавлено',
          value: 'createdAt',
        },
        {
          sortable: false,
          width: 100,
        },
      ],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 50,
        // sortBy: string",
        totalItems: 0,
      },
      clients: [],
    };
  },
  computed: {
    totalBalance() {
      return this.myClients.map(el => el.balance).reduce((a, b) => a + b, 0);
    },
    myClients() {
      return this.clients.filter(client => (
        (client.icc.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (client.icc.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (client.name.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (client.balance.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (client.inn.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (client.contactPerson.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (client.phone.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (client.province.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (client.sphere.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (client.manager.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (client.createdAt.toString().toLowerCase()).includes(this.search.toLowerCase())
      ));
    },
    pages() {
      if (this.pagination.rowsPerPage == null || this.pagination.totalItems == null) { return 0; }
      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage);
    },
  },
  methods: {
    balance(client) {
      return this
        .$getClientBalance(client, this.sales
          .filter(el => el.clientId === client.id && el.approved)) || 0;
    },
    getAll() {
      this.loading = true;
      this.clients = [];

      Promise.all([
        Client.getAll(),
        Sale.getAll(),
      ]).then((result) => {
        [this.clients, this.sales] = result;
        this.clients = this.$getClients(this.clients).map(item => ({
          id: item.id,
          icc: item.icc || 0,
          name: item.name || '-',
          balance: this.balance(item) || 0,
          inn: item.itn || '-',
          contactPerson: item.contactPerson || '-',
          phone: item.phone || '-',
          province: item.region.province.name || '-',
          region: item.region.name || '-',
          sphere: item.sphere || '-',
          manager: item.manager.name || '-',
          createdAt: item.createdAt || '-',
        }));
        this.pagination.totalItems = this.clients.length;
      }).catch((error) => {
        this.$store.commit('setMessage', error.message);
      })
        .finally(() => { this.loading = false; });
    },
    remove(id) {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (confirm('Это действие удалит элемент навсегда, вы уверены?')) {
        Client.delete(id)
          .then(() => { this.getAll(); })
          .catch((error) => {
            this.$store.commit('setMessage', error.message);
          });
      }
    },
  },
  created() {
    this.getAll();
  },
};
</script>
