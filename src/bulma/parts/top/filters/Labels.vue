<template>
    <div class="labels field is-grouped is-grouped-multiline has-background-light">
        <div class="control"
            v-for="(filter, index) in activeScenario().filters"
            :key="`${filter.type}-${index}`"
            v-click-outside="() => hide(index)">
            <filter-label :filter="filter"
                @select="select(filter, index)"
                @delete="clear(index)"/>
            <div class="filter-container dropdown-content p-2"
                v-if="selectedIndex === index">
                <component :is="selectedFilter.component"
                    edit
                    :filter="selectedFilter"
                    :ref="`filter-${index}`"/>
            </div>
        </div>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { clickOutside } from '@enso-ui/directives';
import Boolean from './Boolean.vue';
import String from './String.vue';
import Enum from './Enum.vue';
import Number from './Number.vue';
import Date from './Date.vue';
import FilterLabel from './FilterLabel.vue';
import CustomSelect from './CustomSelect.vue';

library.add(faTimes);

export default {
    name: 'Labels',

    directives: { clickOutside },

    components: {
        Boolean, String, Enum, Number, Date, CustomSelect, FilterLabel,
    },

    inject: ['activeScenario', 'i18n', 'state'],

    data: () => ({
        selectedFilter: null,
        selectedIndex: null,
    }),

    methods: {
        applicable(index) {
            const component = this.$refs[`filter-${index}`][0];

            return component.applicable;
        },
        clear(index) {
            this.activeScenario().filters.splice(index, 1);
            this.reset();
        },
        hide(index) {
            if (index !== this.selectedIndex) {
                return;
            }

            if (this.applicable(index)) {
                this.transform(index);
                this.activeScenario().filters.splice(this.selectedIndex, 1, this.selectedFilter);
            }

            this.reset();
        },
        reset() {
            this.selectedIndex = null;
            this.selectedFilter = null;
        },
        select(filter, index) {
            this.selectedFilter = JSON.parse(JSON.stringify(filter));
            this.selectedIndex = index;
        },
        transform(index) {
            const component = this.$refs[`filter-${index}`][0];

            if (typeof component.transform === 'function') {
                component.transform();
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

        .filter-container {
            position: absolute;
            top: 1.7em;
            z-index: 100;
            min-width: 18em;
            max-width: 24em;
            width: 100%;
        }
    }
</style>
