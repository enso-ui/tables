class Label {
    constructor(filter) {
        this.filter = filter;
    }

    label() {
        return this.filter.label.toLowerCase();
    }
}

export default Label;
