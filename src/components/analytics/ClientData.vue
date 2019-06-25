<template lang="pug">
    v-card(elevation="0").border
        v-card-text
            .title.grey--text.text--darken-2 {{ title }}
            v-layout(row wrap)
                v-flex(xs8)
                    .title.mt-4.grey--text.text--darken-2 Total
                    .display-1.grey--text.text--darken-2 {{ total | readable }}    

                v-flex(xs4)
                    v-badge(v-model="show" large color="rgb(184, 187, 40)" right).mt-5
                        template(v-slot:badge)
                            span 1
                        v-icon(color="green" large) multiline_chart                
                v-flex(xs8)
                    .title.grey--text.text--darken-2.mt-1 Month
                    .headline.grey--text.text--darken-2 {{ month | readable }}

                v-flex(xs4)
                    v-badge(v-model="show" large color="red" right).mt-4
                        template(v-slot:badge)
                            span 6
                        v-icon(color="blue" medium) multiline_chart                

</template>

<script>
export default {
    props: ['title', 'total', 'month'],
    filters:{
        readable: value => `  $${Number(value).toLocaleString().replace(',',' ')}`
    },
    data(){
        return{
            show:true
        }
    }
}
</script>

<style scoped>
</style>
