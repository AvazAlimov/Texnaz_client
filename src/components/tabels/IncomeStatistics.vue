<template lang="pug">
    v-layout(wrap)
        v-flex(xs12)
            v-layout(align-center justify-space-betweeb)
                v-select(
                    name="regions"
                    v-model="province"
                    :items="provinces"
                    item-text="name"
                    item-value="id"
                ).ma-2
                v-select(
                    name="brands"
                    v-model="brand"
                    :items="brands"
                    item-text="name"
                    item-value="id"
                    clearable
                    multiple
                ).ma-2
                v-menu(
                  v-model="startMenu"
                  :close-on-content-click="false"
                  full-width
                  min-width="290px"
                ).ma-2
                  template(v-slot:activator="{ on }")
                    v-text-field(
                      readonly
                      v-on="on"
                      v-model="startDate"
                      label="От"
                    )
                  v-date-picker(
                    v-model="startDate"
                    @input="startMenu = false"
                    :max="maximum"
                  )
                v-menu(
                  v-model="endMenu"
                  :close-on-content-click="false"
                  full-width
                  min-width="290px"
                ).ma-2
                  template(v-slot:activator="{ on }")
                    v-text-field(
                      readonly
                      v-on="on"
                      v-model="endDate"
                      label="До"
                    )
                  v-date-picker(
                    v-model="endDate"
                    @input="endMenu = false"
                    :max="maximum"
                  )
                v-btn(icon @click="getItems()").secondary--text
                    v-icon table_chart
        v-flex(xs12)
            v-data-table(
                :headers="headers"
            )
</template>
<script>
import Province from '@/services/Province';
import Brand from '@/services/Brand';

export default {
  data() {
    return {
      maximum: (new Date()).toISOString().substring(0, 10),
      startDate: (new Date()).toISOString().substring(0, 10),
      endDate: (new Date()).toISOString().substring(0, 10),
      startMenu: false,
      endMenu: false,
      province: 0,
      provinces: [],
      brand: [0],
      brands: [],
      headers: [
        {
          text: 'Province',
          value: 'province',
        },
        {
          text: 'CEO',
          value: 'ceo',
        },
        {
          text: 'numSupervisors',
          value: 'numSupervisors',
        },
        {
          text: 'numManagers',
          value: 'numManagers',
        },
        {
          text: 'numClients',
          value: 'numClients',
        },
        {
          text: 'numActivesClients',
          value: 'numActiveClients',
        },
        {
          text: 'totalAmount',
          value: 'totalAmount',
        },
      ],
    };
  },
  methods: {
    sort(array) {
      array.push({
        id: 0,
        name: 'All',
      });
      array.sort((a, b) => (a > b ? 1 : -1));
    },
    getAll() {
      Promise.all([
        Province.getAll(),
        Brand.getAll(),
      ]).then((result) => {
        [this.provinces, this.brands] = result;
        this.sort(this.provinces);
        this.sort(this.brands);
      });
    },
  },
  created() {
    this.getAll();
  },
};
</script>
