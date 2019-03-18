<template lang="pug">
    v-app
        v-content
            v-container(fill-height text-xs-center)
                v-layout(align-center justify-center)
                    v-flex(xs12).width-300
                        v-img.my-3(:src="require('../assets/logo.svg')" contain height="96")
                        .headline.font-weight-bold DIGMAN
                        .sub-heading.font-weight-light Это больше, чем просто управление
                        v-text-field(label="имя пользователя")
                        v-text-field(type="password" label="пароль пользователя")
                        v-btn(outline block) войти
</template>

<script>
export default {
  name: 'Login',
};
</script>

<style scoped>
    .width-300 {
        max-width: 300px;
    }
</style>
