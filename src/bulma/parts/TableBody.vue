<template>
    <core-table-body v-on="$listeners">
        <template v-slot:default="{
                isHighlighted, rowCrtNo, hiddenCount, cascadesHiddenControls,
                selectBindings, selectEvents, isExpanded, toggleHidden, hiddenColSpan,
                hiddenEvents, cellBindings, cellEvents, actionBindings, actionEvents,
            }">
            <tbody>
                <tr v-for="(row, index) in state.body.data"
                    :key="`${row.dtRowId}-${index}`"
                    :class="{ [state.template.highlight]: isHighlighted(index) }">
                    <td v-if="state.template.selectable && !isChild(row)"
                        :class="state.template.align">
                        <div class="selectable">
                            <label class="checkbox">
                                <input type="checkbox"
                                    v-bind="selectBindings(row)"
                                    v-on="selectEvents(row)">
                            </label>
                        </div>
                    </td>
                    <td :class="state.template.align"
                        v-if="state.template.crtNo && !isChild(row)">
                        <span class="crt-no">
                            <span class="crt-no-label">
                                {{ rowCrtNo(row) }}
                            </span>
                            <span v-if="hiddenCount"
                                class="icon is-small hidden-control"
                                v-on="hiddenEvents(row, index)">
                                <fa :icon="isExpanded(row) ? 'minus-square' : 'plus-square'"/>
                            </span>
                        </span>
                    </td>
                    <template v-for="(column, idx) in state.template.columns">
                        <td :key="column.name"
                            :class="[
                                column.class,
                                { 'is-money' : column.money },
                                columnAlignment(column)
                            ]"
                            v-if="visibleColumn(column) && !isChild(row)">
                            <table-cell v-bind="cellBindings(row, column, idx)"
                                v-on="cellEvents(row, column)">
                                <template v-slot:hidden-control>
                                    <span class="icon is-small hidden-control"
                                        v-on="hiddenEvents(row, index)"
                                        v-if="cascadesHiddenControls && idx === 0">
                                        <fa :icon="
                                            isExpanded(row)
                                                ? 'minus-square'
                                                : 'plus-square'
                                        "/>
                                    </span>
                                </template>
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
                                        v-on="cellEvents(row, item.column)">
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
                        </ul>
                    </td>
                </tr>
            </tbody>
        </template>
    </core-table-body>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faMinusSquare, faPlusSquare, faEye, faPencilAlt, faTrashAlt, faCloudDownloadAlt,
} from '@fortawesome/free-solid-svg-icons';
import { VTooltip } from 'v-tooltip';
import CoreTableBody from '../../renderless/CoreTableBody.vue';
import TableCell from './TableCell.vue';

library.add([
    faMinusSquare, faPlusSquare, faEye, faPencilAlt, faTrashAlt, faCloudDownloadAlt,
]);

export default {
    name: 'TableBody',

    directives: { tooltip: VTooltip },

    components: { CoreTableBody, TableCell },

    inject: [
        'state', 'i18n', 'ajax', 'refreshPageSelected', 'visibleColumn',
        'columnAlignment', 'isChild',
    ],
};
</script>

<style lang="scss">
    .vue-table {
        .crt-no {
            white-space:nowrap;
            display: flex;

            .crt-no-label {
                margin: auto;
            }
        }

        .hidden-control {
            cursor: pointer;
            margin-left: auto;
            margin-top: 0.1em;
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
