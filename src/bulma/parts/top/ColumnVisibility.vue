<template>
    <core-column-visibility>
        <template v-slot:default="{ bindings, events }">
            <vue-select class="column-visibility"
                v-bind="bindings"
                v-on="events">
                <template v-slot:selection>
                    <div class="is-flex is-align-items-center">
                        <span class="icon is-small">
                            <fa icon="eye"/>
                        </span>
                    </div>
                </template>
            </vue-select>
        </template>
    </core-column-visibility>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { VueSelect } from '@enso-ui/select/bulma';
import CoreColumnVisibility from '../../../renderless/parts/top/CoreColumnVisibility.vue';

library.add(faEye);

export default {
    name: 'ColumnVisibility',

    components: { CoreColumnVisibility, VueSelect },

    inject: ['i18n', 'visibleColumns', 'invisibleColumns'],
};
</script>

<style lang="scss">
    .vue-table .column-visibility.dropdown {
        width: unset;

        .icon:first-child:last-child {
            margin-left: unset;
            margin-right: unset;
        }

        .dropdown-menu {
            width: unset;
        }
    }
</style>
