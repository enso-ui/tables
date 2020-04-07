<template>
    <p class="control">
        <vue-select v-model="filter.value"
            objects
            :i18n="i18n"
            :source="filter.path"
            :multiple="filter.multiple"
            :translated="filter.translated"/>
    </p>
</template>

<script>
import { VueSelect } from '@enso-ui/select/bulma';

export default {
    name: 'CustomSelect',

    components: { VueSelect },

    inject: ['i18n'],

    props: {
        filter: {
            type: Object,
            required: true,
        },
    },

    computed: {
        applicable() {
            return this.filter.multiple
                ? this.filter.value.length > 0
                : this.filter.value !== null;
        },
    },
};
</script>
