<template lang="pug">
    v-card().mt-4
        v-container(fluid fill-height)
            v-layout(row wrap width=264 align-center justify-center).my-4
                v-flex(xs12)
                    .title.text-md-center.grey--text.text--darken-2 {{ title }}
                    .title.mt-4.grey--text.text--darken-2.text-md-center
                        | Umumiy
                        span.display-1.grey--text.text--darken-2 {{ umumiy | readable }}
                    .title.mt-3.grey--text.text--darken-2.text-md-center
                        | Oy
                        span.headline.grey--text.text--darken-2 {{ oy | readable }}

</template>

<script>
export default {
    props: ['title', 'umumiy', 'oy'],
    filters:{
        readable: value => `  $${Number(value).toLocaleString().replace(',',' ')}`
    }
}
</script>

<style scoped>
</style>
