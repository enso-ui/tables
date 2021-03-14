<template>
    <span :class="cssClass"
        @click="meta.clickable ? $emit('clicked') : null">
        <slot v-if="meta.slot"
            :name="column.name">
            {{ value }}
        </slot>
        <fa :icon="value ? 'check' : 'times'"
            size="sm"
            v-else-if="meta.boolean"/>
        <fa :icon="value"
            v-else-if="meta.icon && value"/>
        <template v-else-if="column.enum">
            {{ column.enum._get(value) }}
        </template>
        <template v-else-if="meta.translatable">
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
        cssClass() {
            return [this.boolean, this.clickable, this.icon]
                .filter(v => v).join(' ');
        },
        boolean() {
            return this.meta.boolean && !this.meta.slot
                ? ['tag is-table-tag icon', this.value ? 'is-success' : 'is-danger']
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
