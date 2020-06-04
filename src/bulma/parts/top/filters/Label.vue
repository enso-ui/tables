<template>
    <div class="tags has-addons">
        <a class="tag is-warning"
           @click="$emit('select')">
            {{ label }} {{ proposition }}: {{ value }}
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
import Boolean from './Labels/Boolean.js';
import Enum from './Labels/Enum.js';
import String from './Labels/String.js';
import Select from './Labels/Select.js';
import Range from './Labels/Range.js';
import {clickOutside} from "@enso-ui/directives";

library.add(faTimes);
export default {
    name: 'Label',

    inject: ['i18n', 'state'],
    props: {
        filter: {
            type: Object,
            required: true,
        },
    },
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
        formatter() {
            if (this.types[this.filter.type]) {
                return new this.types[this.filter.type](this.filter, this.state, this.i18n);
            }

            throw Error;
        },
        label() {
            return this.formatter.label();
        },
        proposition() {
            return this.i18n(this.formatter.proposition());
        },
        value() {
            return this.i18n(this.formatter.value());
        },
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
            top: 20px;
            z-index: 1000;
            padding: 10px;
            min-width: 250px;
            max-width: 375px;
            width: 100%;
        }
    }
</style>
