<template>
    <div class="field is-grouped">
        <dropdown class="filters"
            :class="{ 'has-select': hasSelect, 'has-filter': filter || custom }"
            manual
            @hide="reset"
            ref="dropdown">
            <template v-slot:label>
                <span class="icon">
                    <fa icon="filter"/>
                </span>
            </template>
            <template v-slot:controls>
                <div class="has-text-centered"
                    v-if="mode && !column && !custom">
                    <button class="button is-small is-bold"
                        @click.stop="reset">
                        {{ i18n('Back') }}
                    </button>
                    <hr class="is-dropdown-divider has-margin-medium">
                </div>
                <ul class="filters"
                    v-else-if="!column && !custom">
                    <li v-if="filterable.length">
                        <button class="button is-fullwidth"
                            @click.stop="mode = 'column'">
                            {{ i18n('Columns') }}
                        </button>
                    </li>
                    <li v-if="state.template.filters">
                        <button class="button is-fullwidth"
                            @click.stop="mode = 'custom'">
                            {{ i18n('Custom') }}
                        </button>
                    </li>
                </ul>
                <template v-else-if="column || custom">
                    <div class="level is-marginless">
                        <div class="level-item">
                            <span class="tag is-bold is-info"
                                v-if="column">
                                {{ i18n('Column') }}: {{ i18n(column.label) }}
                            </span>
                            <span class="tag is-bold is-info"
                                v-else>
                                {{ i18n('Filter') }}: {{ i18n(custom.label) }}
                            </span>
                        </div>
                        <div class="level-item">
                            <a class="button is-small is-bold"
                                @click.stop="column = null; filter = null; custom = null">
                                {{ i18n('Clear') }}
                            </a>
                            <a class="button is-small is-bold"
                                @click.stop="apply"
                                v-if="$refs.filter && $refs.filter.applicable || $refs.custom && $refs.custom.applicable">
                                {{ i18n('Apply') }}
                            </a>
                        </div>
                    </div>
                    <hr class="is-dropdown-divider has-margin-medium">
                </template>
            </template>
            <template v-slot:items>
                <template v-if="mode === 'column'">
                    <div class="has-padding-medium"
                        v-if="filter">
                        <component :is="filterComponent"
                            :filter="filter"
                            :column="column"
                            ref="filter"/>
                    </div>
                    <dropdown-item v-for="filterableColumn in filterable"
                        :key="filterableColumn.name"
                        @click.native.stop="select(filterableColumn)"
                        v-else>
                        {{ i18n(filterableColumn.label) }}
                    </dropdown-item>
                </template>
                <template v-else-if="mode === 'custom'">
                    <div class="has-padding-medium"
                        v-if="custom">
                        <component :is="customComponent"
                            :filter="custom"
                            ref="custom"/>
                    </div>
                    <dropdown-item v-for="filter in state.template.filters"
                        :key="filter.name"
                        @click.native.stop="custom = JSON.parse(JSON.stringify(filter))"
                        v-else>
                        {{ i18n(filter.label) }}
                    </dropdown-item>
                </template>
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

library.add(faFilter);

export default {
    name: 'Filters',

    components: {
        Dropdown, DropdownItem, Boolean, String, Enum, Money, Date, CustomSelect,
    },

    inject: ['activeScenario', 'i18n', 'state'],

    data: () => ({
        column: null,
        custom: null,
        mode: null,
        filter: null,
    }),

    computed: {
        filterComponent() {
            if (!this.column) {
                return null;
            }

            if (this.column.meta.boolean) {
                return 'boolean';
            } if (this.column.meta.date || this.column.meta.datetime) {
                return 'date';
            } if (this.column.enum) {
                return 'enum';
            } if (this.column.money) {
                return 'money';
            }

            return 'string';
        },
        customComponent() {
            if (!this.custom) {
                return;
            }

            switch (this.custom.type) {
            case 'select':
                return 'custom-select';
            case 'boolean':
                return 'custom-boolean';
            default:
                throw Error;
            }
        },
        filterable() {
            return this.state.template.columns
                .filter(({ meta }) => meta.filterable);
        },
        hasSelect() {
            return this.custom && this.custom.type === 'select'
                || this.filter && this.filter.type === 'enum';
        },
        isIcon() {
            return this.column && this.column.meta.icon;
        },
        isSelect() {
            return this.column && !!this.column.filter;
        },
    },

    methods: {
        apply() {
            if (!this.activeScenario()) {
                this.state.filterScenarios.push(this.scenarioFactory());
            } else if (!this.activeScenario().edit) {
                this.activeScenario().active = false;
                this.state.filterScenarios.push(this.scenarioFactory());
            }

            if (this.custom) {
                if (Array.isArray(this.custom.value)) {
                    this.custom.selection = this.custom.value.map(({ name }) => name).join(', ');
                    this.custom.value = this.custom.value.map(({ id }) => id);
                } else {
                    this.custom.selection = this.custom.value.name;
                }
            }

            this.activeScenario().filters.push(this.filter || this.custom);
            this.$refs.dropdown.hide();
            this.reset();
        },
        filterFactory() {
            return {
                label: this.column.label,
                data: this.column.data,
                mode: null,
                value: null,
                type: null,
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
        select(column) {
            this.column = column;
            this.filter = this.filterFactory();

            if (this.isSelect) {
                this.filter.type = 'select';
                this.filter.value = this.column.filter.multiple ? [] : null;
            }
        },
        reset() {
            this.mode = null;
            this.column = null;
            this.filter = null;
            this.custom = null;
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
