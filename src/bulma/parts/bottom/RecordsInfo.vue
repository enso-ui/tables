<template>
    <div class="records-info has-text-centered-touch">
        <core-records-info>
            <template #default="{
                chunkInfo, fromInfo, hasFilters, hasSelected, selectedInfo
            }">
                {{ chunkInfo }}
                <span v-if="hasFilters">
                    {{ fromInfo }}
                </span>
                <span v-if="hasSelected">
                    {{ ` ${selectedInfo}` }}
                </span>
            </template>
        </core-records-info>
    </div>
</template>

<script>
import CoreRecordsInfo from '../../../renderless/parts/bottom/CoreRecordsInfo.vue';

export default {
    name: 'RecordsInfo',

    components: { CoreRecordsInfo },
};
</script>
