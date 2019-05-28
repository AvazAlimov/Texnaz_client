<template lang="pug">
  div
    svg(:width="400 * 2 * scale" :height="260 * 2 * scale")
                g(:transform="`scale(${scale})`" alignment-baseline="center")
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
  name: 'Map',
  props: {
    scale: {
      require: true,
    },
  },
  data: () => ({
    title: null,
    map: uzbekistan,
  }),
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
    object-fit: fill;
}
</style>
