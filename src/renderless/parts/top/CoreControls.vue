<script>
export default {
    name: 'CoreControls',

    inject: ['buttonAction', 'fetch', 'i18n', 'reset', 'state'],

    computed: {
        meta() {
            return this.state.meta;
        },
    },

    render() {
        return this.$scopedSlots.default({
            controlBindings: button => ({
                href: button.action === 'href'
                    ? button.path
                    : null,
            }),
            controlEvents: button => ({
                click: () => this.buttonAction(button),
            }),
            filteredEvents: {
                configure: (filter) => {
                    const filters = this.$children.find(child => child.$options.name === 'Search')
                        .$children[0].$children.find(child => child.$options.name === 'Filters');

                    filters.configure(filter);
                },
            },
            forceInfoEvents: {
                click: () => {
                    this.meta.forceInfo = true;
                    this.fetch();
                },
            },
            i18n: this.i18n,
            reloadEvents: {
                click: this.fetch,
            },
            resetEvents: {
                click: this.reset,
            },
            state: this.state,
        });
    },
};
</script>
