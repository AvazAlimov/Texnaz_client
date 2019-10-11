<template lang="pug">
    v-layout(wrap).white.pa-2
        v-flex(xs12)
            v-layout(row align-center justify-space-between)
                v-btn(
                    block
                    :outline="index !== 0"
                    :class="index === 0 ? 'primary' : ''"
                    @click="clickHandler(0)"
                ).ma-2 ПДЗ
                v-divider
                v-btn(
                    block
                    :outline="index !== 1"
                    :class="index === 1 ? 'primary' : ''"
                    @click="clickHandler(1)"
                ).ma-2 ТОТАЛ
                v-divider
                v-btn(
                    block
                    :outline="index !== 2"
                    :class="index === 2 ? 'primary' : ''"
                    @click="clickHandler(2)"
                ).ma-2 ГАУСС
                v-divider
                v-btn(
                    block
                    :outline="index !== 3"
                    :class="index === 3 ? 'primary' : ''"
                    @click="clickHandler(3)"
                ).ma-2 Поступления
                v-divider
                v-btn(
                    block
                    :outline="index !== 4"
                    :class="index === 4 ? 'primary' : ''"
                    @click="clickHandler(4)"
                ).ma-2 Выручка
        v-flex(xs12)
          LateDebtStatistics(v-if="index === 0").mt-3
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
