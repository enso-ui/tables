<script>
export default {
    name: 'CoreControls',

    inject: ['state', 'fetch', 'reset', 'buttonAction'],

    render() {
        return this.$scopedSlots.default({
            reloadEvents: {
                click: this.fetch,
            },
            resetEvents: {
                click: this.reset,
            },
            forceInfoEvents: {
                click: () => {
                    this.state.meta.forceInfo = true;
                    this.fetch();
                },
            },
            controlBindings: button => ({
                href: button.action === 'href'
                    ? button.path
                    : null,
            }),
            controlEvents: button => ({
                click: () => this.buttonAction(button),
            }),
            searchBindings: {
                value: this.state.meta.search,
            },
            searchEvents: {
                input: (e) => {
                    this.state.meta.search = e.target.value;
                    this.fetch();
                },
            },
            clearEvents: {
                click: () => {
                    this.state.meta.search = '';
                    this.fetch();
                },
            },
        });
    },
};
</script>
