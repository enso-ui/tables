<script>
export default {
    name: 'CoreStyleSelector',

    inject: ['state'],

    computed: {
        currentStyles() {
            return this.state.template.style.split(' ').filter(style => style);
        },
    },

    methods: {
        hasStyle(style) {
            return this.currentStyles.includes(style);
        },
        toggle(style) {
            this.state.template.style = this.hasStyle(style)
                ? this.currentStyles.filter(value => value !== style).join(' ')
                : `${this.state.template.style} ${style}`;
        },
    },

    render() {
        return this.$scopedSlots.default({
            styles: this.state.template.styles,
            hasStyle: this.hasStyle,
            toggle: this.toggle,
        });
    },
};
</script>
