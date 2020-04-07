<template>
    <p class="control">
        <vue-select v-model="filter.value"
            :i18n="i18n"
            :options="column.enum._select()"
            multiple/>
    </p>
</template>

<script>
import { VueSelect } from '@enso-ui/select/bulma';

export default {
    name: 'Enum',

    components: { VueSelect },

    inject: ['i18n'],

    props: {
        column: {
            type: Object,
            required: true,
        },
        filter: {
            type: Object,
            required: true,
        },
    },

    computed: {
        applicable() {
            return this.filter.value.length > 0;
        },
    },

    created() {
        this.filter.type = 'enum';
        this.filter.value = [];
    }
};
</script>
