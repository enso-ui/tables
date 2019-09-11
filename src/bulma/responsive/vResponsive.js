import { debounce } from 'lodash';
import { ResizeSensor } from 'css-element-queries';
import ResponsiveTable from './ResponsiveTable';

let table = null;

export default {
    inserted: (el, binding, { context }) => {
        if (binding.value) {
            table = new ResponsiveTable(el, context);
            context._resizeSensor = new ResizeSensor(el, debounce(() => table && table.fit(), 16));
        }
    },

    unbind: (el, binding, { context }) => {
        table = null;
        context._resizeSensor = null;
    },
};
