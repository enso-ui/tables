<script>
export default {
    name: 'CoreControls',

    inject: [
        'activeScenario', 'buttonAction', 'fetch',
        'hasSelection', 'i18n', 'reset', 'state',
    ],

    inheritAttrs: false,

    render() {
        const scenario = this.activeScenario();

        return this.$slots.default({
            controlBindings: button => ({
                href: button.action === 'href'
                    ? button.path
                    : null,
            }),
            controlEvents: button => ({
                click: () => this.buttonAction(button),
            }),
            filterLabels: scenario && scenario.edit,
            filterScenarios: this.state.filterScenarios.length > 0,
            forceInfoEvents: {
                click: () => {
                    this.state.meta.forceInfo = true;
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
