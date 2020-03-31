<script>
export default {
    name: 'CoreTableHeader',

    inject: [
        'columnAlignment', 'fetch', 'hiddenColumns', 'i18n',
        'state', 'togglePageSelect', 'visibleColumn',
    ],

    methods: {
        clearColumnSort({ meta }) {
            meta.sort = null;

            if (!this.state.template.columns.find(column => column.meta.sort !== null)) {
                this.state.meta.sort = false;
            }

            this.fetch();
        },
        clearSort() {
            this.state.template.columns.forEach(({ meta }) => {
                meta.sort = null;
            });
        },
        toggleSort(event, { meta }) {
            const { sort } = meta;

            if (!event.shiftKey) {
                this.clearSort();
            }

            meta.sort = sort === 'ASC' ? 'DESC' : 'ASC';
            this.state.meta.sort = true;
            this.fetch();
        },
    },

    render() {
        return this.$scopedSlots.default({
            actions: this.state.template.actions,
            actionsLabel: this.state.template.labels.actions,
            clearSortEvents: column => ({
                click: () => this.clearColumnSort(column),
            }),
            columns: this.state.template.columns,
            crtNo: this.state.template.crtNo,
            crtNoLabel: this.state.template.labels.crtNo,
            hiddenColumns: this.hiddenColumns().length,
            i18n: this.i18n,
            preview: this.state.template.preview,
            selectable: this.state.template.selectable,
            selectBindings: {
                checked: this.state.pageSelected,
            },
            selectEvents: {
                change: () => {
                    this.state.pageSelected = !this.state.pageSelected;
                    this.togglePageSelect();
                },
            },
            sortEvents: column => ({
                click: e => this.toggleSort(e, column),
            }),
            style: this.state.template.style,
            visibleColumn: this.visibleColumn,
        });
    },
};
</script>
