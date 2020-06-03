<template>
    <div class="labels field is-grouped is-grouped-multiline has-background-light">
        <div class="control"
            v-for="(filter, index) in activeScenario().filters"
            :key="label(filter).label() + index">
            <div class="tags has-addons">
                <a class="tag is-warning">
                    {{ label(filter).label() }} {{ label(filter).proposition() }}: {{ label(filter).value() }}
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
import Boolean from './Labels/Boolean.js';
import Enum from './Labels/Enum.js';
import String from './Labels/String.js';
import Select from './Labels/Select.js';
import Range from './Labels/Range.js';
library.add(faTimes);
export default {
    name: 'Labels',

    inject: ['activeScenario', 'i18n', 'state'],

    computed: {
        types() {
            return {
                'boolean': Boolean,
                'string': String,
                'enum': Enum,
                'select': Select,
                'money': Range,
                'date': Range,
            };
        },
    },
    methods: {
        clear(index) {
            this.activeScenario().filters.splice(index, 1);
        },
        label(filter) {
            if (this.types[filter.type]) {
                return new this.types[filter.type](filter, this.state);
            }

            throw Error;
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
