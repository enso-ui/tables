<script>
export default {
    name: 'CoreDropdownActions',

    inject: ['i18n', 'state', 'buttonAction'],

    render() {
        return this.$slots.default({
            buttons: this.state.template.buttons.dropdown,
            disabled: this.state.meta.loading,
            controlBindings: button => ({
                href: button.action === 'href' ? button.path : null,
            }),
            controlEvents: button => ({
                click: () => this.buttonAction(button),
            }),
            hasSelection: this.hasSelection,
        });
    },
};
</script>
