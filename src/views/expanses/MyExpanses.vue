<template lang="pug">
  div
    v-layout(row wrap v-if="!data")
      v-flex(xs12).mb-3
        .title.tertiary--text РАСХОДЫ
      v-flex(xs12)
        v-layout(row wrap)
          v-flex(xs3 v-for="(card, index) in cards" :key="index")
            Card(
              :title="card.title"
              :caption="card.counter"
              :icon="card.icon"
              :click="() => data = card.data"
            )
      v-flex(xs12)
        .white.border.px-4.py-3.mb-2
          .title.mb-2 Новый расход
          v-layout(row align-center)
            v-text-field.mx-1(
              v-model="value"
              color="secondary"
              label="Сумма"
              style="min-width: 250px"
              name="value"
              v-validate="{\
                required: true,\
                decimal: true,\
                min_value: 0,\
                excluded: '0',\
              }"
            )
            v-combobox.mx-1(
              v-model="form"
              color="secondary"
              label="Тип расхода"
              :items="forms"
              item-text="name"
              clearable
            )
            v-combobox.mx-1(
              v-model="purpose"
              color="secondary"
              label="Назначение"
              :items="purposes"
              item-text="name"
              clearable
            )
            v-combobox.mx-1(
              v-model="type"
              color="secondary"
              label="Вид расхода"
              :items="types"
              item-text="name"
              clearable
            )
            v-combobox.mx-1(
              v-model="person"
              color="secondary"
              label="Лицо"
              :items="people"
              item-text="name"
              clearable
            )
            v-menu(
              v-model="opened"
              :close-on-content-click="false"
              min-width="290px"
            ).mx-1
              template(v-slot:activator="{ on }")
                v-text-field(
                  readonly
                  v-on="on"
                  label="Дата"
                  v-model="date"
                )
              v-date-picker(
                v-model="date"
                @input="opened = !opened"
              )
            v-btn.mx-1(
              flat
              color="secondary"
              :loading="loading"
              :disabled="errors.items.length > 0"
              @click="submit()"
            ) Сохранить

        .white.border
          v-layout.px-4.py-2(row align-center)
            .title {{ showTable ? 'Все расходы' : 'Статистика' }}
            v-spacer
            v-btn.mr-0(icon flat color="seconadry" @click="showTable=!showTable")
              v-icon {{ showTable ? 'data_usage' : 'view_list' }}
          ExpenseAnalytics(
            v-if="!showTable"
            :forms="forms"
            :types="types"
            :purposes="purposes"
            :people="people"
            :expenses="expanses"
          )
          v-data-table(
            v-if="showTable"
            :headers="headers"
            :items="expanses"
          )
            template(v-slot:items="props")
              td
                .title {{ props.item.value }}
              td {{ props.item.form ? props.item.form.name : '-' }}
              td {{ props.item.purpose ? props.item.purpose.name : '-' }}
              td {{ props.item.type ? props.item.type.name : '-' }}
              td {{ props.item.person ? props.item.person.name : '-' }}
              td {{ props.item.createdAt | moment('YYYY-MM-DD HH:mm') }}
              td
                v-layout
                  v-btn(icon @click="openEditDilog(props.item)").mx-0
                      v-icon(color="secondary" small) edit
                  v-btn(icon @click="remove(props.item.id)").mx-0
                      v-icon(color="red" small) delete
          EditExpense(
            v-model="dialog"
            :expense="expense"
            :forms="forms"
            :types="types"
            :purposes="purposes"
            :people="people"
            :postUpdate="getAll"
          )
        div(v-if="showTable").white.border.mt-2
          Revenue(
            :expanses="expanses"
          )
    v-layout(row wrap v-if="data" align-center)
      v-btn(icon @click="data=null;getAll()").tertiary--text
            v-icon arrow_back
      .title.tertiary--text {{ data.title }}
      v-flex(xs12)
        ExpenseProperty(:data="data")
</template>

<script>
import MyExpanses from '@/services/MyExpanses';

export default {
  name: 'MyExpanses',
  data: () => ({
    date: (new Date()).toISOString().substring(0, 10),
    opened: false,
    data: null,
    value: 0,
    showTable: true,
    loading: false,
    cards: [
      {
        title: 'Тип расходов',
        icon: 'payment',
        counter: '0',
        data: {
          title: 'Тип расходов',
          getAll: MyExpanses.getAllForms,
          update: MyExpanses.updateForm,
          remove: MyExpanses.deleteForm,
          create: MyExpanses.createForm,
        },
      },
      {
        title: 'Назначение',
        icon: 'call_split',
        counter: '0',
        data: {
          title: 'Назначение',
          getAll: MyExpanses.getAllPurposes,
          update: MyExpanses.updatePurpose,
          remove: MyExpanses.deletePurpose,
          create: MyExpanses.createPurpose,
        },
      },
      {
        title: 'Вид расходов',
        icon: 'style',
        counter: '0',
        data: {
          title: 'Вид расходов',
          getAll: MyExpanses.getAllTypes,
          update: MyExpanses.updateType,
          remove: MyExpanses.deleteType,
          create: MyExpanses.createType,
        },
      },
      {
        title: 'Лицо',
        icon: 'person_outline',
        counter: '0',
        data: {
          title: 'Лицо',
          getAll: MyExpanses.getAllPeople,
          update: MyExpanses.updatePerson,
          remove: MyExpanses.deletePerson,
          create: MyExpanses.createPerson,
        },
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
        text: 'Вид расходов',
        value: 'personId',

      },
      {
        text: 'Лицо',
        value: 'personId',

      },
      {
        text: 'Дата',
        value: 'createdAt',

      },
      {
        sortable: false,
        width: 1,
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
    dialog: false,
    expense: {},
  }),
  methods: {
    getAll() {
      this.loading = true;
      Promise.all([
        MyExpanses.getAll(this.$getUserId()),
        MyExpanses.getAllForms(),
        MyExpanses.getAllPurposes(),
        MyExpanses.getAllTypes(),
        MyExpanses.getAllPeople(),
      ])
        .then((results) => {
          [this.expanses, this.forms, this.purposes, this.types, this.people] = results;
          this.cards[0].counter = `${this.forms.length}`;
          this.cards[1].counter = `${this.purposes.length}`;
          this.cards[2].counter = `${this.types.length}`;
          this.cards[3].counter = `${this.people.length}`;
        })
        .catch(error => this.$store.commit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
    submit() {
      this.loading = true;

      new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
        Promise.all([
          this.getPropertyId(this.type, MyExpanses.createType),
          this.getPropertyId(this.form, MyExpanses.createForm),
          this.getPropertyId(this.purpose, MyExpanses.createPurpose),
          this.getPropertyId(this.person, MyExpanses.createPerson),
        ])
          .then((results) => {
            const [typeId, formId, purposeId, personId] = results;
            MyExpanses.create({
              userId: this.$getUserId(),
              value: this.value,
              typeId,
              purposeId,
              formId,
              personId,
              createdAt: this.date,
            }).then(() => {
              this.value = 0;
              this.type = null;
              this.form = null;
              this.purpose = null;
              this.person = null;
              this.getAll();
            })
              .catch(error => this.$store.commit('setMessage', error.message))
              .finally(() => { this.loading = false; });
          })
          .catch(error => this.$store.commit('setMessage', error.message));
      });
    },
    getPropertyId(property, createAction) {
      return new Promise((resolve, reject) => {
        if (property) {
          if (property.id) {
            resolve(property.id);
          } else {
            createAction(property)
              .then(item => resolve(item.id))
              .catch(error => reject(error));
          }
        } else {
          resolve(null);
        }
      });
    },

    remove(id) {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (confirm('Это действие удалит элемент навсегда, вы уверены?')) {
        MyExpanses.delete(id)
          .then(() => { this.getAll(); })
          .catch((error) => {
            this.$store.commit('setMessage', error.message);
          });
      }
    },

    openEditDilog(item) {
      this.expense = item;
      this.dialog = true;
    },
  },
  created() {
    this.getAll();
  },
};
</script>
