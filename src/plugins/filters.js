import Vue from 'vue';

Vue.filter('roundUp', (value) => {
  const precision = 10 ** 2;
  return Math.ceil(value.toFixed(4) * precision) / precision;
});

Vue.filter('ceil', value => Math.ceil(value / 100) * 100);