<template lang="pug">
    v-app
        v-content
            v-container(fill-height text-xs-center)
                v-layout(align-center justify-center)
                    v-flex(xs12).width-300
                        v-img.my-3(:src="require('../assets/logo.svg')" contain height="96")
                        .headline.font-weight-bold DIGMAN
                        .sub-heading.font-weight-light Это больше, чем просто управление
                        v-text-field(v-model="username" label="имя пользователя"
                          @keyup.enter="login")
                        v-text-field(v-model="password" type="password" label="пароль пользователя"
                          @keyup.enter="login")
                        v-btn(outline block @click="login") войти
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      error: '',
    };
  },
  methods: {
    login() {
      this.$store.dispatch('login', {
        username: this.username,
        password: this.password,
      }).then(() => this.$router.push('/')).catch((error) => { this.error = error; });
    },
  },
};
</script>

<style scoped>
    .width-300 {
        max-width: 300px;
    }
</style>
