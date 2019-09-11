<script>
export default {
    name: 'CoreSearchMode',

    inject: ['state', 'fetch'],

    methods: {
        update() {
            this.state.meta.searchMode = this.state.template.searchModes[this.next()];
            this.$emit('click');
            this.fetch();
        },
        next() {
            const current = this.state.template.searchModes
                .findIndex(mode => mode === this.state.meta.searchMode);

            return current === this.state.template.searchModes.length - 1
                ? 0
                : current + 1;
        },
    },

    render() {
        return this.$scopedSlots.default({
            clickEvents: {
                click: this.update,
            },
        });
    },
};
</script>
