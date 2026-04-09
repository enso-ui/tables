<template>
    <core-column-visibility>
        <template #default="{ bindings, events }">
            <vue-select class="column-visibility table-control-select table-icon-select"
                :class="$attrs.class"
                v-bind="bindings"
                v-on="events">
                <template #selection>
                    <div class="is-flex is-align-items-center is-justify-content-center">
                        <span class="icon is-small">
                            <fa :icon="faEye"/>
                        </span>
                    </div>
                </template>
            </vue-select>
        </template>
    </core-column-visibility>
</template>

<script>
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { VueSelect } from '@enso-ui/select/bulma';
import CoreColumnVisibility from '../../../renderless/parts/top/CoreColumnVisibility.vue';

export default {
    name: 'ColumnVisibility',

    components: { CoreColumnVisibility, Fa, VueSelect },

    inject: ['i18n', 'invisibleColumns', 'visibleColumns'],

    data: () => ({
        faEye,
    }),
};
</script>
