<template>
    <dropdown class="column-visibility"
        manual>
        <template v-slot:label>
            <span class="icon is-small">
                <fa icon="eye"/>
            </span>
        </template>
        <template v-slot:items="{ itemBindings, itemEvents }">
            <dropdown-item v-for="(column, index) in visibleColumns()"
                :key="column.name"
                v-bind="itemBindings(column.meta.visible, index)"
                @select="column.meta.visible = !column.meta.visible"
                v-on="itemEvents(index)">
                {{ i18n(column.label) }}
            </dropdown-item>
        </template>
    </dropdown>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, DropdownItem } from '@enso-ui/dropdown/bulma';

library.add(faEye);

export default {
    name: 'ColumnVisibility',

    components: { Dropdown, DropdownItem },

    inject: ['i18n', 'visibleColumns'],
};
</script>

<style lang="scss">
    .vue-table .column-visibility {
        .options {
            max-height: 250px;
            overflow-y: scroll;

            .dropdown-item {
                padding: .5em .8em;
            }
        }

        .button .icon:first-child:not(:last-child) {
            margin: unset;
        }
    }
</style>
