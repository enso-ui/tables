<template>
    <core-records-info>
        <template v-slot:default="{ chunkInfo, fromInfo, selectedInfo, hasFilters, hasSelected }">
            <div class="records-info has-text-centered-touch">
                {{ chunkInfo }}
                <span v-if="hasFilters">
                    {{ fromInfo }}
                </span>
                <span v-if="hasSelected">
                    {{ selectedInfo }}
                </span>
            </div>
        </template>
    </core-records-info>
</template>

<script>
import CoreRecordsInfo from '../../../renderless/parts/bottom/CoreRecordsInfo.vue';

export default {
    name: 'RecordsInfo',

    components: { CoreRecordsInfo },
};
</script>

<style lang="scss" scoped>
    .vue-table .records-info {
        font-size: 0.9em;
        padding: 1em;
    }
</style>
