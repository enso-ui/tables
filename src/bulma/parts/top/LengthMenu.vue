<template>
    <core-length-menu>
        <template v-slot:default="{ isActive, update, state }">
            <dropdown class="length-menu"
                width="4em">
                <template v-slot:label>
                    {{ state.meta.length }}
                </template>
                <template v-slot:items>
                    <dropdown-item v-for="value in state.template.lengthMenu"
                        :key="value"
                        :selected="isActive(value)"
                        @select="update(value)">
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
};
</script>

<style lang="scss">
    .vue-table .length-menu {
        .dropdown-item {
            padding: .5em 1.7em;
        }
    }
</style>
