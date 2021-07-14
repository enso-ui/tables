<template>
    <core-table-body v-on="$listeners">
        <template v-slot:default="{
                actionBindings, actionEvents, cellBindings, cellEvents, hiddenColspan, hiddenCount,
                isExpanded, shouldRender, rowCrtNo, selectEvents, hiddenEvents, isHighlighted,
                selectBindings, columnAlignment, isChild, i18n, visibleColumn, state,
            }">
            <tbody>
                <tr v-for="(row, index) in state.body.data"
                    :key="row[state.template.dtRowId]"
                    :class="{
                        [state.template.highlight]: isHighlighted(row[state.template.dtRowId])
                    }">
                    <td v-if="isChild(row)"
                        :colspan="hiddenColspan()"
                        :class="state.template.align">
                        <ul>
                            <template v-for="cell in row">
                                <li class="child-row"
                                    :class="cell.column.class"
                                    :key="cell.column.label"
                                    v-if="!cell.column.meta.rogue">
                                    <b>{{ i18n(cell.column.label) }}</b>:
                                    <table-cell :i18n="i18n"
                                        :column="cell.column"
                                        :value="cell.value"
                                        v-on="cellEvents(state.body.data[index - 1], cell.column)">
                                        <template v-slot:[cell.column.name]
                                            v-if="cell.column.meta.slot">
                                            <slot :name="cell.column.name"
                                                :row="state.body.data[cell.rowCrtNo]"
                                                :column="cell.column"
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
                                    <input v-bind="selectBindings(row)"
                                        type="checkbox"
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
                                    { 'is-number' : column.number },
                                    columnAlignment(column), column.class
                                ]" v-if="visibleColumn(column)">
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
                                <template v-for="(button, idx) in state.template.buttons.row">
                                    <template v-if="shouldRender(row, button)">
                                        <slot :name="button.slot"
                                            :icon="button.icon"
                                            :label="button.label"
                                            :route="button.route"
                                            :event="button.event"
                                            :css-class="button.class"
                                            :row="row"
                                            v-if="button.slot"/>
                                        <a class="button is-small is-table-button ml-1"
                                            :class="button.class"
                                            v-bind="actionBindings(button, row)"
                                            :key="`action-${idx}`"
                                            v-tooltip.left="button.tooltip ? i18n(button.tooltip) : null"
                                            v-on="actionEvents(button, row)"
                                            v-else>
                                            <span v-if="button.label">
                                                {{ i18n(button.label) }}
                                            </span>
                                            <span class="icon is-small">
                                                <fa :icon="button.icon"/>
                                            </span>
                                        </a>
                                    </template>
                                </template>

                            </span>
                        </td>
                    </template>
                </tr>
            </tbody>
        </template>
    </core-table-body>
</template>

<script>
import { VTooltip } from 'v-tooltip';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faChevronRight, faEye, faPencilAlt, faTrashAlt, faCloudDownloadAlt,
} from '@fortawesome/free-solid-svg-icons';
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

        .is-number {
            white-space: pre;
            font-family: monospace;
        }
    }
</style>
