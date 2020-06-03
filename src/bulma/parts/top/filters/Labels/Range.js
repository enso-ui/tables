export default class {
    constructor(filter) {
        this.filter = filter;
    }
    label () {
        return this.filter.label;
    }
    proposition() {
        switch (this.type()) {
        case 'range':
            return 'is between';
        case 'greater':
            return 'is greater than';
        case 'lower':
            return 'is lower than';
        default:
            return 'is';
        }
    }
    value () {
        switch (this.type()) {
        case 'range':
            return `${this.filter.value.min} and ${this.filter.value.max}`; //TODO:: 118n for and!
        case 'greater':
            return this.filter.value.min;
        case 'lower':
            return this.filter.value.max;
        default:
            return this.filter.value;
        }
    }

    type() {
        if (this.filter.mode === 'interval') {
            if (this.filter.value.min !== null && this.filter.value.max !== null) {
                return 'range'
            }

            if (this.filter.value.min !== null) {
                return 'greater';
            }

            return 'lower';
        }

        return 'point';
    }
}