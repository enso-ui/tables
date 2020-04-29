<template>
    <div class="labels field is-grouped is-grouped-multiline has-background-light">
        <div class="control"
            v-for="(filter, index) in activeScenario().filters"
            :key="label(filter)">
            <div class="tags has-addons">
                <a class="tag is-warning">
                    {{ label(filter) }}
                </a>
                <a class="tag has-background-warning"
                    @click="clear(index)">
                    <span class="icon is-small">
                        <fa icon="times"/>
                    </span>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
library.add(faTimes);
export default {
    name: 'Labels',

    inject: ['activeScenario', 'i18n', 'state'],

    methods: {
        clear(index) {
            this.activeScenario().filters.splice(index, 1);
        },
        label(filter) {
            switch (filter.type) {
            case 'boolean':
                return this.boolean(filter);
            case 'string':
                return this.string(filter);
            case 'enum':
                return this.enum(filter);
            case 'select':
                return this.select(filter);
            case 'money':
            case 'date':
                return this.moneyOrDate(filter);
            default:
                throw Error;
            }
        },
        boolean(filter) {
            const value = filter.value ? this.i18n('true') : this.i18n('false');
            return `${filter.label} ${this.i18n('is')}: ${value}`;
        },
        enum(filter) {
            const column = this.state.template.columns.find(({ data }) => data === filter.data);
            const preposition = filter.value.length > 1 ? this.i18n('in') : this.i18n('is');
            const value = filter.value.map(value => column.enum._get(value)).join(', ');

            return `${filter.label} ${preposition}: ${value}`;
        },
        string(filter) {
            return `${filter.label} ${this.searchMode(filter.mode)}: ${filter.value}`;
        },
        select(filter) {
            const preposition = filter.multiple && filter.value.length > 1
                ? this.i18n('in')
                : this.i18n('is');

            return `${filter.label} ${preposition}: ${filter.selection}`;
        },
        moneyOrDate(filter) {
            let value, preposition;
            if (filter.mode === 'interval') {
                if (filter.value.min !== null && filter.value.max !== null) {
                    value = `${filter.value.min} ${this.i18n('and')} ${filter.value.max}`;
                    preposition = this.i18n('is between');
                } else if (filter.value.min !== null) {
                    value = filter.value.min;
                    preposition = this.i18n('is greater than');
                } else {
                    value = filter.value.max;
                    preposition = this.i18n('is lower than');
                }
            } else {
                value = filter.value;
                preposition = this.i18n('is');
            }

            return `${filter.label} ${preposition}: ${value}`;
        },
        searchMode(mode) {
            switch (mode) {
            case 'full':
                return this.i18n('contains');
            case 'startsWith':
                return this.i18n('starts with');
            case 'endsWith':
                return this.i18n('ends with');
            case 'doesntContain':
                return this.i18n('does not contain');
            case 'exactMatch':
                return this.i18n('is');
            default:
                throw Error;
            }
        },
    },
};
</script>

<style lang="scss">
    .labels {
        a.tag:hover {
            text-decoration: none;
        }
    }
</style>
