<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'settings' }").tertiary--text
            v-icon arrow_back
        .title.tertiary--text Темы
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
          title: 'Зажигалка с высокой контрастностью',
          primary: '#EFF3F4',
          secondary: '#424242',
          accent: '#7A776D',
          tertiary: '#333333',
          dashboardCard: '#FAFAFA',
          dashboardPrimary: '#FFFFFF',
          dashboardSecondary: '#90A4AE',
          dashboardTertiary: '#90A4AE',
          dashboardBorder: '#C0C8CD',
        },
        {
          title: 'Чистый свет',
          primary: '#DCDCDC',
          secondary: '#424242',
          accent: '#7A776D',
          tertiary: '#333333',
          dashboardCard: '#DCDCDC',
          dashboardPrimary: '#E4E6F1',
          dashboardSecondary: '#AAD2EE',
          dashboardTertiary: '#333333',
          dashboardBorder: '#B4B0AA',
        },
        {
          title: 'Солнечный свет',
          primary: '#EEE8D5',
          secondary: '#424242',
          accent: '#7A776D',
          tertiary: '#333333',
          dashboardCard: '#EEE8D5',
          dashboardPrimary: '#D9D2C2',
          dashboardSecondary: '#828282',
          dashboardTertiary: '#333333',
          dashboardBorder: '#FDF6E3',
        },
        {
          title: 'Монокай потускнел',
          primary: '#505050',
          secondary: '#424242',
          accent: '#519BDF',
          tertiary: '#FFF',
          dashboardCard: '#505050',
          dashboardPrimary: '#303030',
          dashboardSecondary: '#C5C5C5',
          dashboardTertiary: '#FFF',
          dashboardBorder: '#3E3E4D',
        },
        {
          title: 'Высокий контраст',
          primary: '#263238',
          secondary: '#424242',
          accent: '#519BDF',
          tertiary: '#FFF',
          dashboardCard: '#263238',
          dashboardPrimary: '#192227',
          dashboardSecondary: '#80CBC4',
          dashboardTertiary: '#FFF',
          dashboardBorder: '#3E3E4D',
        },
        {
          title: 'Tемно',
          primary: '#212121',
          secondary: '#424242',
          accent: '#519BDF',
          tertiary: '#FFF',
          dashboardCard: '#212121',
          dashboardPrimary: '#171717',
          dashboardSecondary: '#0B4E8D',
          dashboardTertiary: '#FFF',
          dashboardBorder: '#3E3E4D',
        },
        {
          title: 'Tемно-синий',
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
