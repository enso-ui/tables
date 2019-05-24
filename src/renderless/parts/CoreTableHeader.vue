<script>
export default {
    name: 'CoreTableHeader',

    inject: ['state', 'fetch', 'togglePageSelect', 'i18n', 'visibleColumn', 'hiddenColumns', 'columnAlignment'],

    methods: {
        toggleSort(event, { meta }) {
            const { sort } = meta;

            if (!event.shiftKey) {
                this.clearSort();
            }

            meta.sort = sort === 'ASC' ? 'DESC' : 'ASC';
            this.state.meta.sort = true;
            this.fetch();
        },
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
    },

    render() {
        return this.$scopedSlots.default({
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
            clearSortEvents: column => ({
                click: () => this.clearColumnSort(column),
            }),
            i18n: this.i18n,
            visibleColumn: this.visibleColumn,
            hiddenColumns: this.hiddenColumns().length,
            preview: this.state.template.preview,
            columns: this.state.template.columns,
            columnAlignment: this.columnAlignment,
            crtNo: this.state.template.crtNo,
            crtNoLabel: this.state.template.labels.crtNo,
            actions: this.state.template.actions,
            actionsLabel: this.state.template.labels.actions,
            align: this.state.template.align,
            style: this.state.template.style,
            selectable: this.state.template.selectable,
        });
    },
};
</script>
