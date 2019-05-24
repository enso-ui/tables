<template>
    <span :class="{ 'is-clickable has-text-info': column.meta.clickable }"
        @click="column.meta.clickable ? $emit('clicked') : null">
        <span class="tag is-table-tag icon is-small"
            :class="value ? 'is-success' : 'is-danger'"
            v-if="column.meta.boolean">
            <fa :icon="value ? 'check' : 'times'"/>
        </span>
        <span class="icon is-small"
            v-else-if="column.meta.icon && value">
            <fa :icon="value"/>
        </span>
        <slot v-else-if="column.meta.slot"
            :name="column.name">
            {{ value }}
        </slot>
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
            type: Object,
            required: true,
        },
        value: {
            type: null,
            required: true,
        },
        hiddenControls: {
            type: Boolean,
            default: false,
        },
    },
};

</script>

<style lang="scss">
    .is-clickable {
        cursor: pointer;
    }

    .tag.is-table-tag {
        font-size: 0.8rem;
        font-weight: bold;
        height: 1.4em;
        -webkit-box-shadow: 0 1px 1px rgba(10, 10, 10, 0.2);
        box-shadow: 0 1px 1px rgba(10, 10, 10, 0.2);
    }
</style>
