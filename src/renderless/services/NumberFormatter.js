class NumberFormatter {
    constructor(vm, column, index = null) {
        this.vm = vm;
        this.column = column;
        this.index = index;
        this.hasTotal = this.hasTotal();
    }

    handle() {
        if(this.index === null) {
            this.replace(this.format(this.number()));

            return;
        }

        this.singleRow();
    }

    singleRow() {
        const input = [this.vm.body.data[this.index][this.column.name]];
        this.vm.body.data[this.index][this.column.name] = this.format(input)[0];
    }

    replace(number) {
        this.vm.body.data = this.vm.body.data.map((row, index) => {
            row[this.column.name] = number[index];
            return row;
        });

        if (this.hasTotal) {
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

        if (this.hasTotal) {
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
