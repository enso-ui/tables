<script>
export default {
    name: 'CoreStyleSelector',

    inject: ['i18n', 'state'],

    computed: {
        options() {
            return Object.keys(this.state.template.styles)
                .map(value => ({ value, label: this.i18n(value) }));
        },
        selection() {
            const { style, styles } = this.state.template;

            return style.map(current => Object.keys(styles)
                .find(value => styles[value] === current));
        },
    },

    methods: {
        select(selected) {
            this.state.template.style.push(this.state.template.styles[selected]);
        },
        deselect(deselected) {
            const index = this.state.template.style
                .findIndex(style => style === this.state.template.styles[deselected]);

            this.state.template.style.splice(index, 1);
        },
    },

    render() {
        return this.$slots.default({
            bindings: {
                disableClear: true,
                i18n: this.i18n,
                label: 'label',
                multiple: true,
                options: this.options,
                trackBy: 'value',
                translated: true,
                modelValue: this.selection,
            },
            events: {
                select: this.select,
                deselect: this.deselect,
            },
        });
    },
};
</script>
