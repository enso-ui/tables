<template>
    <p class="control">
        <vue-select v-model="filter.value"
            :i18n="i18n"
            :options='options'
            multiple/>
    </p>
</template>

<script>
import { VueSelect } from '@enso-ui/select/bulma';

export default {
    name: 'Enum',

    components: { VueSelect },

    inject: ['i18n', 'state'],

    props: {
        filter: {
            type: Object,
            required: true,
        },
        isEdit: {
            type: Boolean,
            required: false,
            default: false,
        },
    },

    computed: {
        applicable() {
            return this.filter.value.length > 0;
        },
        options() {
            const column = this.state.template.columns
                .find(({ data }) => data === this.filter.data);

            return column.enum._select()
        }

    },

    created() {
        if (!this.isEdit) {
            this.filter.type = 'enum';
            this.filter.value = [];
        }
    }
};
</script>
