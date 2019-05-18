<template>
    <core-controls>
        <template v-slot:default="{
                reloadEvents, resetEvents, forceInfoEvents, controlBindings, controlEvents,
                searchBindings, searchEvents, clearEvents
            }">
            <div class="top-controls has-background-light">
                <div class="columns is-multiline">
                    <div class="column table-controls is-half-tablet is-one-third-desktop has-text-centered-mobile has-padding-small">
                        <length-menu v-if="state.template.controls.includes('length')"/>
                        <column-visibility v-if="state.template.controls.includes('columns')"/>
                        <style-selector class="is-hidden-mobile"
                            v-if="state.template.controls.includes('style')"/>
                        <a class="button"
                            v-on="reloadEvents"
                            v-if="state.template.controls.includes('reload')">
                            <span class="icon is-small">
                                <fa icon="sync"/>
                            </span>
                        </a>
                        <a class="button"
                            v-on="resetEvents"
                            v-if="state.template.controls.includes('reset')">
                            <span class="icon is-small">
                                <fa icon="undo"/>
                            </span>
                        </a>
                        <a class="button"
                            v-on="forceInfoEvents"
                            v-if="!state.body.fullRecordInfo">
                            <span class="icon is-small has-text-info">
                                <fa icon="info-circle"/>
                            </span>
                        </a>
                    </div>
                    <div class="column table-buttons is-one-third-desktop is-half-tablet has-text-right-tablet has-text-centered-mobile has-padding-small"
                        v-if="state.template.buttons">
                        <a v-for="button in state.template.buttons.global"
                            class="button has-margin-left-small"
                            :class="button.class"
                            :key="button.label"
                            v-bind="controlBindings(button)"
                            v-on="controlEvents(button)">
                            <span class="is-hidden-mobile">
                                {{ i18n(button.label) }}
                            </span>
                            <span class="icon is-small">
                                <fa :icon="button.icon"/>
                            </span>
                            <span class="is-hidden-mobile"/>
                        </a>
                    </div>
                    <div class="column has-padding-small is-one-third-desktop search-input">
                        <p class="control has-icons-left has-icons-right"
                            v-if="state.meta.searchable">
                            <input class="input has-text-centered is-rounded"
                                type="text"
                                v-bind="searchBindings"
                                v-on="searchEvents"
                                :placeholder="i18n('Search')">
                            <span class="icon is-small is-left">
                                <fa icon="search"/>
                            </span>
                            <span class="icon is-small is-right clear-button"
                                v-if="state.meta.search && !state.meta.loading"
                                v-on="clearEvents">
                                <a class="delete is-small"/>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </template>
    </core-controls>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faSync, faUndo, faSearch, faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import CoreControls from '../../../renderless/parts/top/CoreControls.vue';
import LengthMenu from './LengthMenu.vue';
import ColumnVisibility from './ColumnVisibility.vue';
import StyleSelector from './StyleSelector.vue';

library.add(faSync, faUndo, faSearch, faInfoCircle);

export default {
    name: 'TopControls',

    components: {
        CoreControls, LengthMenu, ColumnVisibility, StyleSelector,
    },

    inject: ['state', 'i18n'],
};
</script>

<style lang="scss">
    .vue-table .top-controls {
        border-top-left-radius: inherit;
        border-top-right-radius: inherit;
        padding: 1em;

        .control.has-icons-right .icon.clear-button {
            pointer-events: all;
        }

        @media screen and (min-width: 1024px) {
            .table-controls {
                order: 1;
            }

            .search-input {
                order: 2;
            }

            .table-buttons {
                order: 3;
            }
        }
    }
</style>
