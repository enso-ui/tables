<template>
    <core-controls>
        <template v-slot:default="{
                controlBindings, controlEvents, filteredEvents, forceInfoEvents,
                i18n, reloadEvents, resetEvents, state
            }">
            <div class="wrapper">
            <div class="top-controls has-background-light">
                <div class="columns is-multiline is-mobile is-gapless">
                    <div class="column table-controls is-narrow-desktop is-half-touch">
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
                    <div class="column table-buttons is-narrow-desktop is-half-touch has-text-right"
                        v-if="state.template.buttons">
                        <template v-for="button in state.template.buttons.global">
                            <slot :name="button.slot"
                                :icon="button.icon"
                                :label="button.label"
                                :css-class="button.class"
                                v-if="button.slot"/>
                            <a class="button has-margin-left-small"
                                :class="button.class"
                                :key="`${button.label}-${button.icon}`"
                                v-bind="controlBindings(button)"
                                v-on="controlEvents(button)"
                                v-else>
                               <span class="is-hidden-mobile">
                                   {{ i18n(button.label) }}
                               </span>
                                   <span class="icon is-small">
                                   <fa :icon="button.icon"/>
                               </span>
                               <span class="is-hidden-mobile"/>
                            </a>
                        </template>
                    </div>
                    <div class="column search">
                        <search ref="search"/>
                    </div>
                </div>
            </div>
            <filtered v-on="filteredEvents"/>
            </div>
        </template>
    </core-controls>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faSync, faUndo, faSearch, faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import Search from './Search';
import CoreControls from '../../../renderless/parts/top/CoreControls.vue';
import LengthMenu from './LengthMenu.vue';
import ColumnVisibility from './ColumnVisibility.vue';
import StyleSelector from './StyleSelector.vue';
import Filtered from './Filtered.vue';

library.add(faSync, faUndo, faSearch, faInfoCircle);

export default {
    name: 'Controls',

    components: {
        CoreControls, LengthMenu, ColumnVisibility, StyleSelector, Search, Filtered,
    },
};
</script>

<style lang="scss">
    .vue-table {
        .wrapper {
            border-top-left-radius: inherit;
            border-top-right-radius: inherit;

            .top-controls {
                border-top-left-radius: inherit;
                border-top-right-radius: inherit;
                padding: 0.3em;

                @media screen and (min-width: 1024px) {
                    .table-controls {
                        order: 1;
                    }

                    .search {
                        order: 2;
                    }

                    .table-buttons {
                        order: 3;
                    }
                }
            }

            .has-vertically-centered-content {
                display:flex;
                align-items: center;
            }
        }
    }
</style>
