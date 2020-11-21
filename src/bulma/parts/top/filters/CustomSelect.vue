<template>
    <p class="control">
        <vue-select v-model="filter.value"
            objects
            :i18n="i18n"
            :label="filter.selectLabel"
            :source="filter.path"
            :multiple="filter.multiple"
            :translated="filter.translated"
            :params="filter.params"
            :pivot-params="filter.pivotParams"/>
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
        edit: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        applicable() {
            return this.filter.multiple
                ? this.filter.value.length > 0
                : this.filter.value !== null;
        },
    },

    created() {
        if (this.edit) {
            this.filter.value = this.filter.value.map((id, i) => ({
                id, name: this.filter.selection[i],
            }));
        }
    },

    methods: {
        transform() {
            this.filter.selection = this.filter.value.map(({ name }) => name);
            this.filter.value = this.filter.value.map(({ id }) => id);
        },
    },
};
</script>
