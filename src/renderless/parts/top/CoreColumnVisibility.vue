<script>
export default {
    name: 'CoreColumnVisibility',

    inject: ['fetch', 'i18n', 'state', 'visibleColumns'],

    computed: {
        selection() {
            return this.visibleColumns().filter(({ meta }) => meta.visible);
        },
    },

    render() {
        return this.$scopedSlots.default({
            bindings: {
                disableClear: true,
                i18n: this.i18n,
                label: 'label',
                multiple: true,
                objects: true,
                options: this.visibleColumns(),
                trackBy: 'name',
                translated: true,
                value: this.selection,
            },
            events: {
                select: column => (column.meta.visible = true),
                deselect: column => (column.meta.visible = false),
            },
        });
    },
};
</script>
