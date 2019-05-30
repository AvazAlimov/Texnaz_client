<template lang="pug">
    .white.border
        v-layout(row wrap align-center)
            v-flex(xs12)
                v-data-table(
                    hide-actions
                    :headers="headers"
                    :items="items"
                    :loading="loading"
                )
                    template(v-slot:items="props")
                        td {{ props.index + 1 }}
                        td
                            v-text-field(
                                color="secondary"
                                v-model="props.item.name"
                                :name="props.item.id"
                                v-validate="'required'"
                            )
                        td
                            v-layout
                                v-btn(
                                    icon
                                    :disabled="!!errors.first(`${props.item.id}`)"
                                    @click="update(props.item)"
                                ).mx-0
                                    v-icon(
                                        color="secondary"
                                        small
                                    ) save
                                v-btn(
                                    icon
                                    @click="remove(props.item.id)"
                                ).mx-0
                                    v-icon(
                                        color="red"
                                        small
                                    ) delete
                v-divider
            v-flex(expand)
                v-text-field.ml-4(
                    color="secondary"
                    label="Наименование"
                    v-model="name"
                    name="Наименование"
                    v-validate="'required'"
                )
            v-flex(shrink)
                v-btn(
                    flat
                    color="secondary"
                    @click="create()"
                    :disabled="!!errors.first('Наименование')"
                ) Добавить
</template>

<script>
export default {
  name: 'ExpenseProperty',
  props: {
    data: {
      required: true,
    },
  },
  data: () => ({
    loading: false,
    name: '',
    items: [],
    headers: [
      {
        text: '#',
        value: 'index',
        sortable: false,
        width: 1,
      },
      {
        text: 'Наименование',
        value: 'name',
      },
      {
        sortable: false,
        width: 1,
      }],
  }),
  methods: {
    getAll() {
      this.loading = true;
      this.data.getAll()
        .then((items) => {
          this.items = items;
          new Promise(resolve => setTimeout(resolve, 100)).then(() => {
            this.$validator.validate();
          });
        })
        .catch(error => this.$store.commit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
    create() {
      this.loading = true;
      this.data.create(this.name)
        .then(() => { this.name = ''; })
        .catch(error => this.$store.commit('setMessage', error.message))
        .finally(() => { this.getAll(); });
    },
    update(item) {
      this.data.update(item.id, item.name)
        .then(() => this.$store.commit('setMessage', 'Успешно обновлено'))
        .catch(error => this.$store.commit('setMessage', error.message))
        .finally(() => { this.getAll(); });
    },
    remove(id) {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (confirm('Это действие удалит элемент навсегда, вы уверены?')) {
        this.data.remove(id)
          .then(() => { this.getAll(); })
          .catch(error => this.$store.commit('setMessage', error.message));
      }
    },
  },
  created() {
    this.getAll();
  },
};
</script>
