<template lang="pug">
  div
    v-layout(row wrap v-if="path == 'warehouses'")
        v-flex(xs12).mb-3
            .title СКЛАДЫ
        v-flex(xs4 v-for="(warehouse, index) in warehouses" :key="index")
          Card(
            :title="`${warehouse.name} ${warehouse.company}`"
            :subtitle="`Владелец: ${warehouse.owner.name}`"
            :caption="`Сумма товаров: ${warehouse.totalPrice.toFixed(0)} $`"
            icon="store_mall_directory"
            :to="{ name: 'warehouse', params: { id: warehouse.id }}"
          )
        v-flex(xs4 v-if="$hasRole(1)")
          Card(
            title="Добавить"
            subtitle="Новый склад"
            icon="add"
            :to="{ name: 'template_warehouse' }"
          )
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
