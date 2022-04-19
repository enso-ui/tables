class NumberFormatter {
    constructor(vm, column) {
        this.vm = vm;
        this.column = column;
        this.segments = column.name.split('.');
        this.totals = this.hasTotal();
    }

    handle() {
        this.replace(this.format(this.numbers()));
    }

    replace(column) {
        const { length } = this.segments;
        this.vm.body.data.forEach((row, index) => {
        this.segments.forEach((segment, idx) => idx + 1 === length
            ? (row[segment] = column[index])
            : row = row[segment])
        });

        if (this.totals) {
            this.vm.body.total[this.column.name] = column.pop();
        }
    }

    format(column) {
        const max = (max, value) => Math.max(value.length, max);
        const length = column.reduce(max, 0);
        const { template, symbol } = this.column.number;
        const pad = value => value.padStart(length, ' ');
        const formatter = value => template.replace('%s', symbol)
            .replace('%v', pad(value));

        return column.map(formatter);
    }

    numbers() {
        const column = this.vm.body.data
            .map(row => this.segments.reduce((row, segment) => row[segment], row));

        if (this.totals) {
            column.push(this.vm.body.total[this.column.name]);
        }

        return column;
    }

    hasTotal() {
        return this.vm.meta.total
            && this.vm.body.fullRecordInfo
            && Object.keys(this.vm.body.total)
                .includes(this.column.name);
    }
}

export default NumberFormatter;
