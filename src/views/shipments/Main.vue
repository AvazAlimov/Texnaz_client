<template lang="pug">
  v-layout(row wrap)
    v-spacer
    v-btn.ma-0(
      v-for="(tab, index) in tabs" :key="index"
      flat color="secondary"
      :to="tab.to"
    ) {{ tab.name }}
    v-flex.mt-2(xs12)
      router-view
</template>

<script>
export default {
  name: 'ShipmentsMain',
  data: () => ({
    tabs: [
      {
        to: { name: 'mysales' },
        name: 'Мои отгрузки',
      },
      {
        to: { name: 'salesinformation' },
        name: 'Отгрузки',
      },
      {
        to: { name: 'pendingsales' },
        name: 'На согласовании',
      },
      {
        to: { name: 'approvedsales' },
        name: 'Согласованные',
      },
    ],
  }),
};
</script>
