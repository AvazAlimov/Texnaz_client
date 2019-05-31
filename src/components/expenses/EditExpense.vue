<template lang="pug">
    v-dialog(:value="value && expense" persistent)
      v-card
        v-card-title
          .title Изменить расход
        v-divider
        v-card-text
          v-layout(row align-center)
            v-text-field.mx-1(
              v-model="val"
              color="secondary"
              label="Сумма"
              style="min-width: 250px"
              name="val"
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
        v-card-actions
          v-spacer
          v-btn(
            flat
            color="secondary"
            :disabled="!!errors.first('val')"
            @click="update()"
            :loading="loading"
          ) Сохранить
          v-btn(flat color="secondary" @click="cancel()") Отменить
</template>

<script>
import MyExpanses from '@/services/MyExpanses';

export default {
  name: 'EditExpense',
  props: {
    value: {
      default: false,
      required: true,
    },
    expense: {
      type: Object,
      required: true,
    },
    types: {
      required: true,
    },
    forms: {
      required: true,
    },
    purposes: {
      required: true,
    },
    people: {
      required: true,
    },
    postUpdate: {
      type: Function,
      required: true,
    },
  },
  data: () => ({
    loading: false,
    val: null,
    type: null,
    form: null,
    purpose: null,
    person: null,
  }),
  methods: {
    cancel() {
      this.$emit('input', false);
    },
    update() {
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
            MyExpanses.update(this.expense.id, {
              value: this.val,
              typeId,
              purposeId,
              formId,
              personId,
            }).then(() => {
              this.postUpdate();
              this.cancel();
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
  },
  watch: {
    expense(value) {
      if (value.id) {
        this.val = value.value;
        this.type = this.types.find(item => item.id === value.typeId);
        this.form = this.forms.find(item => item.id === value.formId);
        this.purpose = this.purposes.find(item => item.id === value.purposeId);
        this.person = this.people.find(item => item.id === value.personId);
      } else {
        this.cancel();
      }
    },
  },
};
</script>
