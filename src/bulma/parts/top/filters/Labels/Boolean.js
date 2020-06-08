import Label from './Label';

class Boolean extends Label {
    // eslint-disable-next-line class-methods-use-this
    preposition() {
        return 'is';
    }

    value() {
        return this.filter.value
            ? 'true'
            : 'false';
    }
}

export default Boolean;
