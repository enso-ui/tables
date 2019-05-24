<template>
    <core-table-header>
        <template v-slot:default="{
                align, style, crtNo, crtNoLabel, actions, actionsLabel, i18n, columns,
                selectable, visibleColumn, hiddenColumns, preview, columnAlignment,
                selectBindings, selectEvents, sortEvents, clearSortEvents
            }">
            <thead>
                <tr class="has-background-light"
                    :class="style">
                    <th class="table-header"
                        :class="align"
                        v-if="selectable">
                        <label class="checkbox">
                            <input type="checkbox"
                                v-bind="selectBindings"
                                v-on="selectEvents">
                        </label>
                    </th>
                    <th v-if="hiddenColumns || preview"/>
                    <th class="table-header"
                        :class="align"
                        v-if="crtNo">
                        {{ i18n(crtNoLabel) }}
                    </th>
                    <template v-for="column in columns">
                        <th class="table-header"
                            :class="columnAlignment(column)"
                            :key="column.label"
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
                                    <fa icon="info" size="xs"/>
                                </span>
                                <span class="sorter"
                                    v-on="sortEvents(column)"
                                    v-if="column.meta.sortable">
                                    <span class="icon is-small">
                                        <fa icon="sort"
                                            size="xs"
                                            v-if="!column.meta.sort"/>
                                        <fa icon="sort-up"
                                            size="xs"
                                            v-else-if="column.meta.sort === 'ASC'"/>
                                        <fa icon="sort-down"
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
                    <th class="table-header"
                        :class="align"
                        v-if="actions">
                        {{ i18n(actionsLabel) }}
                    </th>
                </tr>
            </thead>
        </template>
    </core-table-header>
</template>

<script>

import { VTooltip } from 'v-tooltip';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faSort, faSortUp, faSortDown, faPlus, faFileExcel, faInfo,
} from '@fortawesome/free-solid-svg-icons';
import CoreTableHeader from '../../renderless/parts/CoreTableHeader.vue';

library.add(faSort, faSortUp, faSortDown, faPlus, faFileExcel, faInfo);

export default {
    name: 'TableHeader',

    directives: { tooltip: VTooltip },

    components: { CoreTableHeader },
};
</script>

<style lang="scss">
    .vue-table .table-header {
        white-space: nowrap;
        align-content: center;

        .is-clickable {
            cursor: pointer;
        }

        .table-header-controls {
            .sorter {
                cursor: pointer;
                opacity: 0.5;

                &:hover {
                    opacity: 1;
                }
            }
        }
    }
</style>
