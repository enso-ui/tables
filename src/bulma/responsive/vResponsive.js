import { debounce } from 'lodash';
import { ResizeSensor } from 'css-element-queries';
import ResponsiveTable from './ResponsiveTable';

export default {
    mounted: (el, binding, vnode) => {
        if (binding.value) {
            const context= binding.instance;

            const table = new ResponsiveTable(el, context);
            context._resizeSensor = new ResizeSensor(el, debounce(() => table && table.fit(), 16));
        }
    },

    unmounted: (el, binding, vnode) => {
        if (binding.value) {
            binding.instance._resizeSensor = null;
        }
    },
};
