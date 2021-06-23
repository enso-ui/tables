<template>
    <core-style-selector>
        <template v-slot:default="{ bindings, events }">
            <vue-select class="style-selector"
                v-bind="bindings"
                v-on="events">
                <template v-slot:selection>
                    <div class="is-flex is-align-items-center">
                        <span class="icon">
                            <fa icon="table"/>
                        </span>
                    </div>
                </template>
            </vue-select>
        </template>
    </core-style-selector>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import { VueSelect } from '@enso-ui/select/bulma';
import CoreStyleSelector from '../../../renderless/parts/top/CoreStyleSelector.vue';

library.add(faTable);

export default {
    name: 'StyleSelector',

    components: { CoreStyleSelector, VueSelect },
};
</script>

<style lang="scss">
    .vue-table .style-selector.dropdown {
        width: unset;

        .icon:first-child:last-child {
            margin-left: unset;
            margin-right: unset;
        }

        .dropdown-menu {
            width: unset;
        }
    }

    .dropdown.vue-select .dropdown-trigger .button.input {
        min-height: 34px;
    }
</style>
