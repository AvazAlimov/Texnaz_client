<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'settings' }")
            v-icon arrow_back
        .title ТЕГИ
        v-flex(xs12).mt-3
            .border.white
                v-data-table(:headers="headers" :items="tags" hide-actions :loading="loading")
                    template(v-slot:items="props")
                        td {{ props.item.name }}
                        td
                            v-layout
                                v-btn.mx-0(icon flat color="secondary"
                                  :to="{ name: 'tag', params: { id: props.item.id }}"
                                )
                                    v-icon(small) edit
                                v-btn(icon flat
                                  color="red" @click="remove(props.item.id)").mx-0
                                    v-icon(small) delete
                v-divider
                v-layout
                    v-spacer
                    v-btn.ma-0.mb-1.mr-1(flat color="secondary"
                      :to="{ name: 'tag' }"
                      ) Добавить
</template>

<script>
import Tag from '@/services/Tag';

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
