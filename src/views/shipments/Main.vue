<template lang="pug">
  v-layout(row wrap)
    v-spacer
    v-btn.ma-0(
      v-for="(tab, index) in tabs" :key="index"
      flat color="tertiary"
      :to="tab.to"
      v-if="$hasPermission(tab.permission)"
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
          to: { name: 'pendingsales' },
          name: 'На согласовании',
          permission: this.$permissions.SHOW_SHIPMENTS_PENDING_SALES.name,
        },
        {
          to: { name: 'approvedsales' },
          name: 'На складе',
          permission: this.$permissions.SHOW_SHIPMENTS_APPROVED_SALES.name,
        },
        {
          to: { name: 'finished' },
          name: 'Завершенные',
          permission: this.$permissions.SHOW_SHIPMENTS_FINISHED.name,
        },
        {
          to: { name: 'rejected' },
          name: 'Отмененные',
          permission: this.$permissions.SHOW_SHIPMENTS_REJECTED.name,
        },
        {
          to: { name: 'accounting' },
          name: 'Бухгалтерия',
          permission: this.$permissions.SHOW_SHIPMENTS_ACCOUNTING.name,
        },
      ],
    };
  },
};
</script>
