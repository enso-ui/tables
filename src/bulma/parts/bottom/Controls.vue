<template>
    <div class="columns is-gapless bottom-controls">
        <div class="column">
            <records-info/>
        </div>
        <div class="column is-narrow has-text-right">
            <pagination v-bind="$attrs"
                v-if="hasEntries()"/>
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

    inheritAttrs: false,
};
</script>
