<template>
    <core-style-selector>
        <template #default="{ bindings, events }">
            <vue-select class="table-select style-selector"
                :class="$attrs.class"
                v-bind="bindings"
                v-on="events">
                <template #selection>
                    <div class="is-flex is-align-items-center is-justify-content-center">
                        <span class="icon">
                            <fa :icon="faTable"/>
                        </span>
                    </div>
                </template>
            </vue-select>
        </template>
    </core-style-selector>
</template>

<script>
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import { VueSelect } from '@enso-ui/select/bulma';
import CoreStyleSelector from '../../../renderless/parts/top/CoreStyleSelector.vue';

export default {
    name: 'StyleSelector',

    components: { CoreStyleSelector, Fa, VueSelect },

    data: () => ({
        faTable,
    }),
};
</script>

<style lang="scss">
    .style-selector {
        --table-menu-width: 8rem;
        --table-menu-min-width: 8rem;
        --table-menu-max-width: 8rem;
    }
</style>
