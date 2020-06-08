import Label from './Label';

class Enum extends Label {
    state(state) {
        this.state = state;
    }

    preposition() {
        return this.filter.value.length > 1
            ? 'in'
            : 'is';
    }

    value() {
        const column = this.state.template.columns
            .find(({ data }) => data === this.filter.data);

        return this.filter.value.map(value => column.enum._get(value)).join(', ');
    }
}

export default Enum;
