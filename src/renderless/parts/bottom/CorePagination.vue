<script>
export default {
    name: 'CorePagination',

    inject: ['i18n', 'fetch', 'state'],

    methods: {
        jumpTo(page) {
            const { fullRecordInfo, pagination } = this.state.body;

            const shouldIgnore = page === pagination.page || page < 1
                || (fullRecordInfo && page > pagination.pages);

            if (shouldIgnore) {
                return;
            }

            this.state.meta.start = (page - 1) * this.state.meta.length;

            this.fetch().then(() => this.$emit('page-changed', page));
        },
    },

    render() {
        const {
            atEnd, atMiddle, atStart, middlePages, page, pages,
        } = this.state.body.pagination;

        return this.$scopedSlots.default({
            i18n: this.i18n,
            jumpTo: this.jumpTo,
            fullRecordInfo: this.state.body.fullRecordInfo,
            loading: this.state.meta.loading,
            atEnd,
            atMiddle,
            atStart,
            middlePages,
            page,
            pages,
        });
    },
};
</script>
