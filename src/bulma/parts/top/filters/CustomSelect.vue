<template>
    <p class="control">
        <vue-select v-model="filter.value"
            objects
            :i18n="i18n"
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
        isEdit: {
            type: Boolean,
            required: false,
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
        this.filter.params = this.filter.params instanceof Array
            ? {}
            : this.filter.params;
        
        if (this.isEdit) {
            this.filter.value = this.filter.value.map((id, i) => ({
                id: id,
                name: this.filter.selection[i],
            }));
        }
    },

    methods: {
        transform() {
            this.filter.selection = this.filter.value.map(({ name }) => name);
            this.filter.value = this.filter.value.map(({ id }) => id);
        }
    }
};
</script>
