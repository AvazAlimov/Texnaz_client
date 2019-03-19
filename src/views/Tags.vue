<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon to="/")
            v-icon arrow_back
        .title ЕДИНИЦЫ ИЗМЕРЕНИЯ
        v-flex(xs12).mt-3
            .border.white
                v-data-table(:headers="headers" :items="tags" hide-actions :loading="loading")
                    template(v-slot:items="props")
                        td {{ props.item.name }}
                        td
                            v-layout
                                v-btn(icon :to="'/tag/' + props.item.id").mx-0
                                    v-icon(color="primary" small) edit
                                v-btn(icon @click="remove(props.item.id)").mx-0
                                    v-icon(color="primary" small) delete
                v-divider
                v-layout
                    v-spacer
                    v-btn.ma-2(flat color="primary" to="/tag") Добавить
</template>

<script>
import Tag from '../services/Tag';

export default {
  name: 'Tags',
  data() {
    return {
      headers: [
        {
          text: 'Название',
          value: 'name',
        },
        {
          sortable: false,
          width: 100,
        },
      ],
      tags: [],
      loading: false,
    };
  },
  methods: {
    getAll() {
      this.loading = true;
      this.tags = [];
      Tag.getAll()
        .then((tags) => { this.tags = tags; })
        .catch(() => this.getAll())
        .finally(() => { this.loading = false; });
    },
    remove(id) {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (confirm('Это действие удалит элемент навсегда, вы уверены?')) {
        Tag.delete(id)
          .then(() => { this.getAll(); })
          .catch((error) => {
            this.$store.commit('setMessage', error.message);
          });
      }
    },
  },
  created() {
    this.getAll();
  },
};
</script>

<style scoped>
</style>
