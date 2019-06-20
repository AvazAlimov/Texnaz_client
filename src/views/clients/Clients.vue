<template lang="pug">
  div
    v-layout(row wrap v-if="$route.name == 'clients'")
        v-flex(xs12).mb-3
            .title КЛИЕНТЫ
        v-flex(xs12)
          .border.white
            v-data-table(
              :loading="loading"
              hide-actions
              :headers="headers"
              :items="myClients"
            )
              template(v-slot:items="props")
                td {{ props.item.icc }}
                td {{ props.item.name }}
                td {{ props.item.itn }}
                td {{ props.item.contactPerson }}
                td {{ props.item.phone }}
                td {{ props.item.region.province.name }} / {{ props.item.region.name }}
                td {{ props.item.sphere }}
                td {{ props.item.manager.name }}
                td
                  v-layout(v-if="$hasRole(1)")
                      v-btn(icon
                        :to="{ name: 'client', params: { id: props.item.id }}"
                      ).mx-0
                          v-icon(color="secondary" small) edit
                      v-btn(icon @click="remove(props.item.id)").mx-0
                          v-icon(color="red" small) delete
            v-divider
            v-layout(row v-if="$hasRole(1)")
              v-spacer
              v-btn.ma-2(
                flat color="secondary"
                :to="{ name: 'client' }"
              ) Добавить
    router-view
</template>

<script>
import Client from '@/services/Client';

export default {
  name: 'Clients',
  data() {
    return {
      loading: false,
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
          text: 'Область-регион',
          value: 'region',
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
          sortable: false,
          width: 100,
        },
      ],
      clients: [],
    };
  },
  computed: {
    myClients() {
      return this.$getClients(this.clients);
    },
  },
  methods: {
    getAll() {
      this.loading = true;
      this.clients = [];
      Client.getAll()
        .then((clients) => {
          this.clients = clients;
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
