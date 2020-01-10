<template>
    <core-table v-bind="$attrs"
        v-on="$listeners"
        @ready="ready = true"
        ref="table">
        <template v-slot:default
            v-if="ready">
            <table-content v-on="$listeners">
                <template v-slot:[slot]="props"
                    v-for="slot in slots">
                    <slot :name="slot"
                        v-bind="props"/>
                </template>
            </table-content>
        </template>
    </core-table>
</template>

<script>
import CoreTable from '../renderless/CoreTable.vue';
import TableContent from './parts/TableContent.vue';

export default {
    name: 'VueTable',

    components: { CoreTable, TableContent },

    data: () => ({
        ready: false,
    }),

    computed: {
        body() {
            return this.ready
                ? this.$refs.table.state.body
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
                ? this.$refs.table.state.highlighted
                : null;
        },
        selected() {
            return this.ready
                ? this.$refs.table.state.selected
                : null;
        },
    },
};
</script>
