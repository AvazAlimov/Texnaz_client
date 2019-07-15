<template lang="pug">
  v-layout(row wrap)
    v-btn.ma-0(
      v-for="(tab, index) in tabs" :key="index"
      flat color="tertiary"
      :to="tab.to"
    ) {{ tab.name }}
    v-flex.mt-2(xs12)
      router-view
</template>

<script>
export default {
  name: 'TablesMain',
  data: () => ({
    tabs: [
      {
        // to: { name: 'mysales' },
        name: 'Отгрузки',
      },
      {
        // to: { name: 'mysales' },
        name: 'Оплаты',
      },
      {
        // to: { name: 'mysales' },
        name: 'Баланс клиентов',
      },
      {
        // to: { name: 'mysales' },
        name: 'ПДЗ',
      },
      {
        // to: { name: 'mysales' },
        name: 'Курсы',
      },
    ],
  }),
};
</script>
