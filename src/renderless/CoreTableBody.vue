<script>
export default {
    name: 'CoreTableBody',

    inject: [
        'state', 'i18n', 'ajax', 'actionPath', 'buttonAction', 'isChild',
        'refreshPageSelected', 'hiddenColumns',
    ],

    data: () => ({
        row: null,
    }),

    computed: {
        hiddenCount() {
            return this.hiddenColumns().length;
        },
        hiddenColSpan() {
            return this.state.template.columns.length
                + (this.state.template.preview && !this.hiddenColumns.length ? 1 : 0)
                - (this.hiddenColumns.length ? this.hiddenColumns.length - 1 : 0)
                + (this.state.template.actions ? 2 : 1);
        },
    },

    watch: {
        hiddenCount: {
            handler(count) {
                if (count) {
                    this.refreshHidden();
                } else {
                    this.clearHidden();
                }
            },
        },
    },

    methods: {
        rowCrtNo(row) {
            return this.state.body.data
                && this.state.body.data.filter(row => !this.isChild(row))
                    .findIndex(({ dtRowId }) => dtRowId === row.dtRowId)
                    + this.state.meta.start + 1;
        },
        isExpanded(row) {
            return this.state.expanded.includes(row.dtRowId);
        },
        toggleHidden(row, index) {
            if (!this.isExpanded(row)) {
                this.state.expanded.push(row.dtRowId);
                this.addChildRow(row, index);
                return;
            }

            const idx = this.state.expanded.findIndex(id => id === row.dtRowId);
            this.state.expanded.splice(idx, 1);
            this.state.body.data.splice(index + 1, 1);
        },
        addChildRow(row, index) {
            const newRow = this.hiddenColumns().reduce((collector, column) => {
                collector.push({ column, value: row[column.name], rowCrtNo: index });
                return collector;
            }, []);

            this.state.body.data.splice(index + 1, 0, newRow);
        },
        refreshHidden() {
            this.state.body.data.forEach((row, index) => {
                this.toggleHidden(row, index);
                this.toggleHidden(row, index);
            });
        },
        clearHidden() {
            if (!this.state.body.data) {
                return;
            }

            this.state.body.data.reduce((indexes, row, index) => {
                if (this.isChild(row)) {
                    indexes.push(index);
                }

                return indexes;
            }, []).sort((a, b) => a < b)
                .forEach(index => this.state.body.data.splice(index, 1));
            this.state.expanded.splice(0);
        },
        isHighlighted(index) {
            return this.state.highlighted.includes(index);
        },
    },

    render() {
        return this.$scopedSlots.default({
            isHighlighted: this.isHighlighted,
            isChild: this.isChild,
            isExpanded: this.isExpanded,
            rowCrtNo: this.rowCrtNo,
            hiddenCount: this.hiddenCount,
            hiddenColSpan: this.hiddenColSpan,
            selectBindings: row => ({
                checked: this.state.selected.includes(row.dtRowId),
            }),
            selectEvents: row => ({
                change: () => {
                    if (this.state.selected.includes(row.dtRowId)) {
                        const index = this.state.selected.findIndex(id => id === row.dtRowId);
                        this.state.selected.splice(index, 1);
                    } else {
                        this.state.selected.push(row.dtRowId);
                    }

                    this.refreshPageSelected();
                },
            }),
            hiddenEvents: (row, index) => ({
                click: () => this.toggleHidden(row, index),
            }),
            cellBindings: (row, column) => ({
                column,
                value: row[column.name],
            }),
            cellEvents: (row, column) => ({
                clicked: () => {
                    if (column.meta.clickable) {
                        this.$emit('clicked', { column, row });
                    }
                },
            }),
            actionBindings: (button, row) => ({
                href: button.action === 'href'
                    ? this.actionPath(button, row.dtRowId)
                    : null,
            }),
            actionEvents: (button, row) => ({
                click: () => this.buttonAction(button, row),
            }),
        });
    },
};
</script>
