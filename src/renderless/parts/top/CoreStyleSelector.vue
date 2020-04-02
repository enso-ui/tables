<script>
export default {
    name: 'CoreStyleSelector',

    inject: ['i18n', 'state'],

    computed: {
        options() {
            return Object.keys(this.styles)
                .map(key => ({ value: key, label: this.i18n(this.styles[key]) }));
        },
        selection() {
            return this.state.template.style
                .map(style => Object.keys(this.styles)
                    .find(key => this.styles[key] === style));
        },
        styles() {
            return this.state.template.styles;
        },
    },

    methods: {
        select(selected) {
            this.state.template.style.push(this.styles[selected]);
        },
        deselect(deselected) {
            const index = this.state.template.style.findIndex(style => style === this.styles[deselected]);

            this.state.template.style.splice(index, 1);
        },
    },

    render() {
        return this.$scopedSlots.default({
            bindings: {
                disableClear: true,
                i18n: this.i18n,
                label: 'label',
                multiple: true,
                options: this.options,
                trackBy: 'value',
                translated: true,
                value: this.selection,
            },
            events: {
                select: this.select,
                deselect: this.deselect,
            },
        });
    },
};
</script>
