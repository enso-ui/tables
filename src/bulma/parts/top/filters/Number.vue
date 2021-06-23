<template>
    <div class="number-filter">
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
                        <input class="input"
                            :placeholder="i18n('Min')"
                            v-focus
                            v-model.number="filter.value.min">
                    </div>
                </div>
                <div class="level-right">
                    <div class="level-item">
                        <input class="input"
                            :placeholder="i18n('Max')"
                            v-model.number="filter.value.max">
                    </div>
                </div>
            </div>
        </div>
        <input class="input mt-2"
            :placeholder="i18n('Filter')"
            v-focus
            v-model.number="filter.value"
            v-else>
    </div>
</template>

<script>
import { focus } from '@enso-ui/directives';

export default {
    name: 'Number',

    directives: { focus },

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
            const invalid = ['', null];

            return typeof this.filter.value === 'object' && this.filter.value !== null
                ? !invalid.includes(this.filter.value.min) || !invalid.includes(this.filter.value.max)
                : !invalid.includes(this.filter.value);
        },
    },

    created() {
        if (!this.edit) {
            this.filter.type = 'number';
            this.filter.value = null;
            this.filter.mode = 'value';
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
    .number-filter {
        .level-left, .level-right {
            width: 49%;
            .level-item {
                width: 100%;
            }
        }
    }
</style>
