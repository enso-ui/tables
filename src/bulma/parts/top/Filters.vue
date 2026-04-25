<template>
    <div class="control">
        <dropdown class="filters table-filters table-dropdown"
            :class="{ 'has-select': hasSelect, 'has-filter': filter }"
            manual
            @hide="close"
            ref="dropdown">
            <template #label>
                <span class="icon">
                    <fa :icon="faFilter"/>
                </span>
            </template>
            <template #controls>
                <template v-if="filter">
                    <div class="level mb-0">
                        <div class="level-left">
                            <div class="level-item mx-2">
                                <span class="tag">
                                    {{ i18n('Filter') }}: {{ i18n(filter.label) }}
                                </span>
                            </div>
                        </div>
                        <div class="level-right">
                            <div class="level-item"
                                v-if="ready">
                                <a class="button is-small is-naked"
                                    @click.stop="apply"
                                    v-if="$refs.filter.applicable">
                                    <span class="icon">
                                        <fa icon="check"/>
                                    </span>
                                </a>
                            </div>
                            <div class="level-item">
                                <a class="button is-naked is-small"
                                    @click.stop="filter = null; ready = false;">
                                    <span class="icon">
                                        <fa icon="xmark"/>
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <hr class="is-dropdown-divider m-2">
                </template>
            </template>
            <template #items>
                <div class="p-2"
                    v-if="filter">
                    <component :is="filter.component"
                        :filter="filter"
                        @vue:mounted="ready = true"
                        ref="filter"/>
                </div>
                <dropdown-item v-for="item in filters"
                    :key="item.name"
                    @click.stop="select(item)"
                    v-else>
                    {{ i18n(item.label) }}
                </dropdown-item>
            </template>
        </dropdown>
    </div>
</template>

<script>
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import { faFilter, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, DropdownItem } from '@enso-ui/dropdown/bulma';
import Boolean from './filters/Boolean.vue';
import String from './filters/String.vue';
import Enum from './filters/Enum.vue';
import Number from './filters/Number.vue';
import Date from './filters/Date.vue';
import CustomSelect from './filters/CustomSelect.vue';

export default {
    name: 'Filters',

    components: {
        Boolean,
        CustomSelect,
        Date,
        Dropdown,
        DropdownItem,
        Enum,
        Fa,
        Number,
        String,
    },

    inject: ['activeScenario', 'i18n', 'state'],

    data: () => ({
        faFilter,
        ready: false,
        filter: null,
    }),

    computed: {
        custom() {
            return this.state.template.filters?.map(filter => ({
                ...filter, component: this.component(filter),
            })) || [];
        },
        dynamic() {
            return this.state.template.columns
                .filter(({ meta }) => meta.filterable)
                .map(column => this.filterFactory(column));
        },
        filters() {
            return [...this.custom, ...this.dynamic];
        },
        hasSelect() {
            return this.filter
                && ['enum', 'select'].includes(this.filter.type);
        },
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

            if (column.number) {
                return 'number';
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
            this.close();
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

            this.activeScenario().filters.push(JSON.parse(JSON.stringify(this.filter)));
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
        close() {
            this.$refs.dropdown.hide();
            this.ready = false;
            this.filter = null;
            this.filters
                .forEach(filter => (filter.value = Array.isArray(filter.value) ? [] : null));
        },
    },
};
</script>

<style lang="scss">
.filters.dropdown {
    .field.has-addons > .control:first-child:not(:only-child) & {
        .dropdown-menu {
            .button.input,
            .input,
            .select select {
                border-start-end-radius: var(--bulma-radius);
                border-end-end-radius: var(--bulma-radius);
            }
        }
    }

    > .dropdown-menu > .dropdown-content {
        width: 12em;

        ul.filters > li {
            padding: 0.2em 0.4em;
        }

        .items {
            max-height: 250px;
            overflow: scroll;

            .dropdown-item {
                padding: 0.5em 0.8em;
            }
        }
    }

    &.has-filter > .dropdown-menu > .dropdown-content {
        width: 24em;
    }

    &.has-select > .dropdown-menu > .dropdown-content > .items {
        overflow: visible;
    }

    .dropdown-menu {
        .button.input,
        .input {
            border-radius: var(--bulma-radius);
        }
    }
}
</style>
