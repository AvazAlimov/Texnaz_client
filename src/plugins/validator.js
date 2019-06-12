import Vue from 'vue';
import VeeValidate, { Validator } from 'vee-validate';
import ru from '../translations/ru';

Vue.use(VeeValidate);
Validator.localize('ru', ru);
