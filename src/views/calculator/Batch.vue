<template lang="pug">
  v-stepper.border(v-model="step" non-linear)
    v-stepper-header
      v-stepper-step(step="1" editable @click="changeStep({ name: 'batch_info' })") Утверждение
      v-divider.mx-0
      v-stepper-step(step="2" editable @click="changeStep({ name: 'selection' })") Выборка
      v-divider.mx-0
      v-stepper-step(step="3" editable @click="changeStep({ name: 'customs_expanses' })")
        | Расходы по растаможке
      v-divider.mx-0
      v-stepper-step(step="4" editable @click="changeStep({ name: 'price' })") Прайс
    v-divider
    v-stepper-items
      router-view
</template>

<script>
export default {
  name: 'Batch',
  data() {
    return {
      step: 0,
    };
  },
  methods: {
    changeStep(to) {
      this.$router.push(to);
    },
  },
  created() {
    switch (this.$route.name) {
      case 'batch_info':
        this.step = 1;
        break;
      case 'selection':
        this.step = 2;
        break;
      case 'customs_expanses':
        this.step = 3;
        break;
      case 'price':
        this.step = 4;
        break;
      default:
        this.step = 0;
        break;
    }
  },
};
</script>
<style scoped>
.v-stepper,
.v-stepper__header {
    box-shadow: none;
}
</style>
