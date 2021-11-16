<template>
    <a class="button"
        :class="button.class"
        v-bind="$attrs"   >
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
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';

export default {
    name: 'Control',

    inject: ['i18n'],

    components: { Fa },

    props: {
        button: {
            type: Object,
            required: true,
        },
    },
};
</script>
