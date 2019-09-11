<script>
export default {
    name: 'FilterState',

    props: {
        apiVersion: {
            type: Number,
            required: true,
        },
        filters: {
            type: Object,
            default: null,
        },
        intervals: {
            type: Object,
            default: null,
        },
        name: {
            type: String,
            required: true,
        },
        params: {
            type: Object,
            default: null,
        },
    },

    data: () => ({
        defaultFilters: null,
        defaultIntervals: null,
        defaultParams: null,
    }),

    computed: {
        state() {
            const state = { apiVersion: this.apiVersion };

            if (this.filters) {
                state.filters = this.filters;
            }

            if (this.intervals) {
                state.intervals = this.intervals;
            }

            if (this.params) {
                state.params = this.params;
            }

            return state;
        },
    },

    watch: {
        state: {
            handler: 'persist',
            deep: true,
        },
    },

    created() {
        this.defaults();
        this.load();
    },

    methods: {
        defaults() {
            this.defaultFilters = JSON.stringify(this.filters);
            this.defaultIntervals = JSON.stringify(this.intervals);
            this.defaultParams = JSON.stringify(this.params);
        },
        load() {
            const state = JSON.parse(
                localStorage.getItem(this.name),
            );
            if (state && state.apiVersion === this.state.apiVersion) {
                ['filters', 'intervals', 'params']
                    .forEach(obj => this.fill(obj, state[obj]));
            }
        },
        fill(obj, state) {
            if (this[obj]) {
                Object.keys(this[obj])
                    .forEach(key => (this[obj][key] = state[key]));
            }
        },
        persist() {
            localStorage.setItem(
                this.name, JSON.stringify(this.state),
            );
        },
        reset() {
            localStorage.removeItem(this.name);
            ['filters', 'intervals', 'params']
                .forEach(obj => this.fill(obj, this.default(obj)));
        },
        default(obj) {
            obj = `default${obj.charAt(0).toUpperCase()}${obj.slice(1)}`;
            return JSON.parse(this[obj]);
        },
    },

    render() {
        return this.$slots.default;
    },
};
</script>
