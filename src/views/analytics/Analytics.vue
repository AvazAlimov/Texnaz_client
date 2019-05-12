<template lang="pug">
    v-layout(justify-center row wrap)
        svg(xmlns:mapsvg="http://mapsvg.com"
            xmlns:dc="http://purl.org/dc/elements/1.1/"
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            xmlns:svg="http://www.w3.org/2000/svg"
            xmlns="http://www.w3.org/2000/svg"
            mapsvg:geoViewBox="55.997099 45.594337 73.133286 37.176101"
            width="792.4873"
            height="516.87848"
        )
            path.region(v-for="region in map"
                :d="region.d"
                :title="region.title"
                :id="region.id"
                fill="#424242"
                stroke="#FFFFFF"
                stroke-width="1"
                @mouseover="show(region.title, $event)"
                @mouseleave="title=null"
            )
        .tooltip.white.border.pa-2(ref="tooltip" v-show="title") {{ title }}
</template>

<script>
import uzbekistan from '../../assets/uzbekistan.json';

export default {
  name: 'Analytics',
  data() {
    return {
      title: null,
      map: uzbekistan,
    };
  },
  methods: {
    show(title, event) {
      const { tooltip } = this.$refs;
      tooltip.style.left = `${event.layerX}px`;
      tooltip.style.top = `${event.layerY}px`;
      this.title = title;
    },
  },
};
</script>

<style>
.region:hover {
  fill: #707070;
  z-index: 10;
}
.tooltip {
    position: absolute;
}
</style>
