<template>
    <dropdown class="column-visibility"
        manual>
        <template v-slot:label>
            <span class="icon is-small">
                <fa icon="eye"/>
            </span>
        </template>
        <template v-slot:options>
            <a v-for="(column, index) in visibleColumns()"
                :key="index"
                class="dropdown-item"
                :class="{ 'is-active': column.meta.visible }"
                @click="column.meta.visible = !column.meta.visible">
                {{ i18n(column.label) }}
            </a>
        </template>
    </dropdown>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import Dropdown from '@enso-ui/dropdown/bulma';

library.add(faEye);

export default {
    name: 'ColumnVisibility',

    components: { Dropdown },

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
