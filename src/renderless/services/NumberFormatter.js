class NumberFormatter {
    constructor(vm, column) {
        this.vm = vm;
        this.column = column;
        this.totals = this.hasTotal();
    }

    handle() {
        this.replace(this.format(this.number()));
    }

    replace(number) {
        this.vm.body.data = this.vm.body.data.map((row, index) => {
            row[this.column.name] = number[index];
            return row;
        });

        if (this.totals) {
            this.vm.body.total[this.column.name] = number.pop();
        }
    }

    format(number) {
        const max = (max, value) => Math.max(value.length, max);
        const length = number.reduce(max, 0);
        const { template, symbol } = this.column.number;
        const pad = value => value.padStart(length, ' ');
        const formatter = value => template.replace('%s', symbol)
            .replace('%v', pad(value));

        return number.map(formatter);
    }

    number() {
        const number = this.vm.body.data.map(row => row[this.column.name]);

        if (this.totals) {
            number.push(this.vm.body.total[this.column.name]);
        }

        return number;
    }

    hasTotal() {
        return this.vm.meta.total
            && Object.keys(this.vm.body.total)
                .includes(this.column.name);
    }
}

export default NumberFormatter;
