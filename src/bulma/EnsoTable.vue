<template>
    <vue-table v-bind="$attrs"
        :path="path"
        :error-handler="errorHandler"
        :router-error-handler="routerErrorHandler"
        :http="http"
        :i18n="i18n"
        @ready="ready = true"
        ref="table">
        <template #[slot]="props"
            v-for="slot in slots">
            <slot :name="slot"
                v-bind="props"/>
        </template>
    </vue-table>
</template>

<script>
import VueTable from './VueTable.vue';

export default {
    name: 'EnsoTable',

    components: { VueTable },

    inject: ['errorHandler', 'http', 'i18n', 'routerErrorHandler'],

    data: () => ({
        ready: false,
    }),

    computed: {
        body() {
            return this.ready
                ? this.$refs.table.body
                : null;
        },
        path() {
            return this.$attrs.path
                ?? `/${`api/${this.$route.path}/initTable`
                    .split('/').filter(v => v).join('/')}`;
        },
        slots() {
            return this.ready
                ? this.$refs.table.slots
                : [];
        },
    },

    methods: {
        clearHighlighted() {
            return this.ready && this.$refs.table.clearHighlighted();
        },
        clearSelected() {
            return this.ready && this.$refs.table.clearSelected();
        },
        fetch() {
            return this.ready && this.$refs.table.fetch();
        },
        highlight(dtRowId) {
            return this.ready && this.$refs.table.highlight(dtRowId);
        },
        removeHighlight(dtRowId) {
            return this.ready && this.$refs.table.removeHighlight(dtRowId);
        },
        toggleHighlight(dtRowId) {
            return this.ready && this.$refs.table.toggleHighlight(dtRowId);
        },
        highlighted() {
            return this.ready && this.$refs.table.highlighted();
        },
        selected() {
            return this.ready && this.$refs.table.selected();
        },
    },
};
</script>
