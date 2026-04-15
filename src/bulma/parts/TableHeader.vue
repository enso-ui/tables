<template>
    <thead>
        <core-table-header>
            <template #default="{
                actions, actionsLabel, clearSortEvents, columns, crtNo, crtNoLabel,
                hiddenColumns, i18n, preview, selectBindings, selectEvents,
                selectable, sortEvents, style, visibleColumn,
                }">
                <tr class="table-header-row"
                    :class="style">
                    <th class="table-header has-text-centered"
                        v-if="selectable">
                        <label class="checkbox">
                            <input v-bind="selectBindings"
                                type="checkbox"
                                v-on="selectEvents">
                        </label>
                    </th>
                    <th v-if="hiddenColumns || preview"/>
                    <th class="table-header has-text-centered"
                        v-if="crtNo">
                        {{ i18n(crtNoLabel) }}
                    </th>
                    <template v-for="column in columns">
                        <th class="table-header has-text-centered"
                            :key="`${column.label}-${column.name}`"
                            v-if="visibleColumn(column)">
                            <span class="is-clickable"
                                v-on="sortEvents(column)"
                                v-if="column.meta.sortable">
                                {{ i18n(column.label) }}
                            </span>
                            <span v-else>
                                {{ i18n(column.label) }}
                            </span>
                            <span class="table-header-controls">
                                <span class="icon is-small has-text-info"
                                    v-if="column.tooltip"
                                    v-tooltip="i18n(column.tooltip)">
                                    <fa :icon="faCircleInfo"
                                        size="xs"/>
                                </span>
                                <span class="sorter"
                                    v-on="sortEvents(column)"
                                    v-if="column.meta.sortable">
                                    <span class="icon is-small">
                                        <fa :icon="faSort"
                                            size="xs"
                                            v-if="!column.meta.sort"/>
                                        <fa :icon="faSortUp"
                                            size="xs"
                                            v-else-if="column.meta.sort === 'ASC'"/>
                                        <fa :icon="faSortDown"
                                            size="xs"
                                            v-else/>
                                    </span>
                                </span>
                                <a class="delete is-small"
                                    v-on="clearSortEvents(column)"
                                    v-if="column.meta.sort"/>
                            </span>
                        </th>
                    </template>
                    <th class="table-header table-actions has-text-centered"
                        v-if="actions">
                        {{ i18n(actionsLabel) }}
                    </th>
                </tr>
            </template>
        </core-table-header>
    </thead>
</template>

<script>
import 'v-tooltip/dist/v-tooltip.css';
import { VTooltip } from 'v-tooltip';
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import {
    faSort, faSortUp, faSortDown, faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';
import CoreTableHeader from '../../renderless/parts/CoreTableHeader.vue';

export default {
    name: 'TableHeader',

    directives: { tooltip: VTooltip },

    components: { CoreTableHeader, Fa },

    data: () => ({
        faCircleInfo,
        faSort,
        faSortDown,
        faSortUp,
    }),
};
</script>
