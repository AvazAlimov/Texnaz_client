<template lang="pug">
    v-layout(row wrap)
      v-flex(xs12)
        .title.mb-2 МОИ БРОНИ
        UserBookings(:userId="$route.params.id")
      v-flex(xs12)
        .title.mt-4.mb-2 МОИ ОТГРУЗКИ
        UserSales(:userId="$route.params.id")
</template>

<script>
export default {
  name: 'Manager',
};
</script>
