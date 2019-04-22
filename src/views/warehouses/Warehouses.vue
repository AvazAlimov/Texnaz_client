<template lang="pug">
  div
    v-layout(row wrap v-if="path == 'warehouses'")
        v-flex(xs12).mb-3
            .title СКЛАДЫ
        v-flex(xs4 v-for="(warehouse, index) in warehouses" :key="index")
            v-list.pa-0.border(three-line)
                v-list-tile(:to="{ name: 'warehouse', params: { id: warehouse.id }}")
                    v-list-tile-content
                        v-list-tile-title {{ warehouse.name }}
                        v-list-tile-sub-title.text--primary {{ warehouse.company }}
                        v-list-tile-sub-title {{ warehouse.owner.name }}
                    v-list-tile-action
                    v-icon(large) store_mall_directory
        v-flex(xs4)
          v-list.pa-0.border(three-line)
                v-list-tile(:to="{ name: 'template_warehouse' }")
                    v-list-tile-content
                        v-list-tile-title Добавить
                        v-list-tile-sub-title.text--primary Новый склад
                    v-list-tile-action
                    v-icon(large) add
    router-view
</template>

<script>
import Warehouse from '@/services/Warehouse';
import Info from '@/services/Info';

export default {
  name: 'Warehouses',
  data() {
    return {
      types: [],
      warehouses: [],
      loading: false,
    };
  },
  computed: {
    path() {
      return this.$route.name;
    },
  },
  methods: {
    getAll() {
      this.loading = true;
      this.warehouses = [];
      Promise.all([
        Warehouse.getAll(),
        Info.getWarehouseTypes(),
      ])
        .then((reslut) => {
          [this.warehouses, this.types] = reslut;
        })
        .finally(() => { this.loading = false; });
    },
    getTypeName(id) {
      return (this.types.find(item => id === item.id) || { name: '-' }).name;
    },
  },
  created() {
    this.getAll();
  },
};
</script>

<style>

</style>
