<template lang="pug">
    v-card().mt-4
        v-card-text
            .title.grey--text.text--darken-2 {{ title }}
            v-layout(row wrap)
                v-flex(xs8)
                    .title.mt-4.grey--text.text--darken-2 Umumiy
                    .display-1.grey--text.text--darken-2 {{ umumiy | readable }}    

                v-flex(xs4)
                    v-badge(v-model="show" large color="rgb(184, 187, 40)" right).mt-5
                        template(v-slot:badge)
                            span 6
                        v-icon(color="green" large) multiline_chart                
                v-flex(xs8)
                    .title.grey--text.text--darken-2.mt-1 Oy
                    .headline.grey--text.text--darken-2 {{ oy | readable }}

                v-flex(xs4)
                    v-badge(v-model="show" large color="red" right).mt-4
                        template(v-slot:badge)
                            span 6
                        v-icon(color="blue" medium) multiline_chart                

</template>

<script>
export default {
    props: ['title', 'umumiy', 'oy'],
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
.rank{
    padding: 5%;
    text-align: center;
    width: 60px;
    height:60px;
    border-radius: 50%;
    border: 5px solid rgb(184, 187, 40);
    color: rgb(94, 110, 70);
    box-shadow: 0px 0px 10px green;
    background: transparent;
}

</style>
