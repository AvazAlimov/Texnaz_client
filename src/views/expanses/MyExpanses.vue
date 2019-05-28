<template lang="pug">
  div
    v-layout(row wrap v-if="$route.name == 'myexpanses'")
      v-flex(xs12).mb-3
        .title МОИ РАСХОДЫ
      v-flex(xs12)
        v-layout(row wrap)
          v-flex(xs3 v-for="(card, index) in cards" :key="index")
            Card(:title="card.title" :caption="card.counter" :icon="card.icon")
      v-flex(xs12)
        .white.border.px-4.py-3.mb-2
          .title.mb-2 Новый расход
          v-layout(row align-center)
            v-text-field.mx-1(
              v-model="value"
              color="secondary"
              label="Сумма"
              style="min-width: 300px"
            )
            v-combobox.mx-1(
              v-model="form"
              color="secondary"
              label="Тип расхода"
              :items="forms"
              item-text="name"
              item-value="id"
            )
            v-combobox.mx-1(
              v-model="purpose"
              color="secondary"
              label="Назначение"
              :items="purposes"
              item-text="name"
              item-value="id"
            )
            v-combobox.mx-1(
              v-model="type"
              color="secondary"
              label="Вид расхода"
              :items="types"
              item-text="name"
              item-value="id"
            )
            v-combobox.mx-1(
              v-model="person"
              color="secondary"
              label="Лицо"
              :items="people"
              item-text="name"
              item-value="id"
            )
            v-btn.mx-1(
              flat
              color="secondary"
            ) Сохранить

        .white.border
          v-layout.px-4.py-2(row align-center)
            .title {{ showTable ? 'Все расходы' : 'Статистика' }}
            v-spacer
            v-btn.mr-0(icon flat color="seconadry" @click="showTable=!showTable")
              v-icon {{ showTable ? 'data_usage' : 'view_list' }}
          v-data-table(
            v-if="showTable"
            hide-actions
            :headers="headers"
            :items="expanses"
          )
    router-view
</template>

<script>
import MyExpanses from '@/services/MyExpanses';

export default {
  name: 'MyExpanses',
  data: () => ({
    value: 0,
    showTable: true,
    loading: false,
    cards: [
      {
        title: 'Тип расходов',
        icon: 'payment',
        counter: '0',
      },
      {
        title: 'Назначение',
        icon: 'call_split',
        counter: '0',
      },
      {
        title: 'Вид расходов',
        icon: 'style',
        counter: '0',
      },
      {
        title: 'Лицо',
        icon: 'person_outline',
        counter: '0',
      },
    ],
    headers: [
      {
        text: 'Сумма',
        value: 'value',
      },
      {
        text: 'Тип расходов',
        value: 'typeId',
      },
      {
        text: 'Назначение',
        value: 'purposeId',
      },
      {
        text: 'Лицо',
        value: 'personId',
      },
      {
        text: 'Дата',
        value: 'date',
      },
      {
        sortable: false,
      },
    ],
    expanses: [],
    forms: [],
    form: null,
    purposes: [],
    purpose: null,
    types: [],
    type: null,
    people: [],
    person: null,
  }),
  methods: {
    getAll() {
      this.loading = true;
      Promise.all([
        MyExpanses.getAllForms(),
        MyExpanses.getAllPurposes(),
        MyExpanses.getAllTypes(),
        MyExpanses.getAllPeople(),
      ])
        .then((results) => {
          [this.forms, this.purposes, this.types, this.people] = results;
          this.cards[0].counter = `${this.forms.length}`;
          this.cards[1].counter = `${this.purposes.length}`;
          this.cards[2].counter = `${this.types.length}`;
          this.cards[3].counter = `${this.people.length}`;
        })
        .catch(error => this.$store.commit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
  },
  created() {
    this.getAll();
  },
};
</script>
