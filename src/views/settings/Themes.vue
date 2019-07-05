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
  name: "Themes",
  data() {
    return {
      themes: [
        {
          title: "По умолчанию",
          primary: "#FFFFFF",
          secondary: "#424242",
          accent: "#82B1FF",
          dashboardPrimary: "#2B2B38",
          dashboardSecondary: "#00A4EB",
          dashboardTertiary: "#FFF",
          dashboardBorder: "#3E3E4D"
        },
        {
          title: "Золотой",
          primary: "#FFDE03",
          secondary: "#424242",
          accent: "#82B1FF",
          dashboardPrimary: "#2B2B38",
          dashboardSecondary: "#00A4EB",
          dashboardTertiary: "#FFF",
          dashboardBorder: "#3E3E4D"
        },
        {
          title: "Храм розовый",
          primary: "#FEDBD0",
          secondary: "#442C2E",
          accent: "#82B1FF",
          dashboardPrimary: "#2B2B38",
          dashboardSecondary: "#00A4EB",
          dashboardTertiary: "#FFF",
          dashboardBorder: "#3E3E4D"
        },
        {
          title: "Чирок",
          primary: "#03DAC5",
          secondary: "#424242",
          accent: "#FD5523",
          dashboardPrimary: "#2B2B38",
          dashboardSecondary: "#00A4EB",
          dashboardTertiary: "#FFF",
          dashboardBorder: "#3E3E4D"
        },
        {
          title: "Зелень",
          primary: "#37966F",
          secondary: "#000000",
          accent: "#FD5523",
          dashboardPrimary: "#2B2B38",
          dashboardSecondary: "#00A4EB",
          dashboardTertiary: "#FFF",
          dashboardBorder: "#3E3E4D"
        },
        {
          title: "Базилик грин",
          primary: "#FFFBE6",
          secondary: "#356859",
          accent: "#FD5523"
        },
        {
          title: "Серый",
          primary: "#BDBDBD",
          secondary: "#707070",
          accent: "#FFFFFF",
          dashboardPrimary: "#2B2B38",
          dashboardSecondary: "#00A4EB",
          dashboardTertiary: "#FFF",
          dashboardBorder: "#3E3E4D"
        },
        {
          title: "Ночной режим",
          primary: "#343445",
          secondary: "#424242",
          accent: "#00A3EA",
          dashboardPrimary: "#2B2B38",
          dashboardSecondary: "#00A4EB",
          dashboardTertiary: "#FFF",
          dashboardBorder: "#3E3E4D"
        }
      ]
    };
  },
  methods: {
    apply(theme) {
      Object.keys(theme).forEach((name) => {
        localStorage.setItem(name, theme[name]);
      });
      window.location.reload();
    }
  }
};
</script>
<style scoped>
.fill {
  min-width: 100px;
  height: 20px;
}
</style>
