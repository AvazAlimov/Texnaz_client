<template lang="pug">
    tr
     td {{ item.date | moment('YYYY-MM-DD')}}
     td {{ item.clientName }}
     td {{ item.icc }}
     td {{ item.managerName }}
     td {{ item.territoryName }}
     td {{ item.salePrice }}
     td {{ item.returnPrice }}
     td {{ item.paymentPrice }}
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
