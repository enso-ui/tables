export default class {
    constructor(filter) {
        this.filter = filter;
    }
    label () {
        return this.filter.label;
    }
    proposition() {
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
    value () {
        return this.filter.value;
    }
}