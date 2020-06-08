import Label from './Label';

class Select extends Label {
    preposition() {
        return this.filter.multiple && this.filter.value.length > 1
            ? 'in'
            : 'is';
    }

    value() {
        return this.filter.selection.join(', ');
    }
}

export default Select;
