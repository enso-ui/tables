<template>
    <tfoot>
        <tr>
            <td v-if="hiddenColumns().length || state.template.preview"/>
            <td v-if="state.template.crtNo"/>
            <td v-if="state.template.selectable"/>
            <td class="has-text-centered is-bold"
                v-if="visibleColumn(state.template.columns[0])">
                {{ i18n("Total") }}
            </td>
            <template v-for="i in columns.length - 1">
                <td class="is-bold"
                    :class="[{ 'is-money' : columns[i].money }, columnAlignment(columns[i])]"
                    :key="i"
                    v-if="visibleColumn(columns[i])">
                    <span v-if="columns[i].meta.total"> {{
                            columns[i].money
                                ? state.body.total[columns[i].name]
                                : totalFormat(state.body.total[columns[i].name])
                    }}</span>
                    <slot :name="`${columns[i].name}_custom_total`"
                        :total="state.body.total"
                        v-else-if="columns[i].meta.customTotal"/>
                </td>
            </template>
            <td v-if="state.template.actions"/>
        </tr>
    </tfoot>
</template>
<script>
export default {
    name: 'TableFooter',

    inject: [
        'state', 'i18n', 'visibleColumns', 'hiddenColumns', 'visibleColumn',
        'columnAlignment', 'totalFormat',
    ],

    computed: {
        columns() {
            return this.visibleColumns();
        },
    },
};
</script>
