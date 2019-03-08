<script>
export default {
    name: 'CoreLengthMenu',

    inject: ['state', 'fetch'],

    methods: {
        isActive(value) {
            return value === this.state.meta.length;
        },
    },

    render() {
        return this.$scopedSlots.default({
            isActive: this.isActive,
            optionEvents: value => ({
                click: () => {
                    this.state.meta.length = value;
                    this.fetch();
                },
            }),
        });
    },
};
</script>
