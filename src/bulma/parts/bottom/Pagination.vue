<template>
    <core-pagination>
        <template v-slot:default="{ jumpTo, atStart, middlePages, atEnd, page, pages }">
            <nav class="pagination is-small"
                role="navigation"
                aria-label="pagination">
                <a class="pagination-previous"
                    :disabled="page === 1 || state.meta.loading"
                    @click="jumpTo(page - 1)">
                    {{ i18n('Previous') }}
                </a>
                <a class="pagination-next"
                    :disabled="page === pages || state.meta.loading"
                    @click="jumpTo(page + 1)">
                    {{ i18n('Next') }}
                </a>
                <ul class="pagination-list"
                    v-if="state.body.fullRecordInfo">
                    <li>
                        <a class="pagination-link"
                            :class="{ 'is-current': page === 1 }"
                            :disabled="state.meta.loading"
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
                            :disabled="state.meta.loading"
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
                            :disabled="state.meta.loading"
                            @click="jumpTo(pages)">
                            {{ pages }}
                        </a>
                    </li>
                </ul>
            </nav>
        </template>
    </core-pagination>
</template>

<script>
import CorePagination from '../../../renderless/parts/bottom/CorePagination.vue';

export default {
    name: 'Pagination',

    components: { CorePagination },

    inject: ['state', 'i18n', 'fetch'],
};
</script>

<style lang="scss">
    .vue-table .pagination {
        padding: 0.75em;
        margin: 0;
    }
</style>
