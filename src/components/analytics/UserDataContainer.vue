<template lang="pug">
    v-card(elevation="5").mx-2.mb-4
      v-card-text.pa-0
        .px-4.pt-4
          v-icon().color-blue {{ icon }}
          .title.darkgrey--text.mt-2 {{ heading }}
          .font-weight-bold.darkgrey--text {{ subheading }}
        v-sparkline.line( 
          :fill="fill"
          :gradient="gradient"
          :smooth="radius || false"
          :value="value"
          padding="0"
          auto-draw)
</template>

<script>
/**
 * Expected Model
 * {
 *  icon:'icon name'
 * }
 */
export default {
  props: ["icon", "heading", "subheading","value","color"],
  data() {
    return{
      fill: true,
      radius: 10,
    }
  },
  computed:{
    gradient:function(){
      return [this.color,'#FFF']
    }
  }
};
</script>

<style scoped>
.v-card{
  overflow: hidden;
  border-radius: 8%;
}
.color-blue {
  background: #d5d1fb;
  border-radius: 50%;
  padding: 5%;
  color: #7e72f2;
  font-size: 30px;
}
.line {
  margin-bottom: -6px;
}
</style>
