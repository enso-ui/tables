<script>
import debounce from 'lodash/debounce';

export default {
    name: 'CoreControls',

    inject: ['buttonAction', 'fetch', 'reset', 'state'],

    computed: {
        meta() {
            return this.state.meta;
        },
        modeSelector() {
            return this.state.template.searchModes.length > 1;
        },
    },

    created() {
        this.fetchData = debounce(this.fetchData, this.state.template.debounce);
    },

    methods: {
        fetchData() {
            this.fetch();
        },
    },

    render() {
        return this.$scopedSlots.default({
            clearEvents: {
                click: () => {
                    this.meta.search = '';
                    this.fetchData();
                },
            },
            controlBindings: button => ({
                href: button.action === 'href'
                    ? button.path
                    : null,
            }),
            controlEvents: button => ({
                click: () => this.buttonAction(button),
            }),
            forceInfoEvents: {
                click: () => {
                    this.meta.forceInfo = true;
                    this.fetchData();
                },
            },
            modeBindings: {
                modes: this.state.template.searchModes,
                query: this.meta.search,
                value: this.state.meta.searchMode,
            },
            modeEvents: {
                input: event => (this.state.meta.searchMode = event),
                change: this.fetchData,
            },
            modeSelector: this.modeSelector,
            reloadEvents: {
                click: this.fetchData,
            },
            resetEvents: {
                click: this.reset,
            },

            searchBindings: {
                value: this.meta.search,
            },
            searchEvents: {
                input: (e) => {
                    this.meta.search = e.target.value;
                    this.fetchData();
                },
            },
        });
    },
};
</script>
