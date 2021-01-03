<template>
    <a class="button has-margin-left-small"
        :class="button.class"
        v-bind="$attrs"
        v-on="$listeners">
        <span class="is-hidden-mobile">
            {{ i18n(button.label) }}
        </span>
            <span class="icon is-small">
            <fa :icon="button.icon"/>
        </span>
        <span class="is-hidden-mobile"/>
    </a>
</template>

<script>
export default {
    name: 'Control',

    inject: ['i18n'],

    props: {
        button: {
            type: Object,
            required: true,
        },
    },
};
</script>
