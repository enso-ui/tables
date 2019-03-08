<template>
    <core-table v-bind="$attrs"
        v-on="$listeners"
        @ready="ready = true"
        ref="table">
        <template v-slot:default
            v-if="ready">
            <table-content>
                <template v-slot:[slot]="props"
                    v-for="slot in scopedSlots">
                    <slot :name="slot"
                        v-bind="props"/>
                </template>
            </table-content>
        </template>
    </core-table>
</template>

<script>
import CoreTable from '../renderless/VueTable.vue';
import TableContent from './parts/TableContent.vue';

export default {
    name: 'VueTable',

    components: { CoreTable, TableContent },

    data: () => ({
        ready: false,
    }),

    computed: {
        scopedSlots() {
            return this.ready
                ? this.$refs.table.scopedSlots()
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
