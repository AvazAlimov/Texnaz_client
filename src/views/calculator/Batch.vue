<template lang="pug">
    v-layout(row wrap)
        v-flex(xs12)
            v-stepper(v-model="step" color="primary").border
                v-stepper-header.elevation-0
                    v-stepper-step(step="1" :complete="step > 1")
                    v-divider
                    v-stepper-step(step="2" :complete="step > 2")
                    v-divider
                    v-stepper-step(step="3" :complete="step > 3")
                    v-divider
                    v-stepper-step(step="4" :complete="step > 4")
                    v-divider
                    v-stepper-step(step="5" :complete="step > 5")
                v-stepper-items
                    v-stepper-content(step="1")
                        StepOne
                        v-layout
                            v-spacer
                            v-btn(@click="step=2" flat).mx-0 Утвердить
                    v-stepper-content(step="2")
                        Steptwo
                        v-layout
                            v-spacer
                            v-btn(@click="step=3" flat).mx-0 Утвердить
                    v-stepper-content(step="3")
                        v-btn(@click="step=4" flat) next
                    v-stepper-content(step="4")
                        v-btn(@click="step=5" flat) next
                    v-stepper-content(step="5")
                        v-btn(@click="step=6" flat) next
</template>

<script>
export default {
  name: 'Batch',
  data() {
    return {
      step: 0,
    };
  },
};
</script>

<style scoped>
    .border {
        box-shadow: none
    }
</style>
