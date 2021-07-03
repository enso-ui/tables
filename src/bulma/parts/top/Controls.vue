<template>
    <core-controls>
        <template v-slot:default="{
                controlBindings, controlEvents, filterLabels, filterScenarios,
                forceInfoEvents, hasSelection,i18n, reloadEvents, resetEvents, state,
            }">
            <div class="wrapper">
                <div class="top-controls has-background-light">
                    <div class="columns is-multiline is-mobile is-variable is-1">
                        <div class="column table-controls is-narrow-desktop is-half-touch">
                            <length-menu class="mr-1"
                                v-if="state.template.controls.includes('length')"/>
                            <column-visibility class="mr-1"
                                v-if="state.template.controls.includes('columns')"/>
                            <style-selector class="is-hidden-mobile mr-1"
                                v-if="state.template.controls.includes('style')"/>
                            <a class="button mr-1"
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
                                <control v-bind="controlBindings(button)"
                                    :key="`${button.label}-${button.icon}`"
                                    :button="button"
                                    v-on="controlEvents(button)"
                                    v-else-if="!button.selection"/>
                                <control v-bind="controlBindings(button)"
                                    :key="`${button.label}-${button.icon}`"
                                    :button="button"
                                    v-on="controlEvents(button)"
                                    v-else-if="hasSelection()"/>
                            </template>
                        </div>
                        <div class="column search">
                            <search ref="search"/>
                        </div>
                    </div>
                </div>
                <scenarios class="px-2"
                    v-if="filterScenarios"/>
                <labels class="px-2"
                    v-if="filterLabels"/>
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
import Labels from './filters/Labels.vue';
import Scenarios from './filters/Scenarios.vue';
import Control from './Control.vue';

library.add(faSync, faUndo, faSearch, faInfoCircle);

export default {
    name: 'Controls',

    components: {
        CoreControls,
        LengthMenu,
        ColumnVisibility,
        Control,
        StyleSelector,
        Search,
        Labels,
        Scenarios,
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

            .is-flex is-align-items-center {
                display:flex;
                align-items: center;
            }
        }
    }
</style>
