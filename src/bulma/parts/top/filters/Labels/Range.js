import Label from './Label';

class Range extends Label {
    i18n(i18n) {
        this.i18n = i18n;
    }

    preposition() {
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

    value() {
        switch (this.type()) {
        case 'range':
            return `${this.filter.value.min} ${this.i18n('and')} ${this.filter.value.max}`;
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
                return 'range';
            }

            if (this.filter.value.min !== null) {
                return 'greater';
            }

            return 'lower';
        }

        return 'point';
    }
}

export default Range;
