<template lang="pug">
    v-layout()
        v-select(
            v-model="province"
            :items="provinces"
            item-text="name"
            item-value="id"
            label="Region"
        ).ma-2
        v-select(
            v-model="brand"
            :items="brands"
            label="Brands"
            item-text="name"
            item-value="id"
            clearable
            multiple
        ).ma-2
        v-menu(
            v-model="startMenu"
            full-width
            min-width="290px"
            :close-on-content-click="false"
        ).ma-2
            template(v-slot:activator="{ on }")
                v-text-field(
                    readonly
                    v-model="startDate"
                    v-on="on"
                    label="From"
                )
            v-date-picker(
                v-model="startDate"
                @input="() => { startMenu = false }"

            )
        v-menu(
            v-model="endMenu"
            full-width
            min-width="290px"
            :close-on-content-click="false"
        ).ma-2
            template(v-slot:activator="{ on }")
                v-text-field(
                    readonly
                    v-model="endDate"
                    v-on="on"
                    label="To"
                )
            v-date-picker(
                v-model="endDate"
                @input="() => { endMenu = false }"

            )
</template>
<script>
import Province from '@/services/Province';
import Brand from '@/services/Brand';

export default {
  data: () => ({
    loading: false,
    province: {},
    provinces: [],
    brand: [],
    brands: [],
    startMenu: false,
    startDate: '',
    endMenu: false,
    endDate: '',
  }),
  methods: {
    getAll() {
      this.loading = true;
      Promise.all([
        Province.getAll(),
        Brand.getAll(),
      ]).then((result) => {
        [this.provinces, this.brands] = result;
      })
        .catch((error) => { this.$store.commit('setMessage', error.message); })
        .finally(() => { this.loading = false; });
    },
  },
  created() {
    this.getAll();
  },
};
</script>
