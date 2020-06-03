export default class {
    constructor(filter) {
        this.filter = filter;
    }
    label () {
        return this.filter.label;
    }
    proposition () {
        return 'is';
    }
    value () {
        return this.filter.value
            ? 'true'
            : 'false';
    }
}