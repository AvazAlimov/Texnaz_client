<template lang="pug">
    v-layout
        v-flex(xs12)
            v-data-table(
                :loading="loading"
                :headers="headers"
                :items="items"
                hide-actions
            )
                template(v-slot:items="props")
                  tr(@click="() => { props.expanded = !props.expanded }"
                    v-if="props.item.id!==0").grey.lighten-4
                    td
                      v-icon {{ props.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
                    td {{ props.item.territory }}
                    td {{ props.item.province }}
                    td {{ getPrice(0, 30, props.item) | roundUp | readable}}
                    td {{ getPrice(30, 60, props.item) | roundUp | readable}}
                    td {{ getPrice(60, 90, props.item) | roundUp | readable}}
                    td {{ getPrice(90, 180, props.item) | roundUp | readable}}
                    td {{ getPrice(180, -1, props.item) | roundUp | readable}}
                template(v-slot:expand="props")
                    v-data-table(
                      :headers="expandedHeaders"
                      :items="props.item.expandedItems"
                      hide-actions
                    )
                      template(v-slot:items="lates")
                        tr(@click="() => { lates.expanded = !lates.expanded }").teal.lighten-5
                          td {{ lates.item.name }}
                          td {{ getPrice(0, 30,   lates.item) | roundUp | readable}}
                          td {{ getPrice(30, 60,  lates.item) | roundUp | readable}}
                          td {{ getPrice(60, 90,  lates.item) | roundUp | readable}}
                          td {{ getPrice(90, 180, lates.item) | roundUp | readable}}
                          td {{ getPrice(180, -1, lates.item) | roundUp | readable}}
                      template(v-slot:expand="{ item }")
                          v-data-table(
                            :headers="expandedHeaders"
                            :items="item.expandedUsers"
                            hide-actions
                          )
                            template(v-slot:items="client")
                              tr.green.lighten-5
                                td {{ client.item.name }}
                                td {{ getPrice(0, 30,   client.item) | roundUp | readable}}
                                td {{ getPrice(30, 60,  client.item) | roundUp | readable}}
                                td {{ getPrice(60, 90,  client.item) | roundUp | readable}}
                                td {{ getPrice(90, 180, client.item) | roundUp | readable}}
                                td {{ getPrice(180, -1, client.item) | roundUp | readable}}

</template>
<script>
export default {
  props: {
    getPrice: {
      type: Function,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
    expandedHeaders: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
