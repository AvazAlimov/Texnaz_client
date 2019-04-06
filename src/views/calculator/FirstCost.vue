<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'customs_expanses' }")
            v-icon arrow_back
        .title Учетная себестоимость
        v-spacer
        .title 5/6

        v-flex.mt-3(xs12)
          Info(:batch="batch" :step="5")
</template>

<script>
import Batch from '@/services/Batch';

export default {
  name: 'FirstCost',
  data() {
    return {
      batch: {
        expanses: [],
        items: [],
      },
      items: [],
    };
  },
  methods: {
    getAll() {
      Promise.all([
        Batch.get(this.$route.params.id),
      ]).then((results) => {
        [this.batch] = results;
        this.batch.items.forEach((item) => {
          this.items.push(item);
        });
      });
    },
  },
  created() {
    this.getAll();
  },
};
</script>
