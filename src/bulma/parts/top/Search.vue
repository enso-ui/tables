<template>
    <core-search>
        <template v-slot:default="{
                clearEvents, filterable, modeBindings, modeEvents, i18n, modeSelector,
                search, searchable, searchBindings, searchEvents,
            }">
            <div class="field has-addons">
                <filters v-if="filterable"/>
                <p class="control is-expanded has-icons-left has-icons-right"
                    v-if="searchable">
                    <input class="input has-text-centered"
                        v-bind="searchBindings"
                        type="text"
                        v-on="searchEvents"
                        :placeholder="i18n('Search')">
                    <span class="icon is-small is-left">
                        <fa icon="search"/>
                    </span>
                    <span class="is-right icon is-small"
                        v-if="search">
                        <a class="delete is-small"
                            v-on="clearEvents"/>
                    </span>
                    <search-mode class="is-right is-small global-search-mode"
                        v-bind="modeBindings"
                        v-on="modeEvents"
                        v-if="modeSelector"/>
                </p>
            </div>
        </template>
    </core-search>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import SearchMode from '@enso-ui/search-mode/bulma';
import CoreSearch from '../../../renderless/parts/top/CoreSearch.vue';
import Filters from './Filters.vue';

library.add(faSearch);

export default {
    name: 'Controls',

    components: { CoreSearch, Filters, SearchMode },
};
</script>

<style lang="scss">
    .vue-table .top-controls {
        .is-right.icon {
            pointer-events: all;

            &.global-search-mode {
                right: 1.6em;
            }
        }
    }
</style>
