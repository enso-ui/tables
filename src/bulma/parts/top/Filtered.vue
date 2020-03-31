<template>
    <div class="filtered field is-grouped is-grouped-multiline has-background-light"
        v-if="state.filters.length">
        <div class="control"
            v-for="(filter, index) in state.filters">
            <div class="tags has-addons">
                <a class="tag is-warning"
                    @click.stop="$emit('configure', filter)">
                    {{ label(filter) }}
                </a>
                <a class="tag is-delete has-background-grey"
                    @click="clear(index)"/>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Filtered',

    inject: ['i18n', 'state'],

    methods: {
        clear(index) {
            this.state.filters.splice(index, 1);
        },
        label(filter) {
            switch (filter.type) {
                case 'boolean':
                    const value = filter.value ? this.i18n('true') : this.i18n('false');
                    return `${filter.label} ${this.i18n('is')} ${value}`;
                case 'string':
                    return `${filter.label} ${this.searchMode(filter.mode)} ${filter.value}`;
                default:
                    throw Error;
            }
        },
        searchMode(mode) {
            switch (mode) {
                case 'full':
                    return 'contains';
                case 'startsWith':
                    return 'starts with';
                case 'endsWith':
                    return 'ends with';
                default:
                    throw Error;
            }
        }
    },
};
</script>

<style lang="scss">
    .filtered {
        padding: 0 1em;

        a.tag:hover {
            text-decoration: none;
        }
    }
</style>