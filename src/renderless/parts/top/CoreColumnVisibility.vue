<script>
export default {
    name: 'CoreColumnVisibility',

    inject: ['fetch', 'i18n', 'state', 'visibleColumns'],

    render() {
        const options = this.visibleColumns();

        return this.$slots.default({
            bindings: {
                disableClear: true,
                i18n: this.i18n,
                label: 'label',
                multiple: true,
                objects: true,
                options,
                trackBy: 'name',
                translated: true,
                modelValue: options.filter(({ meta }) => meta.visible),
            },
            events: {
                select: column => (column.meta.visible = true),
                deselect: column => (column.meta.visible = false),
            },
        });
    },
};
</script>
