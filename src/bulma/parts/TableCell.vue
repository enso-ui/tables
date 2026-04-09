<template>
    <slot v-if="meta.slot"
        :name="column.name">
        <span>
            {{ modelValue }}
        </span>
    </slot>
    <span :class="cssClass"
        @click="meta.clickable ? $emit('clicked') : null"
        v-else>
        <fa :icon="modelValue ? faCheck : faXmark"
            size="sm"
            v-if="meta.boolean"/>
        <fa :icon="modelValue"
            v-else-if="meta.icon && modelValue"/>
        <template v-else-if="column.enum">
            {{ column.enum._get(modelValue) }}
        </template>
        <template v-else-if="meta.translatable">
            {{ i18n(modelValue) }}
        </template>
        <template v-else>{{ modelValue }}</template>
    </span>
</template>

<script>
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

export default {
    name: 'TableCell',

    components: { Fa },

    inject: ['i18n'],

    data: () => ({
        faCheck,
        faXmark,
    }),

    props: {
        column: {
            required: true,
            type: Object,
        },
        hiddenControls: {
            default: false,
            type: Boolean,
        },
        modelValue: {
            required: true,
            type: null,
        },
    },

    emits: ['clicked'],

    computed: {
        cssClass() {
            return [this.boolean, this.clickable, this.icon]
                .filter(v => v).join(' ');
        },
        boolean() {
            return this.meta.boolean && !this.meta.slot
                ? ['tag icon', this.modelValue ? 'is-success' : 'is-danger']
                    .join(' ')
                : null;
        },
        clickable() {
            return this.meta.clickable
                ? 'is-clickable has-text-info'
                : null;
        },
        icon() {
            return this.meta.icon
                ? 'icon is-small'
                : null;
        },
        meta() {
            return this.column.meta;
        },
    },
};
</script>
