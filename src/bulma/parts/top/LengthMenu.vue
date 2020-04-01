<template>
    <core-length-menu>
        <template v-slot:default="{ bindings, events }">
            <vue-select class="length-menu"
                v-bind="bindings"
                v-on="events"/>
        </template>
    </core-length-menu>
</template>

<script>
import { VueSelect } from '@enso-ui/select/bulma';
import CoreLengthMenu from '../../../renderless/parts/top/CoreLengthMenu.vue';

export default {
    name: 'LengthMenu',

    components: { CoreLengthMenu, VueSelect },
};
</script>

<style lang="scss">
    .vue-table .length-menu.dropdown {
        width: unset;
    }
</style>
