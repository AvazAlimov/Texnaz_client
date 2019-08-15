<template lang="pug">
  div
    v-layout(row wrap v-if="$route.name == 'clients'")
        v-flex(xs12).mb-3
          v-layout(wrap)
            .title.tertiary--text КЛИЕНТЫ
            v-spacer
            .subheading.tertiary--text Обший баланс: {{ totalBalance }}
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
              :search="search"
              :pagination.sync="pagination"
            )
              template(v-slot:items="{ item }")
                td {{ item.icc }}
                td {{ item.name }}
                td {{ balance(item) | roundUp | readable }}
                td {{ item.itn || '-' }}
                td {{ item.contactPerson || '-' }}
                td {{ item.phone || '-' }}
                td {{ item.region.province.name }}
                td {{ item.region.name }}
                td {{ item.sphere || '-' }}
                td {{ item.manager.name }}
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
          text: 'Pегион',
          value: 'region.name',
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
      totalBalance: 0,
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
    myClients() {
      return this.$getClients(this.clients);
    },
    pages() {
      if (this.pagination.rowsPerPage == null || this.pagination.totalItems == null) { return 0; }
      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage);
    },
  },
  methods: {
    balance(client) {
      return this.$getClientBalance(client, this.sales.filter(el => el.clientId === client.id));
    },
    getAll() {
      this.loading = true;
      this.clients = [];

      Promise.all([
        Client.getAll(),
        Sale.getAll(),
      ]).then((result) => {
        [this.clients, this.sales] = result;
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
