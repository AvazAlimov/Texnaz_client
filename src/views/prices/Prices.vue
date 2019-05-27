<template lang="pug">
    v-layout(row wrap)
        v-flex(xs12).mb-3
            v-layout(row align-center)
                .title.ml-1 ЦЕНЫ
                v-spacer
                v-btn.mx-0(
                    small
                    color="secondary" flat
                    :to="{name: 'priced'}"
                    v-if="$hasPermission($permissions.SHOW_PRICES_PRICED.name)"
                ) Продукты с ценами
                    v-icon.ml-2(small) check
                v-btn.mx-0(
                    small
                    color="secondary" flat
                    :to="{name: 'unpriced'}"
                    v-if="$hasPermission($permissions.SHOW_PRICES_UNPRICED.name)"
                ) Продукты без цен
                    v-icon.ml-2(small) close
        v-flex(xs12)
            router-view
</template>

<script>
export default {
  name: 'Prices',
};
</script>
