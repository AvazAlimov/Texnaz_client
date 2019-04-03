<template lang="pug">
    .border.white
            .title.ma-4 {{ title }}
            v-data-table(:headers="headers" :items="expanses" :loading="loading" hide-actions)
                template(v-slot:items="props")
                        td {{ props.index + 1 }}
                        td
                            v-text-field(v-model="props.item.name")
                        td
                            v-text-field(v-model="props.item.value")
                        td
                            v-btn.mx-0(icon @click="remove(props.index)")
                                v-icon(color="primary" small) close
            v-divider
            v-btn.ma-0(block flat @click="add") Добавить
            v-divider
            .ma-4
                .subheading Всего: {{ sum }}
                .subheading Коэффициент:
                    strong  {{ (sum / total) * 100 > 2 ? ((sum / total) * 100).toFixed(2) : 2}}%
</template>

<script>
import BatchExpanse from '@/services/BatchExpanse';

export default {
  name: 'BatchExpanses',
  props: {
    title: {
      required: true,
    },
    total: {
      required: true,
    },
    is_transport: {
      type: Boolean,
      required: true,
    },
    is_cash: {
      type: Boolean,
      required: true,
    },
    batchId: {
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      headers: [
        {
          text: '#',
          value: 'id',
          sortable: false,
        },
        {
          text: 'Название',
          value: 'name',
          sortable: false,
        },
        {
          text: 'Значение',
          value: 'value',
          sortable: false,
        },
        {
          sortable: false,
          width: 50,
        },
      ],
      expanses: [],
    };
  },
  computed: {
    sum() {
      let sum = 0;
      this.expanses.forEach((expanse) => { sum += parseFloat(expanse.value); });
      return sum;
    },
  },
  methods: {
    getAll() {
      this.loading = true;
      this.expanses = [];
      BatchExpanse.getAll(this.batchId)
        .then((expanses) => {
          this.expanses = expanses
            .filter(expanse => expanse.is_transport === this.is_transport
                && expanse.is_cash === this.is_cash);
        })
        .finally(() => { this.loading = false; });
    },
    add() {
      this.expanses.push({
        name: '',
        value: 0,
        is_transport: this.is_transport,
        is_cash: this.is_cash,
        batchId: parseInt(this.batchId, 10),
      });
    },
    remove(index) {
      this.expanses.splice(index, 1);
    },
  },
  watch: {
    expanses(value) {
      this.$emit('input', value);
    },
  },
  created() {
    this.getAll();
  },
};
</script>

<style scoped>

</style>
