<template>
    <div class="field has-addons">
        <core-search>
            <template #default="{
                clearEvents, hasFilters, filterable, modeBindings, modeEvents, i18n,
                modeSelector, search, searchable, searchBindings, searchEvents,
            }">
                <filters v-if="filterable"/>
                <p class="control is-expanded has-icons-left has-icons-right"
                    v-if="searchable">
                    <input class="input table-search-input has-text-centered"
                        v-bind="searchBindings"
                        type="text"
                        v-on="searchEvents"
                        :placeholder="i18n('Search')">
                    <span class="icon is-small is-left has-text-muted has-active-filters"
                        v-if="hasFilters()">
                        <fa :icon="faFilter"/>
                    </span>
                    <span class="icon is-small is-left has-text-muted"
                        v-else>
                        <fa :icon="faSearch"/>
                    </span>
                    <span class="is-right icon is-small has-text-muted is-clickable"
                        v-if="search">
                        <a class="delete is-small"
                            v-on="clearEvents"/>
                    </span>
                    <search-mode class="is-right is-small has-text-muted global-search-mode"
                        v-bind="modeBindings"
                        v-on="modeEvents"
                        v-if="modeSelector"/>
                </p>
            </template>
        </core-search>
    </div>
</template>

<script>
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import SearchMode from '@enso-ui/search-mode/bulma';
import CoreSearch from '../../../renderless/parts/top/CoreSearch.vue';
import Filters from './Filters.vue';

export default {
    name: 'Search',

    components: {
        CoreSearch, Fa, Filters, SearchMode,
    },

    data: () => ({
        faFilter,
        faSearch,
    }),
};
</script>
