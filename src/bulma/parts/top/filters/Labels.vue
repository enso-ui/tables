<template>
    <div class="labels field is-grouped is-grouped-multiline has-background-light">
        <div class="control"
            v-for="(internalFilter, index) in activeScenario().filters"
            :key="`${internalFilter} ${index}`"
            v-click-outside.deep="() => hide(index)">
            <label-filter :filter="internalFilter"
                @select="select(internalFilter, index)"
                @delete="clear(index)"/>
            <div class="filter-container dropdown-content" v-if="selectedIndex === index">
                <component
                    :is="filter.component"
                    :filter="filter"
                    :is-edit="true"
                    :ref="`filter-${index}`"/>
            </div>
        </div>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import Boolean from './Boolean.vue';
import String from './String.vue';
import Enum from './Enum.vue';
import Money from './Money.vue';
import Date from './Date.vue';
import LabelFilter from './Label.vue';
import CustomSelect from './CustomSelect.vue';
import {clickOutside} from "@enso-ui/directives";

library.add(faTimes);
export default {
    name: 'Labels',

    directives: { clickOutside },

    inject: ['activeScenario', 'i18n', 'state'],

    data: () => ({
       filter: null,
       selectedIndex: null,
    }),

    components: {
        Boolean, String, Enum, Money, Date, CustomSelect, LabelFilter
    },

    methods: {
        clear(index) {
            this.activeScenario().filters.splice(index, 1);
            this.reset();
        },
        select(filter, index) {
            this.filter = JSON.parse(JSON.stringify(filter));
            this.selectedIndex = index;
        },
        hide(index) {
            if (index !== this.selectedIndex) {
                return;
            }

            if (this.applicable(index)) {
                this.transform(index);
                this.activeScenario().filters.splice(this.selectedIndex, 1, this.filter);
            }

            this.reset();
        },
        transform(index) {
            const component = this.$refs[`filter-${index}`][0];

            if (component.transform) {
                component.transform();
            }
        },
        applicable(index) {
            const component = this.$refs[`filter-${index}`][0];

            return component.applicable;
        },
        reset() {
            this.selectedIndex = null;
            this.filter = null;
        }
    },
};
</script>

<style lang="scss">
    .labels {
        a.tag:hover {
            text-decoration: none;
        }
        .filter-container{
            position: absolute;
            top: 1.5em;
            z-index: 100;
            padding: 1em;
            min-width: 18em;
            max-width: 24em;
            width: 100%;
        }
    }
</style>
