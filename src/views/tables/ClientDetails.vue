<template lang="pug">
    v-layout(wrap)
        v-flex(xs12)
            .border.white
                v-layout(wrap align-center).pa-3
                    v-menu(
                        v-model="fromPopup"
                        :close-on-content-click="false"
                        min-width="290px"
                    ).ma-3
                        template(v-slot:activator="{ on }")
                            v-text-field(
                                readonly
                                v-on="on"
                                v-model="from"
                                label="От"
                            )
                        v-date-picker(
                            v-model="from"
                            @input="fromPopup = false"
                        )
                    v-menu(
                        v-model="toPopup"
                        :close-on-content-click="false"
                        full-width
                        min-width="290px"
                    ).ma-3
                        template(v-slot:activator="{ on }")
                            v-text-field(
                                readonly
                                v-on="on"
                                v-model="to"
                                label="До"
                            )
                        v-date-picker(
                            v-model="to"
                            @input="toPopup = false"
                        )
                    v-text-field(
                        v-model="icc"
                        label="ИКК"
                    )
                    v-spacer
                    v-text-field(
                        v-model="search"
                        append-icon="search"
                        label="Поиск"
                    )
                    v-btn(icon @click="() => getAll()")
                      v-icon table_chart
                    v-btn(icon :disabled="!items.length" @click="print()").secondary--text
                      v-icon print
                v-data-table(
                    :headers="headers"
                    :items="items"
                    :loading="loading"
                    :search="search"
                    disable-initial-sort
                )
                    template(v-slot:items="{ item }")
                        ClientDetails(:item="item")
</template>
<script>
import Client from '@/services/Client';
import Export from '@/utils/Export';

export default {
  data() {
    return {
      icc: '',
      from: '',
      to: '',
      loading: false,
      search: '',
      fromPopup: false,
      toPopup: false,
      headers: [
        {
          text: 'Дата',
          value: 'date',
        },
        {
          text: 'Клиент',
          value: 'clientName',
        },
        {
          text: 'ИКК',
          value: 'icc',
        },
        {
          text: 'Менеджер',
          value: 'managerName',
        },
        {
          text: 'Территория',
          value: 'territoryName',
        },
        {
          text: 'Отгрузка',
          value: 'salePrice',
        },
        {
          text: 'Возврат',
          value: 'returnPrice',
        },
        {
          text: 'Оплата',
          value: 'paymentPrice',
        },

      ],
      items: [],
    };
  },
  methods: {
    getAll() {
      if (this.icc) {
        this.loading = true;
        Client.getDetails(this.icc, this.from, this.to)
          .then((result) => {
            this.items = result.map(data => ({
              ...data,
              date: new Date(data.date),
            }));
          }).catch(err => this.$store.commit('setMessage', err.message))
          .finally(() => { this.loading = false; });
      } else {
        this.$store.commit('setMessage', 'User icc is empty');
      }
    },
    print() {
      Export.tableClientDetails(this.items.map(item => ({
        ...item,
        date: this.$moment(item.date).format('DD-MM-YYYY'),
      })), 'ClientDetails');
    },
  },
};
</script>
