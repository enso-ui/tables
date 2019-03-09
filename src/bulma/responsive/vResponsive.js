import debounce from 'lodash/debounce';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import ResponsiveTable from './ResponsiveTable';

let table = null;
let sensor = null;

export default {
    inserted: (el, binding, { context }) => {
        table = new ResponsiveTable(el, context);
        sensor = new ResizeSensor(el, debounce(() => table.fit(), 16));
    },

    unbind: () => {
        table = null;
        sensor = null;
    },
};
