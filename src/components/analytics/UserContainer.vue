<template lang="pug">
        v-card(elevation="5").ma-2
            span(v-if="duration").subtitle.grey--text {{ duration }}
            v-card-text
                v-layout(row align-center)
                    v-icon(:class="`color-${color}`").ma-1.pa-2 {{ icon }}
                    div.ml-2
                        .title.blue--text {{ quantity }}
                        .subtitle.grey--text {{ title }}
</template>

<script>
export default {
  props: ["icon", "title", "quantity", "color", "duration"]
};
</script>

<style scoped>
.v-card {
  border-radius: 8%;
}

.color-blue {
  background: #d5d1fb;
  border-radius: 50%;
  padding: 10%;
  color: #7e72f2;
  font-size: 30px;
}

.color-green {
  background: #d1fbde;
  border-radius: 50%;
  padding: 10%;
  color: #8ff272;
  font-size: 30px;
}
span {
  float: right;
  margin-right: 16px;
  margin-top: 5px;
}
</style>
