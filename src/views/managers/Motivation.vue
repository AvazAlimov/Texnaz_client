<template lang="pug">
    v-layout(row wrap align-center)
      v-btn(icon :to="{ name: 'manager' }")
        v-icon arrow_back
      .title МОТИВАЦИЯ
      v-flex(xs12)
        .white.border.mt-3
          .pa-4
            v-layout(row wrap)
              v-flex(xs6)
                v-layout(row align-center)
                  .title Выбрать вид
                  v-spacer
                  v-btn.ma-0(color="secondary"
                    :flat="motivationType != 0"
                    :outline="motivationType == 0"
                    @click="motivationType = 0") План
                  v-btn.ma-0(color="secondary"
                    :flat="motivationType != 1"
                    :outline="motivationType == 1"
                    @click="motivationType = 1") Процент
                v-layout.mt-2(row align-center v-if="motivationType == 1")
                  .title Выбрать тип
                  v-spacer
                  v-btn.ma-0(color="secondary"
                    :flat="type != 0"
                    :outline="type == 0"
                    @click="type = 0") За бренд
                  v-btn.ma-0(color="secondary"
                    :flat="type != 1"
                    :outline="type == 1"
                    @click="type = 1") За транзакцию
                v-layout.mt-2(row align-center)
                  .title {{ motivationType == 0 ? 'Выбрать тип' : 'Выбрать подтип' }}
                  v-spacer
                  v-btn.ma-0(color="secondary"
                    :flat="subType != 0"
                    :outline="subType == 0"
                    @click="subType = 0") За оплату
                  v-btn.ma-0(color="secondary"
                    :flat="subType != 1"
                    :outline="subType == 1"
                    @click="subType = 1") За отгрузку
                v-text-field.mt-2(v-model="value"
                  color="secondary" label="Размер" suffix="$")
                v-layout.mt-2(row align-center)
                  v-menu(v-model="start"
                    :close-on-content-click="false"
                    lazy transition="scale-transition"
                    offset-y full-width min-width="290px")
                    template(v-slot:activator="{ on }")
                      v-text-field(color="secondary"
                        v-model="startDate" label="Срок от"
                        readonly v-on="on")
                    v-date-picker(color="secondary"
                        v-model="startDate"
                        @input="start = false")
                  v-menu(v-model="end"
                    :close-on-content-click="false"
                    lazy transition="scale-transition"
                    offset-y full-width min-width="290px")
                    template(v-slot:activator="{ on }")
                      v-text-field(color="secondary"
                        v-model="endDate" label="Срок до"
                        readonly v-on="on")
                    v-date-picker(color="secondary"
                        v-model="endDate"
                        @input="end = false")
                v-select.mt-2(
                    v-if="motivationType == 1 && type == 0"
                    v-model="brand"
                    :items="brands"
                    item-value="id"
                    label="Бренд"
                    name="brand"
                    v-validate="'required'"
                    color="secondary")
                    template(slot="item" slot-scope="data")
                      | {{ data.item.name }} - {{ data.item.manufacturer }}
                    template(slot="selection" slot-scope="data")
                      | {{ data.item.name }} - {{ data.item.manufacturer }}
</template>

<script>
import Brand from '@/services/Brand';

export default {
  name: 'Motivation',
  data: () => ({
    motivationType: 0,
    type: 0,
    subType: 0,
    value: 0,
    brand: null,
    start: false,
    end: false,
    startDate: (new Date()).toISOString().substring(0, 10),
    endDate: (new Date()).toISOString().substring(0, 10),
    brands: [],
  }),
  methods: {
    getAll() {
      Promise.all([
        Brand.getAll(),
      ])
        .then((results) => {
          [this.brands] = results;
        })
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        });
    },
  },
  created() {
    this.getAll();
  },
};
</script>
