<template>
    <vue-table :path="path"
        v-bind="$attrs"
        v-on="$listeners"
        :error-handler="errorHandler"
        :i18n="i18n"
        @ready="ready = true"
        ref="table">
        <template v-slot:[slot]="props"
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

    inject: ['errorHandler', 'i18n'],

    components: { VueTable },

    props: {
        path: {
            type: String,
            default() {
                return `/${`api/${this.$route.path}/initTable`
                    .split('/').filter(v => v).join('/')}`;
            },
        },
    },

    data: () => ({
        ready: false,
    }),

    computed: {
        body() {
            return this.ready
                ? this.$refs.table.body
                : null;
        },
        slots() {
            return this.ready
                ? this.$refs.table.slots
                : [];
        },
    },

    methods: {
        clearHighlighted() {
            return this.ready
                ? this.$refs.table.clearHighlighted()
                : null;
        },
        fetch() {
            return this.ready
                ? this.$refs.table.fetch()
                : null;
        },
        highlight(dtRowId) {
            return this.ready
                ? this.$refs.table.highlight(dtRowId)
                : null;
        },
        highlighted() {
            return this.ready
                ? this.$refs.table.state.highlighted()
                : null;
        },
    },
};
</script>
