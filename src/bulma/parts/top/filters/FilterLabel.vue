<template>
    <div class="tags has-addons">
        <a class="tag is-warning"
           @click="$emit('select')">
            {{ label }} {{ preposition }}: {{ value }}
        </a>
        <a class="tag has-background-warning"
           @click="$emit('delete')">
            <span class="icon is-small">
                <fa icon="times"/>
            </span>
        </a>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
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

library.add(faTimes);

export default {
    name: 'FilterLabel',

    inject: ['i18n', 'state'],

    props: {
        filter: {
            type: Object,
            required: true,
        },
    },
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
