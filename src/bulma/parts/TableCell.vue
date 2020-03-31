<template>
    <span :class="[boolean, clickable, icon]"
        @click="column.meta.clickable ? $emit('clicked') : null">
        <slot v-if="column.meta.slot"
            :name="column.name">
            {{ value }}
        </slot>
        <fa :icon="value ? 'check' : 'times'"
            size="sm"
            v-else-if="column.meta.boolean"/>
        <fa :icon="value"
            v-else-if="column.meta.icon && value"/>
        <template v-else-if="column.enum">
            {{ column.enum._get(value) }}
        </template>
        <template v-else-if="column.meta.translatable">
            {{ i18n(value) }}
        </template>
        <template v-else>{{ value }}</template>
    </span>
</template>

<script>
export default {
    name: 'TableCell',

    inject: ['i18n'],

    props: {
        column: {
            required: true,
            type: Object,
        },
        hiddenControls: {
            default: false,
            type: Boolean,
        },
        value: {
            required: true,
            type: null,
        },
    },

    computed: {
        boolean() {
            return this.column.meta.boolean
                ? ['tag is-table-tag icon', this.value ? 'is-success' : 'is-danger']
                : null;
        },
        clickable() {
            return this.column.meta.clickable
                ? 'is-clickable has-text-info'
                : null;
        },
        icon() {
            return this.column.meta.icon
                ? 'icon is-small'
                : null;
        },
    },
};
</script>

<style lang="scss">
    .is-clickable {
        cursor: pointer;
    }

    .tag.is-table-tag {
        padding: 0 5px;
        font-size: 0.8rem;
        font-weight: bold;
        height: 1.4em;
        -webkit-box-shadow: 0 1px 1px rgba(10, 10, 10, 0.2);
        box-shadow: 0 1px 1px rgba(10, 10, 10, 0.2);
    }
</style>
