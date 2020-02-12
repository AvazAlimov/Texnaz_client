<template lang="pug">
  v-layout(row wrap)
    v-btn.ma-0(
      v-for="(tab, index) in tabs" :key="index"
      v-if="$hasPermission(tab.permission)"
      flat color="tertiary"
      :to="tab.to"
    ) {{ tab.name }}
    v-flex.mt-2(xs12)
      router-view
</template>

<script>
export default {
  name: 'TablesMain',
  data() {
    return {
      tabs: [
        {
          to: { name: 'statistics' },
          name: 'Статистика',
          permission: this.$permissions.SHOW_TABEL_STATISTICS.name,
        },
        {
          to: { name: 'sales' },
          name: 'Отгрузки',
          permission: this.$permissions.SHOW_TABELS.name,
        },
        {
          to: { name: 'paymentInfo' },
          name: 'Оплаты',
          permission: this.$permissions.SHOW_TABELS.name,
        },
        {
          to: { name: 'debtclients' },
          name: 'Баланс клиентов',
          permission: this.$permissions.SHOW_TABELS.name,
        },
        {
          to: { name: 'clientdetails' },
          name: 'Данные клиента',
          permission: this.$permissions.SHOW_TABELS.name,
        },
        {
          to: { name: 'returnclient' },
          name: 'Возврат',
          permission: this.$permissions.SHOW_TABELS.name,
        },
        {
          to: { name: 'rates' },
          name: 'Курсы',
          permission: this.$permissions.SHOW_TABEL_RATES.name,
        },
        /* {
        to: { name: 'latedebts' },
        name: 'ПДЗ',
      }, */
      ],
    };
  },
};
</script>
