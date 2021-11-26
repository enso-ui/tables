<template>
    <div class="columns is-gapless has-background-light bottom-controls">
        <div class="column">
            <records-info/>
        </div>
        <div class="column is-narrow has-text-right">
            <pagination v-if="hasEntries()"/>
        </div>
    </div>
</template>

<script>
import RecordsInfo from './RecordsInfo.vue';
import Pagination from './Pagination.vue';

export default {
    name: 'Controls',

    components: { RecordsInfo, Pagination },

    inject: ['hasEntries'],
};
</script>

<style lang="scss">
    .vue-table .bottom-controls {
        border-bottom-left-radius: inherit;
        border-bottom-right-radius: inherit;
    }
</style>
