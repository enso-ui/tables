<template>
    <core-style-selector>
        <template #default="{ bindings, events }">
            <vue-select class="table-select"
                :class="$attrs.class"
                style="--table-menu-width: 8rem; --table-menu-min-width: 8rem; --table-menu-max-width: 8rem;"
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
