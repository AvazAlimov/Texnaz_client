<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12)
      .white.border
        .title.mx-4.my-3 Мотивации
        Motivations(
          :userId="($hasRole(1) || $hasRole(3) || $hasRole(6)) ? null : $getUserId()"
        )
        v-divider
        v-layout(row)
          v-spacer
          v-menu(offset-y v-if="$hasRole(1) || $hasRole(7) || $hasRole(8)")
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
  name: 'Motivationstable',
};
</script>
