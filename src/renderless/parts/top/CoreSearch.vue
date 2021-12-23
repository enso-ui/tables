<script>
import { debounce } from 'lodash';

export default {
    name: 'CoreSearch',

    inject: ['fetch', 'hasFilters', 'i18n', 'state'],

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
        return this.$slots.default({
            clearEvents: {
                click: () => {
                    this.meta.search = '';
                    this.fetchData();
                    this.$parent.$el.querySelector('input').focus();
                },
            },
            filterable: this.meta.filterable,
            hasFilters: this.hasFilters,
            i18n: this.i18n,
            modeBindings: {
                modes: this.template.searchModes,
                query: this.meta.search,
                modelValue: this.meta.searchMode,
            },
            modeEvents: {
                'update:modelValue': event => (this.state.meta.searchMode = event),
                change: () => {
                    this.fetchData();
                    this.$parent.$el.querySelector('input').focus();
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
