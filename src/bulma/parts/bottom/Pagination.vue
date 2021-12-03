<template>
    <nav class="pagination is-small"
        role="navigation"
        aria-label="pagination">
            <core-pagination>
                <template #default="{
                    disabledNext, disabledPrevious, fullRecordInfo, loading, atStart, atEnd,
                    i18n, jumpTo, middlePages, page, pages
                }">
                <a class="pagination-previous"
                    :disabled="disabledPrevious"
                    @click="jumpTo(page - 1)">
                    {{ i18n('Previous') }}
                </a>
                <a class="pagination-next"
                    :disabled="disabledNext"
                    @click="jumpTo(page + 1)">
                    {{ i18n('Next') }}
                </a>
                <ul class="pagination-list"
                    v-if="fullRecordInfo">
                    <li>
                        <a class="pagination-link"
                            :class="{ 'is-current': page === 1 }"
                            :disabled="loading || null"
                            @click="jumpTo(1)">
                            1
                        </a>
                    </li>
                    <li v-if="pages > 5 && !atStart">
                        <span class="pagination-ellipsis">
                            &hellip;
                        </span>
                    </li>
                    <li v-for="i in middlePages"
                        :key="i">
                        <a class="pagination-link"
                            :class="{ 'is-current': page === i }"
                            :disabled="loading || null"
                            @click="jumpTo(i)">
                            {{ i }}
                        </a>
                    </li>
                    <li v-if="pages > 5 && !atEnd">
                        <span class="pagination-ellipsis">
                            &hellip;
                        </span>
                    </li>
                    <li v-if="pages > 1">
                        <a class="pagination-link"
                            :class="{ 'is-current': page === pages }"
                            :disabled="loading || null"
                            @click="jumpTo(pages)">
                            {{ pages }}
                        </a>
                    </li>
                </ul>
            </template>
        </core-pagination>
    </nav>
</template>

<script>
import CorePagination from '../../../renderless/parts/bottom/CorePagination.vue';

export default {
    name: 'Pagination',

    components: { CorePagination },
};
</script>

<style lang="scss">
    .vue-table .pagination {
        padding: 0.75em;
        margin: 0;
    }
</style>
