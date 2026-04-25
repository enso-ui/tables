<template>
    <core-length-menu>
        <template #default="{ bindings, events }">
            <vue-select class="table-select length-menu"
                :class="$attrs.class"
                v-bind="bindings"
                v-on="events">
                <template #selection="{ selection }">
                    <span class="selection-label">
                        {{ selection ? selection.value : bindings.modelValue }}
                    </span>
                </template>
            </vue-select>
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
    .length-menu {
        --table-menu-width: 4.5rem;
        --table-menu-min-width: 4.5rem;
        --table-menu-max-width: 4.5rem;
    }
</style>
