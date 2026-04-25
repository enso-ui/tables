<template>
    <div class="tags has-addons">
        <a class="tag"
           @click="$emit('select')">
            {{ label }} {{ preposition }}&nbsp;<span class="has-text-weight-bold">{{ value }}</span>
        </a>
        <a class="tag"
           @click="$emit('delete')">
            <span class="icon is-small">
                <fa :icon="faXmark"/>
            </span>
        </a>
    </div>
</template>

<script>
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Boolean from './Labels/Boolean';
import Enum from './Labels/Enum';
import String from './Labels/String';
import Select from './Labels/Select';
import Range from './Labels/Range';
import Date from './Labels/Date';

const Types = {
    boolean: Boolean,
    string: String,
    enum: Enum,
    select: Select,
    number: Range,
    date: Date,
};

export default {
    name: 'FilterLabel',

    components: { Fa },

    inject: ['i18n', 'state'],

    data: () => ({
        faXmark,
    }),

    props: {
        filter: {
            type: Object,
            required: true,
        },
    },

    emits: ['delete', 'select'],

    computed: {
        formatter() {
            if (!Types[this.filter.type]) {
                throw Error;
            }

            const filter = new Types[this.filter.type](this.filter);

            if (typeof filter.state === 'function') {
                filter.state(this.state);
            }

            if (typeof filter.i18n === 'function') {
                filter.i18n(this.i18n);
            }

            return filter;
        },
        label() {
            return this.formatter.label();
        },
        preposition() {
            return this.i18n(this.formatter.preposition());
        },
        value() {
            return this.i18n(this.formatter.value());
        },
    },
};
</script>
