<template lang="pug">
    v-layout(wrap).white.pa-2
        v-flex(xs12)
            v-layout(row align-center justify-space-between)
                v-btn(
                    block
                    outline
                    :color="index === 0 ? '' : 'grey'"
                    @click="clickHandler(0)"
                ).ma-2 Late debt
                v-divider
                v-btn(
                    block
                    outline
                    :color="index === 1 ? '' : 'grey'"
                    @click="clickHandler(1)"
                ).ma-2 Total
                v-divider
                v-btn(
                    block
                    outline
                    :color="index === 2 ? '' : 'grey'"
                    @click="clickHandler(2)"
                ).ma-2 Gauss
                v-divider
                v-btn(
                    block
                    outline
                    :color="index === 3 ? '' : 'grey'"
                    @click="clickHandler(3)"
                ).ma-2 Many
                v-divider
                v-btn(
                    block
                    outline
                    :color="index === 4 ? '' : 'grey'"
                    @click="clickHandler(4)"
                ).ma-2 Incomes
        v-flex(xs12)
          TotalStatistics(v-if="index === 1").mt-3
        v-flex(xs12)
          GaussStatistics(v-if="index===2").mt-3
        v-flex(xs12)
          ManyStatistics(v-if="index === 3").mt-3
        v-flex(xs12)
          IncomeStatistics(v-if="index === 4").mt-3
</template>
<script>
export default {
  data() {
    return {
      index: 0,
    };
  },
  methods: {
    clickHandler(index) {
      this.index = index;
    },
  },
};
</script>
