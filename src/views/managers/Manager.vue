<template lang="pug">
  div
    v-layout(row wrap v-if="$route.name == 'manager'")
      v-flex(xs12)
        UserBookings(:userId="$route.params.id")
      v-flex(xs12)
        UserSales(:userId="$route.params.id")
      v-flex(xs12)
        Motivations
    router-view
</template>

<script>
export default {
  name: 'Manager',
};
</script>
