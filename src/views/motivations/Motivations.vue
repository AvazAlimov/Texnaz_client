<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12)
      .white.border
        .title.mx-4.my-3 Мотивации
        v-divider
        v-data-table(
          :headers="[]"
          :items="[]"
          hide-actions)
        v-divider
        v-layout(row)
          v-spacer
          v-menu(offset-y)
            template(v-slot:activator="{ on }")
              v-btn.ma-0.mr-1(
                flat color="secondary"
                v-on="on") Добавить
            v-list
              v-list-tile(:to="{ name: 'plan' }")
                v-list-tile-title План
              v-list-tile(:to="{ name: 'percentage' }")
                v-list-tile-title Процент
              v-list-tile(:to="{ name: 'mix' }")
                v-list-tile-title Микс
</template>

<script>
export default {
  name: 'Motivations',
};
</script>
