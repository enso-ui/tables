import Label from './Label';

class String extends Label {
    preposition() {
        switch (this.filter.mode) {
        case 'full':
            return 'contains';
        case 'startsWith':
            return 'starts with';
        case 'endsWith':
            return 'ends with';
        case 'doesntContain':
            return 'does not contain';
        case 'exactMatch':
            return 'is';
        default:
            throw Error;
        }
    }

    value() {
        return this.filter.value;
    }
}

export default String;
