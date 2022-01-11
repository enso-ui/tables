<template>
    <core-length-menu>
        <template #default="{ bindings, events }">
            <vue-select class="length-menu"
                :class="$attrs.class"
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

    inject: ['http'],
};
</script>

<style lang="scss">
    .vue-table .length-menu .dropdown {
        width: unset;
    }
</style>
