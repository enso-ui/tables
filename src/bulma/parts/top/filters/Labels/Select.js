export default class {
    constructor(filter) {
        this.filter = filter;
    }
    label () {
        return this.filter.label;
    }
    proposition() {
        return this.filter.multiple && this.filter.value.length > 1
            ? 'in'
            : 'is'
    }
    value () {
        return this.filter.selection.join(', ');
    }
}