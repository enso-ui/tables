<script>
export default {
    name: 'CoreRecordsInfo',

    inject: ['i18n', 'state'],

    computed: {
        body() {
            return this.state.body;
        },
        chunkInfo() {
            return `${this.i18n('From')} ${this.startInfo} ${this.i18n('to')} \
                ${this.state.meta.start + this.body.data.length - this.state.expanded.length} \
                ${this.filteredInfo}`;
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
        filteredInfo() {
            return this.hasFilters
                ? `${this.i18n('of')} ${this.body.fullRecordInfo ? this.body.formattedFiltered : '...'} \
                 ${this.i18n('entries')}`
                : `${this.i18n('of')} ${this.body.formattedCount} ${this.i18n('entries')}`;
        },
        fromInfo() {
            return `(${this.i18n('filtered from')} ${this.body.formattedCount} ${this.i18n('total records')})`;
        },
        selectedInfo() {
            return `(${this.state.selected.length} ${this.i18n('selected')})`;
        },
        startInfo() {
            return this.hasRecords
                ? this.state.meta.start + 1
                : 0;
        },
    },

    render() {
        return this.$scopedSlots.default({
            chunkInfo: this.chunkInfo,
            fromInfo: this.fromInfo,
            hasFilters: this.hasFilters,
            hasSelected: this.hasSelected,
            selectedInfo: this.selectedInfo,
        });
    },
};
</script>
