<script>
export default {
    name: 'CoreControls',

    inject: [
        'activeScenario', 'buttonAction', 'fetch',
        'hasSelection', 'i18n', 'reset', 'state',
    ],

    computed: {
        meta() {
            return this.state.meta;
        },
        filterLabels() {
            return this.activeScenario() && this.activeScenario().edit;
        },
        filterScenarios() {
            return this.state.filterScenarios.length > 0;
        },
    },

    render() {
        return this.$slots.default({
            controlBindings: button => ({
                href: button.action === 'href'
                    ? button.path
                    : null,
            }),
            controlEvents: button => ({
                click: () => this.buttonAction(button),
            }),
            filterLabels: this.filterLabels,
            filterScenarios: this.filterScenarios,
            forceInfoEvents: {
                click: () => {
                    this.meta.forceInfo = true;
                    this.fetch();
                },
            },
            hasSelection: this.hasSelection,
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
