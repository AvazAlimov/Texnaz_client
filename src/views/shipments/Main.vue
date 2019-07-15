<template lang="pug">
  v-layout(row wrap)
    v-spacer
    v-btn.ma-0(
      v-for="(tab, index) in tabs" :key="index"
      flat color="tertiary"
      :to="tab.to"
      v-if="tab.visible"
    ) {{ tab.name }}
    v-flex.mt-2(xs12)
      router-view
</template>

<script>
export default {
  name: 'ShipmentsMain',
  data() {
    return {
      tabs: [
        {
          to: { name: 'mysales' },
          name: 'Мои отгрузки',
          visible: this.$hasPermission(this.$permissions.SHOW_SALES_MY_SALES.name),
        },
        {
          to: { name: 'salesinformation' },
          name: 'Отгрузки',
          visible: this.$hasPermission(this.$permissions.SHOW_SALES_INFORMATION.name),
        },
        {
          to: { name: 'pendingsales' },
          name: 'На согласовании',
          visible: this.$hasPermission(this.$permissions.SHOW_SALES_PENDING.name),
        },
        {
          to: { name: 'approvedsales' },
          name: 'На складе',
          visible: this.$hasPermission(this.$permissions.SHOW_SALES_APPROVED.name),
        },
        {
          to: { name: 'finished' },
          name: 'Завершенные',
          visible: true || this.$hasPermission(this.$permissions.SHOW_SALES_APPROVED.name),
        },
        {
          to: { name: 'accounting' },
          name: 'Бухгалтерия',
          visible: true || this.$hasPermission(this.$permissions.SHOW_SALES_APPROVED.name),
        },
      ],
    };
  },
};
</script>
