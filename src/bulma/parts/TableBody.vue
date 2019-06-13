<template>
    <core-table-body v-on="$listeners">
        <template v-slot:default="{
                isHighlighted, rowCrtNo, hiddenCount,
                selectBindings, selectEvents, isExpanded, hiddenColSpan,
                hiddenEvents, cellBindings, cellEvents, actionBindings, actionEvents,
            }">
            <tbody>
                <tr v-for="(row, index) in state.body.data"
                    :key="`${row.dtRowId}-${index}`"
                    :class="{ [state.template.highlight]: isHighlighted(index) }">
                    <td v-if="isChild(row)"
                        :colspan="hiddenColSpan"
                        :class="state.template.align">
                        <ul>
                            <template v-for="item in row">
                                <li class="child-row"
                                    :key="item.column.label"
                                    v-if="!item.column.meta.rogue">
                                    <b>{{ i18n(item.column.label) }}</b>:
                                    <table-cell :i18n="i18n"
                                        :column="item.column"
                                        :value="item.value"
                                        v-on="cellEvents(state.body.data[index - 1], item.column)">
                                        <template v-slot:[item.column.name]
                                            v-if="item.column.meta.slot">
                                            <slot :name="item.column.name"
                                                :row="state.body.data[item.rowCrtNo]"
                                                :column="item.column"
                                                :loading="state.meta.loading"/>
                                        </template>
                                    </table-cell>
                                </li>
                            </template>
                            <li v-if="state.template.preview">
                                <slot name="preview"
                                    :row="state.body.data[index-1]"/>
                            </li>
                        </ul>
                    </td>
                    <template v-else>
                        <td v-if="state.template.selectable"
                            :class="state.template.align">
                            <div class="selectable">
                                <label class="checkbox">
                                    <input type="checkbox"
                                        v-bind="selectBindings(row)"
                                        v-on="selectEvents(row)">
                                </label>
                            </div>
                        </td>
                        <td v-if="hiddenCount || state.template.preview">
                            <span class="icon is-small hidden-control"
                                :aria-visible="isExpanded(row)"
                                v-on="hiddenEvents(row, index)">
                                <fa icon="chevron-right"/>
                            </span>
                        </td>
                        <td :class="state.template.align"
                            v-if="state.template.crtNo">
                            <span class="crt-no">
                                {{ rowCrtNo(row) }}
                            </span>
                        </td>
                        <template v-for="column in state.template.columns">
                            <td :key="column.name"
                                :class="[
                                    column.class,
                                    { 'is-money' : column.money },
                                    columnAlignment(column)
                                ]"
                                v-if="visibleColumn(column)">
                                <table-cell v-bind="cellBindings(row, column)"
                                    v-on="cellEvents(row, column)">
                                    <template v-slot:[column.name]
                                        v-if="column.meta.slot">
                                        <slot :name="column.name"
                                            :row="row"
                                            :column="column"
                                            :loading="state.meta.loading"/>
                                    </template>
                                </table-cell>
                            </td>
                        </template>
                        <td class="table-actions"
                            :class="state.template.align"
                            v-if="state.template.actions && !isChild(row)">
                            <span class="action-buttons">
                                <a v-for="(button, idx) in state.template.buttons.row"
                                    :key="idx"
                                    class="button is-small is-table-button has-margin-left-small"
                                    :class="button.class"
                                    v-tooltip="button.tooltip ? i18n(button.tooltip) : null"
                                    v-bind="actionBindings(button, row)"
                                    v-on="actionEvents(button, row)">
                                    <span v-if="button.label">
                                        {{ i18n(button.label) }}
                                    </span>
                                    <span class="icon is-small">
                                        <fa :icon="button.icon"/>
                                    </span>
                                </a>
                            </span>
                        </td>
                    </template>
                </tr>
            </tbody>
        </template>
    </core-table-body>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faChevronRight, faEye, faPencilAlt, faTrashAlt, faCloudDownloadAlt,
} from '@fortawesome/free-solid-svg-icons';
import { VTooltip } from 'v-tooltip';
import CoreTableBody from '../../renderless/CoreTableBody.vue';
import TableCell from './TableCell.vue';

library.add([
    faChevronRight, faEye, faPencilAlt, faTrashAlt, faCloudDownloadAlt,
]);

export default {
    name: 'TableBody',

    directives: { tooltip: VTooltip },

    components: { CoreTableBody, TableCell },

    inject: [
        'state', 'i18n', 'visibleColumn', 'columnAlignment', 'isChild',
    ],
};
</script>

<style lang="scss">
    .vue-table {
        .hidden-control {
            cursor: pointer;
            margin-left: auto;
            margin-top: 0.1em;
        }

        tbody {
            overflow-y: hidden;
        }

        td .icon.hidden-control {
            &[aria-visible="true"] {
                transform: rotate(90deg);
            }

            transition: transform .300s ease;
        }

        td.table-actions {
            padding: .35em .5em;

            span.action-buttons {
                display: inline-flex;
            }

            .button.is-small {
                &.is-table-button {
                    height: 1.6em;
                    padding: 0.4em;
                    font-size: .9em;
                }

                &.is-row-button {
                    background: 0;
                    border: none;
                    opacity: 0.6;
                    transition: opacity ease 0.3s;

                    &:focus {
                        box-shadow: unset;
                    }

                    &:hover {
                        opacity: 1;
                    }
                }
            }
        }

        li.child-row:not(:last-child) {
            border-bottom: 1px solid #efefef;
        }

        li.child-row {
            padding: 0.5em 0;
        }

        .is-money {
            white-space: pre;
            font-family: monospace;
        }
    }
</style>
