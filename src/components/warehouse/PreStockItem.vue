<template lang="pug">
    tr
        td {{ index + 1 }}
        td {{ item.product.Brand.name }} {{ item.product.name }}
        td {{ item.quantity }}
        td
            v-layout(row align-center)
                v-text-field(
                    v-model="item.arrived"
                    color="secondary"
                )
                //- v-btn(
                //-     icon small
                //-     @click="item.arrived = item.quantity"
                //- )
                //-     v-icon(small
                //-         :color="item.arrived == item.quantity ? 'green' : ''"
                //-     ) check
        td
            v-dialog(
            v-model="item.arrival_date_modal"
            full-width
            width="290px"
            )
                template(v-slot:activator="{ on }")
                    v-text-field(
                    v-model="item.arrival_date"
                    readonly
                    v-on="on"
                    )
                v-date-picker(
                    v-model="item.arrival_date"
                    no-title
                    @input="item.arrival_date_modal = false"
                    color="secondary"
                )
        td
            v-dialog(
            v-model="item.expiry_date_modal"
            full-width
            width="290px"
            )
                template(v-slot:activator="{ on }")
                    v-text-field(
                    v-model="item.expiry_date"
                    readonly
                    v-on="on"
                    )
                v-date-picker(
                    v-model="item.expiry_date"
                    no-title
                    @input="item.expiry_date_modal = false"
                    color="secondary"
                )
        td
            v-checkbox.mt-3(
            v-model="item.defected"
            color="secondary")
</template>

<script>
export default {
  name: 'PreStockItem',
  props: {
    index: {
      type: Number,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
  created() {
    this.item.arrived = 0;
    this.item.defected = false;
    this.item.arrival_date = new Date().toISOString().substr(0, 10);
    this.item.expiry_date = new Date().toISOString().substr(0, 10);
  },
};
</script>
