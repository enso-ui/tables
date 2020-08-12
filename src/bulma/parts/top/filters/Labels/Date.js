import Range from './Range';
import format from '@enso-ui/date/src/format';

class Date extends Range {
    constructor(filter) {
        super(filter);
    }

    state(state) {
        this.state = state;
    }

    value() {
        switch (this.type()) {
            case 'range':
                return `${this.dateFormat(this.filter.value.min)} ${this.i18n('and')} ${this.dateFormat(this.filter.value.max)}`;
            case 'greater':
                return this.dateFormat(this.filter.value.min);
            case 'lower':
                return this.dateFormat(this.filter.value.max);
            default:
                return this.dateFormat(this.filter.value);
        }
    }

    dateFormat(date) {
        return format(date, this.state.template.dateFormat);
    }
}

export default Date;
