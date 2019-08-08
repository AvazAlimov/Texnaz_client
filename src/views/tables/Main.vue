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
        to: { name: 'sales' },
        name: 'Отгрузки',
      },
      {
        to: { name: 'paymentInfo' },
        name: 'Оплаты',
      },
      {
        to: { name: 'debtclients' },
        name: 'Баланс клиентов',
      },
      {
        to: { name: 'latedebts' },
        name: 'ПДЗ',
      },
      {
        to: { name: 'returnclient' },
        name: 'Возврат истории',
      },
      {
        to: { name: 'rates' },
        name: 'Курсы',
      },
    ],
  }),
};
</script>
