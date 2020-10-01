<script>
export default {
    name: 'CoreTableBody',

    inject: [
        'actionPath', 'ajax', 'buttonAction', 'columnAlignment', 'hiddenColspan',
        'hiddenColumns', 'i18n', 'isChild', 'isHighlighted', 'refreshPageSelected',
        'state', 'visibleColumn',
    ],

    data: () => ({
        row: null,
    }),

    computed: {
        template() {
            return this.state.template;
        },
        body() {
            return this.state.body;
        },
        hiddenCount() {
            return this.hiddenColumns().length;
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
            return this.body.data
                && this.body.data.filter(filteredRow => !this.isChild(filteredRow))
                    .findIndex(filteredRow => filteredRow[this.template.dtRowId]
                        === row[this.template.dtRowId]) + this.state.meta.start + 1;
        },
        isExpanded(row) {
            return this.state.expanded.includes(row[this.template.dtRowId]);
        },
        shouldRender(row, button) {
            // eslint-disable-next-line no-underscore-dangle
            return !row._actions || row._actions.includes(button.name);
        },
        toggleHidden(row, index) {
            if (!this.isExpanded(row)) {
                this.state.expanded.push(row[this.template.dtRowId]);
                this.addChildRow(row, index);
                return;
            }

            const idx = this.state.expanded.findIndex(id => id === row[this.template.dtRowId]);
            this.state.expanded.splice(idx, 1);
            this.body.data.splice(index + 1, 1);
        },
        addChildRow(row, index) {
            const newRow = this.hiddenColumns().reduce((collector, column) => {
                collector.push({ column, value: this.cellValue(row, column), rowCrtNo: index });
                return collector;
            }, []);

            this.body.data.splice(index + 1, 0, newRow);
        },
        refreshHidden() {
            this.body.data.forEach((row, index) => {
                this.toggleHidden(row, index);
                this.toggleHidden(row, index);
            });
        },
        clearHidden() {
            if (!this.body.data) {
                return;
            }

            this.body.data.reduce((indexes, row, index) => {
                if (this.isChild(row)) {
                    indexes.push(index);
                }

                return indexes;
            }, []).sort((a, b) => a < b)
                .forEach(index => this.body.data.splice(index, 1));
            this.state.expanded.splice(0);
        },
        cellValue(row, column) {
            return column.name.split('.')
                .reduce((value, prop) => (value ? value[prop] : null), row);
        },
    },

    render() {
        return this.$scopedSlots.default({
            actionBindings: (button, row) => ({
                href: button.action === 'href' ? this.actionPath(button, row[this.template.dtRowId]) : null,
            }),
            actionEvents: (button, row) => ({
                click: () => this.buttonAction(button, row),
            }),
            cellBindings: (row, column) => ({
                column,
                value: this.cellValue(row, column),
            }),
            cellEvents: (row, column) => ({
                clicked: () => {
                    if (column.meta.clickable) {
                        this.$emit('clicked', {
                            column,
                            row,
                        });
                    }
                },
            }),
            columnAlignment: this.columnAlignment,
            hiddenColspan: this.hiddenColspan,
            hiddenCount: this.hiddenCount,
            hiddenEvents: (row, index) => ({
                click: () => this.toggleHidden(row, index),
            }),
            i18n: this.i18n,
            isChild: this.isChild,
            isExpanded: this.isExpanded,
            shouldRender: this.shouldRender,
            isHighlighted: this.isHighlighted,
            rowCrtNo: this.rowCrtNo,
            selectBindings: row => ({
                checked: this.state.selected.includes(row[this.template.dtRowId]),
            }),
            selectEvents: row => ({
                change: () => {
                    if (this.state.selected.includes(row[this.template.dtRowId])) {
                        const index = this.state.selected.findIndex(id => id === row[this.template.dtRowId]);
                        this.state.selected.splice(index, 1);
                    } else {
                        this.state.selected.push(row[this.template.dtRowId]);
                    }

                    this.refreshPageSelected();
                },
            }),
            state: this.state,
            visibleColumn: this.visibleColumn,
        });
    },
};
</script>
