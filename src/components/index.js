import Vue from 'vue';
import StepOne from './StepOne.vue';
import StepTwo from './StepTwo.vue';

const Components = {
  StepOne,
  StepTwo,
};

Object.keys(Components).forEach((name) => {
  Vue.component(name, Components[name]);
});

export default Components;
