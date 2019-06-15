<template lang="pug">
    v-layout(justify-center row wrap)
      // Ceo view
      v-flex(xs12 v-if="$hasRole(1)")
        .border.white.pa-4
          v-layout(row wrap align-center)
            v-flex(xs12).text-xs-center
              Map(:scale="1.2")
      // Manager view
      v-flex(xs12 v-if="$hasRole(2)")
        .title.mb-2 МОИ БРОНИ
        UserBookings(:userId="$getUserId()")
        .title.mt-4.mb-2 МОИ ОТГРУЗКИ
        UserSales(:userId="$getUserId()")
</template>

<script>
export default {
  name: 'Analytics',
};
</script>
