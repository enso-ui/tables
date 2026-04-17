<script>
export default {
    name: 'CoreLengthMenu',

    inject: ['fetch', 'i18n', 'state'],

    render() {
        const { meta, template } = this.state;

        return this.$slots.default({
            bindings: {
                disableClear: true,
                i18n: this.i18n,
                label: 'value',
                options: template.lengthMenu.map(value => ({ value })),
                trackBy: 'value',
                modelValue: meta.length,
            },
            events: {
                'update:modelValue': value => {
                    meta.length = value;
                    this.fetch();
                },
            },
        });
    },
};
</script>
