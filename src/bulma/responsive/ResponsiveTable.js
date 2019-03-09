class ResponsiveTable {
    constructor(el, context) {
        this.el = el;
        this.context = context;
        this.width = this.el.offsetWidth;
    }

    wasChanged() {
        return this.width !== this.el.offsetWidth;
    }

    shouldHide() {
        return this.el.offsetWidth < this.el.scrollWidth;
    }

    shouldUnhide() {
        return this.el.offsetWidth === this.el.scrollWidth && this.wasChanged();
    }

    updateWidth() {
        this.width = this.el.offsetWidth;
    }

    hide() {
        const column = this.context.state.template.columns
            .filter(column => column.meta.visible && !column.meta.hidden && !column.meta.rogue)
            .pop();

        if (column) {
            column.meta.hidden = true;
            this.update();
        }
    }

    unhide() {
        const column = this.context.state.template.columns
            .find(column => column.meta.hidden);

        if (column) {
            column.meta.hidden = false;
            this.update();
        }
    }

    update() {
        this.updateWidth();
        this.context.$nextTick(() => {
            this.fit();
        });
    }

    fit() {
        if (this.shouldHide()) {
            this.hide();
            return;
        }

        if (this.shouldUnhide()) {
            this.unhide();
        }
    }
}

export default ResponsiveTable;
