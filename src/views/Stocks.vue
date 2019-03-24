<template lang="pug">
    v-layout(row wrap )
      v-flex(xs12).mb-3
        .title БАЗА ДАННЫХ
      v-flex(xs4 v-for="card in cards" :key="card.title")
        v-list(two-line).pa-0.border
          v-list-tile(:to="card.to")
            v-list-tile-content
              v-list-tile-title {{ card.title }}
              v-list-tile-sub-title {{ card.count }}
            v-list-tile-action
              v-icon(large) {{ card.icon }})
</template>

<script>
export default {
  name: 'Stocks',
};
</script>
