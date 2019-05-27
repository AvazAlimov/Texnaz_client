<template lang="pug">
    v-layout(row wrap)
      v-flex(xs12)
        UserBookings(:userId="$route.params.id")
</template>

<script>
export default {
  name: 'Manager',
};
</script>
