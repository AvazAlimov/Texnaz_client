import Vue from 'vue';
import VeeValidate, { Validator } from 'vee-validate';
import ru from '../translations/ru';

Vue.use(VeeValidate);
Validator.localize('ru', ru);
Validator.extend('phone', {
  message: {
    // (field, value)
    en: () => 'Must be valied phone number',
  },
  // (value, field)
  validate: value => value.length > 5 && /\+998([0-9]{2})([0-9]{7})/.test(value),
});
