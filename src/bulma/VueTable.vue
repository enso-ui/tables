<template>
    <div class="vue-table">
        <core-table v-bind="$attrs"
            @ready="ready = true"
            ref="table">
            <template #default>
                <table-content v-if="ready">
                    <template #[slot]="props"
                        v-for="slot in slots">
                        <slot :name="slot"
                            v-bind="props"/>
                    </template>
                </table-content>
            </template>
        </core-table>
    </div>
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
            return this.ready && this.$refs.table.state.highlighted;
        },
        selected() {
            return this.ready && this.$refs.table.state.selected;
        },
    },
};
</script>
