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
          v-btn.ma-0.mr-1(
            flat color="secondary"
            :to="{ name: 'motivation_create' }"
          ) Добавить
</template>

<script>
export default {
  name: 'Motivations',
};
</script>
