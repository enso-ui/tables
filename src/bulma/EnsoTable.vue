<template>
    <vue-table :path="path"
        v-bind="$attrs"
        v-on="$listeners"
        :error-handler="handleError"
        :i18n="__"
        @ready="ready = true"
        ref="table">
        <template v-slot:[slot]="props"
            v-for="slot in scopedSlots">
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

    props: {
        path: {
            type: String,
            default() {
                return `${window.location.origin}/api${this.$route.path}initTable`;
            },
        },
    },

    data: () => ({
        ready: false,
    }),

    computed: {
        scopedSlots() {
            return this.ready
                ? this.$refs.table.scopedSlots
                : [];
        },
    },

    methods: {
        clearHighlighted() {
            return this.ready
                ? this.$refs.table.clearHighlighted
                : null;
        },
        fetch() {
            return this.ready
                ? this.$refs.table.fetch
                : null;
        },
        highlight() {
            return this.ready
                ? this.$refs.table.highlight
                : null;
        },
        highlighted() {
            return this.ready
                ? this.$refs.table.state.highlighted
                : null;
        },
    },
};
</script>
