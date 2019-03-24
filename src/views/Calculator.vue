<template lang="pug">
    v-layout(row wrap )
        v-flex(xs12).mb-3
            .title КАЛЬКУЛЯТОР
            v-flex(xs12).mt-3
                .border.white
                    v-data-table(
                        :headers="headers"
                        :items="batches"
                        :loading="loading"
                        hide-actions)
                    v-divider
                    v-layout
                        v-spacer
                        v-btn.ma-2(flat color="primary" to="/batch") Добавить
</template>

<script>
export default {
  name: 'Calculator',
  data() {
    return {
      headers: [
        {
          text: 'Number',
          value: 'number',
        },
        {
          sortable: false,
          width: 100,
        },
      ],
      batches: [],
      loading: false,
    };
  },
};
</script>

<style script>

</style>
