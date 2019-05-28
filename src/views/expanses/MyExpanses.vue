<template lang="pug">
  div
    v-layout(row wrap v-if="$route.name == 'myexpanses'")
      v-flex(xs12).mb-3
        .title МОИ РАСХОДЫ
      v-flex(xs12)
        v-layout(row wrap)
          v-flex(xs3 v-for="(card, index) in cards" :key="index")
            Card(:title="card.title" :icon="card.icon")
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
              color="secondary"
              label="Тип расхода"
            )
            v-combobox.mx-1(
              color="secondary"
              label="Назначение"
            )
            v-combobox.mx-1(
              color="secondary"
              label="Вид расхода"
            )
            v-combobox.mx-1(
              color="secondary"
              label="Лицо"
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
export default {
  name: 'MyExpanses',
  data: () => ({
    value: 0,
    showTable: true,
    cards: [
      {
        title: 'Тип расходов',
        icon: 'payment',
      },
      {
        title: 'Назначение',
        icon: 'call_split',
      },
      {
        title: 'Вид расходов',
        icon: 'style',
      },
      {
        title: 'Лицо',
        icon: 'person_outline',
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
  }),
};
</script>
