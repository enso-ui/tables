<template>
    <dropdown class="table-filters"
        manual
        @hide="reset">
        <template v-slot:label>
            <span class="icon">
                <fa icon="filter"/>
            </span>
        </template>
        <template v-slot:controls
            v-if="mode === 'column'">
            <div class="has-padding-medium-bottom has-text-centered">
                <button class="button"
                    @click.stop="reset">
                    {{ i18n('Back') }}
                </button>
                <button class="button"
                    @click.stop="apply"
                    v-if="applicable">
                    {{ i18n('Apply') }}
                </button>
            </div>
            <hr class="dropdown-divider">
        </template>
        <template v-slot:items>
            <ul class="filters"
                v-if="!mode">
                <li>
                    <button class="button is-fullwidth"
                        @click.stop="mode = 'column'">
                        {{ i18n('Columns') }}
                    </button>
                </li>
                <li>
                    <button class="button is-fullwidth">
                        {{ i18n('Custom') }}
                    </button>
                </li>
            </ul>
            <dropdown-item v-for="column in filterable"
                :key="column.name"
                v-else-if="mode === 'column' && !column"
                @click.native.stop="select(column)">
                {{ i18n(column.label) }}
            </dropdown-item>
            <template v-else-if="column">
                <dropdown-item>
                    <div class="level">
                        <div class="level-left">
                            <div class="level-item">
                                {{ column.label }}
                            </div>
                        </div>
                        <div class="level-right">
                            <div class="level-item">
                                <a class="delete is-small"
                                    @click.stop="column = null"/>
                            </div>
                        </div>
                    </div>
                </dropdown-item>
                <dropdown-item>
                    <label type="checkbox"
                        v-if="isBoolean">
                        {{ i18n('Value') }}
                        <input type="checkbox"
                            v-model="filter.value">
                    </label>
                    <p class="control is-expanded has-icons-right"
                        v-if="isString">
                        <input class="input"
                            v-focus
                            v-model="filter.value"
                            ref="input">
                        <search-mode class="is-right is-small individual-search-mode"
                            v-model="filter.mode"
                            :modes="state.template.searchModes"
                            :query="filter.value"
                            @input="$refs.input.focus()"
                            v-if="filter.value"/>
                    </p>
                </dropdown-item>
            </template>
        </template>
    </dropdown>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { focus } from '@enso-ui/directives';
import { Dropdown, DropdownItem } from '@enso-ui/dropdown/bulma';
import SearchMode from '@enso-ui/search-mode/bulma';

library.add(faFilter);

export default {
    name: 'Filters',

    directives: { focus },

    components: { Dropdown, DropdownItem, SearchMode },

    inject: ['filterableColumns', 'i18n', 'state'],

    data: () => ({
        column: null,
        mode: null,
        filter: null,
    }),

    computed: {
        applicable() {
            return this.filter && !['', null].includes(this.filter.value);
        },
        filterable() {
            return this.state.template.columns
                .filter(({ meta }) => meta.filterable);
        },
        isBoolean() {
            return this.column && this.column.meta.boolean;
        },
        isDate() {
            return this.column && (this.column.meta.date || this.column.meta.datetime);
        },
        isEnum() {
            return this.column && this.column.enum;
        },
        isIcon() {
            return this.column && this.column.meta.icon;
        },
        isMoney() {
            return this.column && this.column.money;
        },
        isString() {
            return this.column && !this.isBoolean && !this.isDate && !this.isEnum
                && !this.isIcon && !this.isMoney;
        },
    },

    methods: {
        apply() {
            this.state.filters.push(this.filter);
            this.reset();
        },
        configure(filter) {
            this.column = this.filterableColumns().find(({ data }) => data === filter.data);
            this.filter = filter;
            this.mode = 'column';
        },
        select(selected) {
            this.column = selected;
            
            this.filter = this.factory();

            if (this.isBoolean) {
                this.filter.type = 'boolean';
                this.filter.value = true;
            }
            
            if (this.isString) {
                this.filter.type = 'string';
                this.filter.value = '';
                this.filter.mode = 'full';
            }
        },
        reset() {
            this.mode = null;
            this.column = null;
            this.filter = null;
        },
        factory() {
            return {
                label: this.column.label,
                data: this.column.data,
                mode: null,
                value: null,
                type: null,
            };
        }
    },
};
</script>

<style lang="scss">
    .table-filters.dropdown {
        .dropdown-content {
            width: 20em;
            
            ul.filters > li {
                padding: 0.2em 0.6em;
            }

            .items {
                max-height: 250px;

                .dropdown-item {
                    padding: .5em .8em;
                }
            }
        }

        .is-right.icon {
            pointer-events: all;

            &.individual-search-mode {
                right: 0.3em;
            }
        }
    }
</style>