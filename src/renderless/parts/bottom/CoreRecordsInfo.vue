<script>
export default {
    name: 'CoreRecordsInfo',

    inject: ['i18n', 'state'],

    computed: {
        body() {
            return this.state.body;
        },
        hasRecords() {
            return this.body.data && this.body.data.length > 0;
        },
        hasSelected() {
            return this.state.selected.length > 0;
        },
        hasFilters() {
            return this.body.filters;
        },
        startInfo() {
            return this.hasRecords
                ? this.state.meta.start + 1
                : 0;
        },
        filteredInfo() {
            return this.hasFilters
                ? `${this.i18n('of')} ${this.body.fullRecordInfo ? this.body.filtered : '...'} \
                 ${this.i18n('entries')}`
                : `${this.i18n('of')} ${this.body.count} ${this.i18n('entries')}`;
        },
        selectedInfo() {
            return `(${this.state.selected.length} ${this.i18n('selected')})`;
        },
        chunkInfo() {
            return `${this.i18n('From')} ${this.startInfo} ${this.i18n('to')} \
                ${this.state.meta.start + this.body.data.length - this.state.expanded.length} \
                ${this.filteredInfo}`;
        },
        fromInfo() {
            return `(${this.i18n('filtered from')} ${this.body.count} ${this.i18n('total records')})`;
        },
    },

    render() {
        return this.$scopedSlots.default({
            hasFilters: this.hasFilters,
            hasSelected: this.hasSelected,
            chunkInfo: this.chunkInfo,
            fromInfo: this.fromInfo,
            selectedInfo: this.selectedInfo,
        });
    },
};
</script>
