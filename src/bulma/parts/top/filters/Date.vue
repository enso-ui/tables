<template>
    <div class="date-filter">
        <div class="has-text-centered">
            <a class="button is-small is-bold"
                :class="{ 'is-success': filter.mode !== 'interval'}"
                @click="filter.mode = null; filter.value = null">
                {{ i18n('Value') }}
            </a>
            <a class="button is-small is-bold ml-2"
                :class="{ 'is-success': filter.mode === 'interval'}"
                @click="filter.mode = 'interval'; filter.value = interval()">
                {{ i18n('Interval') }}
            </a>
        </div>
        <div class="mt-2"
            v-if="filter.mode === 'interval'">
            <div class="level">
                <div class="level-left">
                    <div class="level-item">
                        <datepicker alt-input
                            :placeholder="i18n('Min')"
                            :alt-format="state.template.dateFormat || ''"
                            v-focus
                            v-model="filter.value.min"/>
                    </div>
                </div>
                <div class="level-right">
                    <div class="level-item">
                        <datepicker alt-input
                            :placeholder="i18n('Max')"
                            :alt-format="state.template.dateFormat"
                            v-model="filter.value.max"/>
                    </div>
                </div>
            </div>
        </div>
        <datepicker class="mt-2"
            alt-input
            :placeholder="i18n('Filter')"
            :alt-format="state.template.dateFormat"
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

    directives: { focus },

    components: { Datepicker },

    inject: ['i18n', 'state'],

    props: {
        edit: {
            type: Boolean,
            default: false,
        },
        filter: {
            type: Object,
            required: true,
        },
    },

    computed: {
        applicable() {
            return typeof this.filter.value === 'object' && !!this.filter.value
                ? !!this.filter.value.min || !!this.filter.value.max
                : !!this.filter.value;
        },
    },

    created() {
        if (this.edit) {
            const { value } = this.filter;
            this.filter.mode = value && (value.min || value.max) ? 'interval' : 'value';
        } else {
            this.filter.type = 'date';
        }
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
    .date-filter {
        .level-left, .level-right {
            width: 49%;
            .level-item {
                width: 100%;
            }
        }
    }
</style>
