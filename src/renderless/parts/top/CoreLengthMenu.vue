<script>
export default {
    name: 'CoreLengthMenu',

    inject: ['state', 'fetch'],

    methods: {
        isActive(value) {
            return value === this.state.meta.length;
        },
        update(value) {
            this.state.meta.length = value;
            this.fetch();
        },
    },

    render() {
        return this.$scopedSlots.default({
            isActive: this.isActive,
            update: this.update,
            state: this.state,
        });
    },
};
</script>
