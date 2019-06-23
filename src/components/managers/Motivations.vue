<template lang="pug">
    .white.border
        .title.mx-4.my-3 Мотивация
        v-divider
        v-data-table(
            :headers="[]"
            :items="[]"
            hide-actions)
        v-divider
        v-layout(row)
            v-spacer
            v-btn.ma-0.mb-1(
                flat
                color="secondary"
            ) Добавить план
            v-btn.ma-0.mb-1.mr-1(
                flat
                color="secondary"
            ) Добавить процент
</template>

<script>
export default {
  name: 'Motivations',
};
</script>
