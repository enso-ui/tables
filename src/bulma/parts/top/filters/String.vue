<template>
    <p class="control is-expanded has-icons-right">
        <input class="input"
            :placeholder="i18n('Filter')"
            v-focus
            v-model="filter.value"
            ref="input">
        <search-mode class="is-right is-small individual-search-mode"
            v-model="filter.mode"
            :modes="state.template.searchModes"
            :query="filter.value"
            @input="$refs.input.focus()"
            v-if="filter.value"/>
    </p>
</template>

<script>
import SearchMode from '@enso-ui/search-mode/bulma';
import { focus } from '@enso-ui/directives';

export default {
    name: 'String',

    directives: { focus },

    components: { SearchMode },

    inject: ['i18n', 'state'],

    props: {
        edit: {
            type: Boolean,
            default: false,
        },
        filter: {
            type: Object,
            required: true,
        },
    },

    computed: {
        applicable() {
            return !!this.filter.value;
        },
    },

    created() {
        if (!this.edit) {
            this.filter.type = 'string';
            this.filter.value = '';
            this.filter.mode = 'full';
        }
    },
};
</script>

<style lang="scss" >
    .table-filters.dropdown {
        .is-right.icon {
            pointer-events: all;

            &.individual-search-mode {
                right: 0.3em;
            }
        }
    }
</style>
