<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'settings' }")
            v-icon arrow_back
        .title КОНФИГУРАЦИИ
        v-flex(xs12).mt-3
            .border.white
                v-data-table(:headers="headers" :items="configurations" hide-actions
                  :loading="loading")
                    template(v-slot:items="props")
                        td {{ props.item.id }}
                        td {{ props.item.name }}
                        td
                          v-text-field(v-model="props.item.value").ma-0
                        td
                            v-layout
                                v-btn(icon @click="update(props.item.id, props.item.value)").mx-0
                                    v-icon(color="primary" small) save
</template>

<script>
import Configuration from '@/services/Configuration';

export default {
  name: 'Configurations',
  data() {
    return {
      headers: [
        {
          text: '#',
          value: 'id',
          sortable: false,
          width: 100,
        },
        {
          text: 'Название',
          value: 'name',
        },
        {
          text: 'Значение',
          value: 'value',
          width: 200,
        },
        {
          sortable: false,
          width: 100,
        },
      ],
      configurations: [],
      loading: false,
    };
  },
  methods: {
    getAll() {
      this.loading = true;
      this.configurations = [];
      Configuration.getAll()
        .then((configurations) => { this.configurations = configurations; })
        .catch(() => this.getAll())
        .finally(() => { this.loading = false; });
    },
    update(id, value) {
      Configuration.update(id, value).then(() => {
        this.$store.commit('setMessage', 'Updated');
      }).catch((error) => {
        this.$store.commit('setMessage', error.message);
      });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

<style scoped>
</style>
