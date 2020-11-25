<script>
import { debounce } from 'lodash';

export default {
    name: 'CoreSearch',

    inject: ['fetch', 'state', 'i18n'],

    computed: {
        meta() {
            return this.state.meta;
        },
        modeSelector() {
            return this.template.searchModes.length > 1;
        },
        template() {
            return this.state.template;
        },
    },

    created() {
        this.fetchData = debounce(this.fetchData, this.template.debounce);
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
                    this.$el.querySelector('input').focus();
                },
            },
            filterable: this.meta.filterable,
            i18n: this.i18n,
            modeBindings: {
                modes: this.template.searchModes,
                query: this.meta.search,
                value: this.meta.searchMode,
            },
            modeEvents: {
                input: event => (this.state.meta.searchMode = event),
                change: () => {
                    this.fetchData();
                    this.$el.querySelector('input').focus();
                },
            },
            modeSelector: this.modeSelector,
            search: this.meta.search,
            searchable: this.meta.searchable,
            searchBindings: {
                value: this.meta.search,
            },
            searchEvents: {
                input: e => {
                    this.meta.search = e.target.value;
                    this.fetchData();
                },
            },
        });
    },
};
</script>
