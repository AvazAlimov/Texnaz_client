<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'settings' }")
            v-icon arrow_back
        .title Темы
        v-flex(xs12).mt-3
        v-flex(xs4 v-for="(theme, index) in themes" :key="index")
            v-list.pa-0.border(two-line)
                v-list-tile(@click="apply(theme)")
                    v-list-tile-content
                        v-list-tile-title {{ theme.title }}
                        v-list-tile-sub-title
                    v-list-tile-action
                        .fill(:style="{'background-color': theme.primary}")
                        .fill(:style="{'background-color': theme.secondary}")
                        .fill(:style="{'background-color': theme.accent}")
</template>

<script>
export default {
  name: 'Themes',
  data() {
    return {
      themes: [
        {
          title: 'Базилик грин',
          primary: '#7F886B',
          secondary: '#636363',
          accent: '#74583C',
          tertiary: '#FFF',
          dashboardCard: '#F3ECDA',
          dashboardPrimary: '#3E4F3C',
          dashboardSecondary: '#3E4F3C',
          dashboardTertiary: '#000',
          dashboardBorder: '#7F886B',
        },
        {
          title: 'Серый',
          primary: '#BDBDBD',
          secondary: '#636363',
          accent: '#000',
          tertiary: '#000',
          dashboardCard: '#FFFFFF',
          dashboardPrimary: '#FAFAFA',
          dashboardSecondary: '#BDBDBD',
          dashboardTertiary: '#000',
          dashboardBorder: '#E3E3E3',
        },
        {
          title: 'Ночной режим',
          primary: '#343445',
          secondary: '#424242',
          accent: '#00A3EA',
          tertiary: '#FFF',
          dashboardCard: '#343445',
          dashboardPrimary: '#2B2B38',
          dashboardSecondary: '#00A4EB',
          dashboardTertiary: '#FFF',
          dashboardBorder: '#3E3E4D',
        },
      ],
    };
  },
  methods: {
    apply(theme) {
      Object.keys(theme).forEach((name) => {
        localStorage.setItem(name, theme[name]);
      });
      window.location.reload();
    },
  },
};
</script>
<style scoped>
.fill {
  min-width: 100px;
  height: 20px;
}
</style>
