<template>
    <div class="money-filter">
        <div class="has-text-centered">
            <a class="button is-small is-bold"
                :class="{ 'is-success': filter.mode !== 'interval'}"
                @click="filter.mode = null; filter.value = null">
                {{ i18n('Value') }}
            </a>
            <a class="button is-small is-bold has-margin-left-medium"
                :class="{ 'is-success': filter.mode === 'interval'}"
                @click="filter.mode = 'interval'; filter.value = interval()">
                {{ i18n('Interval') }}
            </a>
        </div>
        <div class="has-margin-top-medium"
            v-if="filter.mode === 'interval'">
            <div class="level">
                <div class="level-left">
                    <div class="level-item">
                        <datepicker :placeholder="i18n('Min')"
                            v-focus
                            v-model="filter.value.min"/>
                    </div>
                </div>
                <div class="level-right">
                    <div class="level-item">
                        <datepicker :placeholder="i18n('Max')"
                            v-model="filter.value.max"/>
                    </div>
                </div>
            </div>
        </div>
        <datepicker class="has-margin-top-medium"
            :placeholder="i18n('Filter')"
            v-focus
            v-model="filter.value"
            v-else/>
    </div>
</template>

<script>
import { Datepicker } from '@enso-ui/datepicker/bulma';
import { focus } from '@enso-ui/directives';

export default {
    name: 'Date',

    directives:{ focus },

    components: { Datepicker },

    inject: ['i18n', 'state'],

    props: {
        filter: {
            type: Object,
            required: true,
        },
    },

    computed: {
        applicable() {
            return typeof this.filter.value === 'object' && !!this.filter.value
                ? !!this.filter.value.min || !!this.filter.value.max
                : !!this.filter.value
        },
    },

    created() {
        this.filter.type = 'date';
        this.filter.value = null;
        this.filter.mode = 'value';
    },

    methods: {
        interval() {
            return {
                min: null,
                max: null,
            };
        },
    },
};
</script>

<style lang="scss">
    .money-filter {
        .level-left, .level-right {
            width: 49%;
            .level-item {
                width: 100%;
            }
        }
    }
</style>