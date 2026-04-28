<script>
import { debounce } from 'lodash-es';

export default {
    name: 'CoreSearch',

    inject: ['fetch', 'hasFilters', 'i18n', 'state'],

    created() {
        this.fetchData = debounce(this.fetchData, this.state.template.debounce);
    },

    methods: {
        fetchData() {
            this.fetch();
        },
    },

    render() {
        const { meta, template } = this.state;

        return this.$slots.default({
            clearEvents: {
                click: () => {
                    meta.search = '';
                    this.fetchData();
                    this.$parent.$el.querySelector('input').focus();
                },
            },
            filterable: meta.filterable,
            hasFilters: this.hasFilters,
            i18n: this.i18n,
            modeBindings: {
                modes: template.searchModes,
                query: meta.search,
                modelValue: meta.searchMode,
            },
            modeEvents: {
                'update:modelValue': event => (meta.searchMode = event),
                change: () => {
                    this.fetchData();
                    this.$parent.$el.querySelector('input').focus();
                },
            },
            modeSelector: template.searchModes.length > 1,
            search: meta.search,
            searchable: meta.searchable,
            searchBindings: {
                value: meta.search,
            },
            searchEvents: {
                input: event => {
                    meta.search = event.target.value;
                    this.fetchData();
                },
            },
        });
    },
};
</script>
