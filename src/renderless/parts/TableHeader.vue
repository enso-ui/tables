<script>
export default {
    name: 'CoreTableHeader',

    inject: ['state', 'fetch', 'togglePageSelect'],

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
        });
    },
};
</script>
