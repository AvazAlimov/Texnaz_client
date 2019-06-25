<template lang="pug">
    v-layout(row wrap align-center)
      v-btn(icon :to="{ name: 'motivations' }")
        v-icon arrow_back
      .title МОТИВАЦИЯ
      v-flex(xs12)
        .white.border.mt-3
          .pa-4
            v-layout(row wrap)
              v-flex(xs6)
                v-layout(row align-center)
                  v-flex(xs3)
                    .title ВЫБРАТЬ ВИД:
                  v-flex.pa-0(xs3 v-for="type in motivationTypes" :key="type.id")
                    v-btn(block color="secondary" small
                      :outline="motivationType != type.id"
                      :depressed="motivationType == type.id"
                      @click="motivationType = type.id") {{ type.name }}
                v-layout.mt-2(row align-center)
                  v-flex(xs3)
                    .title ВЫБРАТЬ ТИП:
                  v-flex.pa-0(xs3 v-for="element in types" :key="element.id")
                    v-btn(block color="secondary" small
                      :outline="type != element.id"
                      :depressed="type == element.id"
                      @click="type = element.id") {{ element.name }}
                v-layout.mt-2(row align-center)
                  v-flex(xs3)
                    .title СРОК ОТ:
                  v-menu(v-model="start"
                    :close-on-content-click="false"
                    lazy transition="scale-transition"
                    offset-y full-width min-width="290px")
                    template(v-slot:activator="{ on }")
                      v-text-field.ma-0.pa-0(
                        hide-details
                        color="secondary"
                        v-model="startDate"
                        readonly v-on="on")
                    v-date-picker(color="secondary"
                        v-model="startDate"
                        @input="start = false")
                v-layout.mt-2(row align-center)
                  v-flex(xs3)
                    .title СРОК ДО:
                  v-menu(v-model="end"
                    :close-on-content-click="false"
                    lazy transition="scale-transition"
                    offset-y full-width min-width="290px")
                    template(v-slot:activator="{ on }")
                      v-text-field.ma-0.pa-0(
                        hide-details
                        color="secondary"
                        v-model="endDate"
                        readonly v-on="on")
                    v-date-picker(color="secondary"
                        v-model="endDate"
                        @input="end = false")
                v-layout.mt-2(row align-center)
                  v-flex(xs3)
                    .title РАЗМЕР:
                  v-text-field.ma-0.pa-0(
                    hide-details
                    color="secondary"
                    v-model="value"
                    suffix="$")
                v-layout.mt-2(row align-center)
                  v-flex(xs3)
                    .title БРЕНД:
                  v-select.ma-0.pa-0(v-model="brand"
                      :items="brands"
                      item-value="id"
                      name="brand"
                      v-validate="'required'"
                      color="secondary"
                      hide-details)
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
    motivationTypes: [
      {
        id: 0,
        name: 'План',
      },
      {
        id: 1,
        name: 'Процент',
      },
      {
        id: 2,
        name: 'Микс',
      },
    ],
    type: 0,
    types: [
      {
        id: 0,
        name: 'Бренд',
      },
      {
        id: 1,
        name: 'Оплата',
      },
      {
        id: 2,
        name: 'Отгрузка',
      },
    ],
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
