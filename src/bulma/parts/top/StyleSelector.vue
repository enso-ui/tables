<template>
    <core-style-selector>
        <template v-slot:default="{ styles, hasStyle, toggle }">
            <dropdown class="style-selector"
                manual>
                <template v-slot:label>
                    <span class="icon is-small">
                        <fa icon="table"/>
                    </span>
                </template>
                <template v-slot:items="{ itemBindings, itemEvents }">
                    <dropdown-item v-for="(style, index) in Object.keys(styles)"
                        :key="style"
                        v-bind="itemBindings(hasStyle(styles[style]), index)"
                        @select="toggle(styles[style])"
                        v-on="itemEvents(index)">
                        {{ style }}
                    </dropdown-item>
                </template>
            </dropdown>
        </template>
    </core-style-selector>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, DropdownItem } from '@enso-ui/dropdown/bulma';
import CoreStyleSelector from '../../../renderless/parts/top/CoreStyleSelector.vue';

library.add(faTable);

export default {
    name: 'StyleSelector',

    components: { CoreStyleSelector, Dropdown, DropdownItem },
};
</script>

<style lang="scss">
    .vue-table .style-selector {
        .dropdown-item {
            padding: .5em .8em;
        }

        .button .icon:first-child:not(:last-child) {
            margin: unset;
        }
    }
</style>
