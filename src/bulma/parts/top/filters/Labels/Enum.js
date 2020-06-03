export default class {
    constructor(filter, state) {
        this.filter = filter;
        this.state = state;
    }
    label () {
        return this.filter.label;
    }
    proposition () {
        return this.filter.value.length > 1
            ? 'in'
            : 'is';
    }
    value () {
        const column = this.state.template.columns
            .find(({ data }) => data === this.filter.data);

        return this.filter.value.map(value => column.enum._get(value)).join(', ');
    }
}