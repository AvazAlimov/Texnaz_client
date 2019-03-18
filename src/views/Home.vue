<template lang="pug">
  v-app
    v-navigation-drawer(app permanent)
      v-toolbar.transparent(flat)
        v-list.pa-0
          v-list-tile(avatar)
            v-list-tile-avatar
              img(:src="require('../assets/logo.svg')")
            v-list-tile-content
              v-list-tile-title DIGMAN
      v-list.pt-0(dense)
        v-divider
        v-list-tile(to="/")
          v-list-tile-action
            v-icon cloud
          v-list-tile-content
            v-list-tile-title База данных
        v-list-tile(to="/")
          v-list-tile-action
            v-icon exposure
          v-list-tile-content
            v-list-tile-title Калькулятор
    v-toolbar.white.elevation-0.toolbar__border(app)
      v-spacer
      v-spacer
      v-menu(offset-y left close-on-click)
        template(v-slot:activator="{ on }")
          v-btn(icon v-on="on")
            v-icon(color="primary") perm_identity
        v-list
          v-list-tile
            v-list-tile-action
              v-icon supervisor_account
            v-list-tile-content
              v-list-tile-title Менеджер
          v-list-tile(to="/login")
            v-list-tile-action
              v-icon exit_to_app
            v-list-tile-content
              v-list-tile-title Выйти
    v-content
      v-container(grid-list-md)
        router-view
</template>

<script>
export default {
  name: 'Home',
};
</script>
<style scoped>
  .toolbar__border {
     border-bottom: 1px solid rgba(0,0,0,0.12) !important;
  }
  .v-list-tile-height {
    min-height: 120px;
  }
</style>
