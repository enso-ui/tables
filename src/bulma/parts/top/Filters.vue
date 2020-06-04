<template>
    <div class="field is-grouped">
        <dropdown class="filters"
            :class="{ 'has-select': hasSelect, 'has-filter': filter }"
            manual
            @hide="reset"
            ref="dropdown">
            <template v-slot:label>
                <span class="icon">
                    <fa icon="filter"/>
                </span>
            </template>
            <template v-slot:controls>
                <template v-if="filter">
                    <div class="level is-marginless">
                        <div class="level-item">
                            <span class="tag is-bold is-info">
                                {{ i18n('Filter') }}: {{ i18n(filter.label) }}
                            </span>
                        </div>
                        <div class="level-item">
                            <a class="button is-small is-bold"
                                @click.stop="filter = null;">
                                {{ i18n('Clear') }}
                            </a>
                            <a class="button is-small is-bold"
                                @click.stop="apply"
                                v-if="$refs.filter && $refs.filter.applicable">
                                {{ i18n('Apply') }}
                            </a>
                        </div>
                    </div>
                    <hr class="is-dropdown-divider has-margin-medium">
                </template>
            </template>
            <template v-slot:items>
                <div class="has-padding-medium"
                    v-if="filter">
                    <component :is="filter.component"
                        :filter="filter"
                        ref="filter"/>
                </div>
                <dropdown-item v-for="filter in filters"
                    :key="filter.name"
                    @click.native.stop="select(filter)"
                    v-else>
                    {{ i18n(filter.label) }}
                </dropdown-item>
            </template>
        </dropdown>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, DropdownItem } from '@enso-ui/dropdown/bulma';
import Boolean from './filters/Boolean.vue';
import String from './filters/String.vue';
import Enum from './filters/Enum.vue';
import Money from './filters/Money.vue';
import Date from './filters/Date.vue';
import CustomSelect from './filters/CustomSelect.vue';
import {clickOutside} from "@enso-ui/directives";

library.add(faFilter);

export default {
    name: 'Filters',

    directives: { clickOutside },

    components: {
        Dropdown, DropdownItem, Boolean, String, Enum, Money, Date, CustomSelect,
    },

    inject: ['activeScenario', 'i18n', 'state'],

    data: () => ({
        filter: null,
    }),

    computed: {
        hasSelect() {
            return this.filter
                && ['enum', 'select'].includes(this.filter.type);
        },
        customs() {
            return this.state.template.filters.map(filter => {
                return {
                    ...filter,
                    component: this.component(filter),
                };
            });
        },
        columns() {
            return this.state.template.columns
                .filter(({ meta }) => meta.filterable)
                .map(column => {
                    return this.filterFactory(column);
                });
        },
        filters () {
            return [
                ...this.customs,
                ...this.columns,
            ];
        }
    },

    methods: {
        type(column) {
            if (column.meta.boolean) {
                return 'boolean';
            }

            if (column.meta.date || column.meta.datetime) {
                return 'date';
            }

            if (column.enum) {
                return 'enum';
            }

            if (column.money) {
                return 'money';
            }

            return 'string';
        },
        component(column) {
            const type = column.type || this.type(column);

            return type === 'select'
                ? 'custom-select'
                : type;
        },
        apply() {
            this.transform();
            this.addFilter();
            this.reset();
        },
        transform() {
            if (this.$refs.filter.transform) {
                this.$refs.filter.transform();
            }
        },
        addFilter() {
            if (!this.activeScenario()) {
                this.state.filterScenarios.push(this.scenarioFactory());
            }

            if (!this.activeScenario().edit) {
                this.activeScenario().active = false;
                this.state.filterScenarios.push(this.scenarioFactory());
            }

            this.activeScenario().filters.push({...this.filter});
        },
        filterFactory(column) {
            return {
                label: column.label,
                data: column.data,
                mode: null,
                value: null,
                type: this.type(column),
                component: this.component(column),
            };
        },
        scenarioFactory() {
            return {
                name: this.i18n('new scenario'),
                active: true,
                edit: true,
                filters: [],
            };
        },
        select(filter) {
            this.filter = filter;
        },
        reset() {
            this.$refs.dropdown.hide();
            this.filter = null;
        },
    },
};
</script>

<style lang="scss">
    .vue-table .filters.dropdown {
        > .dropdown-menu > .dropdown-content {
            width: 12em;

            ul.filters > li {
                padding: 0.2em 0.4em;
            }

            .items {
                max-height: 250px;
                overflow: scroll;

                .dropdown-item {
                    padding: .5em .8em;
                }
            }
        }

        &.has-filter > .dropdown-menu > .dropdown-content {
            width: 24em;
        }

        &.has-select > .dropdown-menu > .dropdown-content > .items {
            overflow: visible;
        }
    }
</style>
