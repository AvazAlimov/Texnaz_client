<template lang="pug">
    v-layout(justify-center row wrap)
      v-flex(xs12)
        .border.white.pa-4
          v-layout(row wrap align-center)
            v-flex(xs12).text-xs-center
              Map(:scale="1.2")
</template>

<script>
export default {
  name: 'Analytics',
};
</script>
