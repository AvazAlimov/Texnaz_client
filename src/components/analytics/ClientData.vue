<template lang="pug">
    v-card.border.elevation-0.secondary--text
        v-card-text
            .title Данные клиента
            v-layout(row wrap align-center)
                .ml-2
                    .title.mt-4 Всего
                    .display-1 {{ total | readable }}
                v-spacer
                .mr-4
                    v-badge(large color="orange" right).mt-5
                        template(v-slot:badge)
                            span 1
                        v-icon(color="secondary" large) timeline

            v-layout(row wrap align-center)
                .ml-2
                    .title.mt-1 Месяц
                    .headline {{ month | readable }}
                v-spacer
                .mr-4
                    v-badge(large color="red" right).mt-4
                        template(v-slot:badge)
                            span 6
                        v-icon(color="secondary" large) timeline
</template>
<script>
export default {
  props: ['title', 'total', 'month'],
};
</script>
