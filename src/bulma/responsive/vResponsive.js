import { debounce } from 'lodash-es';
import ResponsiveTable from './ResponsiveTable';

export default {
    mounted: (el, binding, vnode) => {
        if (binding.value) {
            const context = binding.instance;

            const table = new ResponsiveTable(el, context);
            const onResize = debounce(() => table && table.fit(), 16);

            if (typeof ResizeObserver !== 'undefined') {
                const observer = new ResizeObserver(onResize);
                observer.observe(el);
                context._resizeSensor = observer;
                return;
            }

            onResize();
        }
    },

    unmounted: (el, binding, vnode) => {
        if (binding.value) {
            const sensor = binding.instance._resizeSensor;

            if (sensor && typeof sensor.disconnect === 'function') {
                sensor.disconnect();
            }

            binding.instance._resizeSensor = null;
        }
    },
};
