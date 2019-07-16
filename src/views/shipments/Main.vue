<template lang="pug">
  v-layout(row wrap)
    v-spacer
    v-btn.ma-0(
      v-for="(tab, index) in tabs" :key="index"
      flat color="tertiary"
      :to="tab.to"
      v-if="tab.visible == null ? true : tab.visible"
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
        },
        {
          to: { name: 'approvedsales' },
          name: 'На складе',
        },
        {
          to: { name: 'finished' },
          name: 'Завершенные',
        },
        {
          to: { name: 'rejected' },
          name: 'Отмененные',
        },
        {
          to: { name: 'accounting' },
          name: 'Бухгалтерия',
          visible: this.$hasRole(1) || this.$hasRole(3),
        },
      ],
    };
  },
};
</script>
