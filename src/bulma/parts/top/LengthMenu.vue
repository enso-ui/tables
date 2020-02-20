<template>
    <core-length-menu>
        <template v-slot:default="{ isActive, update }">
            <dropdown class="length-menu"
                width="4em">
                <template v-slot:label>
                    {{ state.meta.length }}
                </template>
                <template v-slot:items="{ itemBindings, itemEvents }">
                    <dropdown-item v-for="(value, index) in state.template.lengthMenu"
                        :key="value"
                        @select="update(value)"
                        v-bind="itemBindings(isActive(value), index)"
                        v-on="itemEvents(index)">
                        {{ value }}
                    </dropdown-item>
                </template>
            </dropdown>
        </template>
    </core-length-menu>
</template>

<script>
import { Dropdown, DropdownItem } from '@enso-ui/dropdown/bulma';
import CoreLengthMenu from '../../../renderless/parts/top/CoreLengthMenu.vue';

export default {
    name: 'LengthMenu',

    components: { CoreLengthMenu, Dropdown, DropdownItem },

    inject: ['state'],
};
</script>

<style lang="scss">
    .vue-table .length-menu {
        .dropdown-item {
            padding: .5em 1.7em;
        }
    }
</style>
