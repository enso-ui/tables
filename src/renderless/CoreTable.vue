<script>
import Enum from '@enso-ui/enums';
import NumberFormatter from './services/NumberFormatter';

export default {

    name: 'CoreTable',

    props: {
        errorHandler: {
            default: error => {
                throw error;
            },
            type: Function,
        },
        filters: {
            default: null,
            type: Object,
        },
        i18n: {
            default: v => v,
            type: Function,
        },
        id: {
            required: true,
            type: String,
        },
        initParams: {
            default: null,
            type: Object,
        },
        intervals: {
            default: null,
            type: Object,
        },
        params: {
            default: null,
            type: Object,
        },
        path: {
            required: true,
            type: String,
        },
        routerErrorHandler: {
            default: error => {
                throw error;
            },
            type: Function,
        },
    },

    data: () => ({
        ongoingRequest: null,
        state: {
            action: {
                button: null,
                row: null,
            },
            apiVersion: null,
            body: {},
            confirmation: false,
            expanded: [],
            filterScenarios: [],
            highlighted: [],
            meta: {},
            pageSelected: false,
            ready: false,
            selected: [],
            template: {},
        },
    }),

    computed: {
        body() {
            return this.state.body;
        },
        internalFilters() {
            return this.activeScenario()
                ? this.activeScenario().filters
                : [];
        },
        meta() {
            return this.state.meta;
        },
        preferences() {
            return this.state.ready && {
                apiVersion: this.state.apiVersion,
                template: {
                    style: this.template.style,
                },
                meta: {
                    start: this.meta.start,
                    length: this.meta.length,
                    search: this.meta.search,
                    searchMode: this.meta.searchMode,
                    sort: this.meta.sort,
                },
                columns: this.template.columns
                    .reduce((collector, column) => {
                        collector.push({
                            name: column.name,
                            meta: {
                                sort: column.meta.sort,
                                visible: column.meta.visible,
                            },
                        });
                        return collector;
                    }, []),
                filterScenarios: this.state.filterScenarios,
            };
        },
        preferencesKey() {
            return `VueTable_${this.id}_preferences`;
        },
        slots() {
            return this.bodySlots()
                .concat(...this.controlSlots())
                .concat(...this.customTotals());
        },
        template() {
            return this.state.template;
        },
    },

    provide() {
        return {
            action: this.action,
            actionPath: this.actionPath,
            activeScenario: this.activeScenario,
            ajax: this.ajax,
            bodySlots: this.bodySlots,
            buttonAction: this.buttonAction,
            closeConfirmation: this.closeConfirmation,
            columnAlignment: this.columnAlignment,
            controlSlots: this.controlSlots,
            customTotals: this.customTotals,
            doButtonAction: this.doButtonAction,
            exportData: this.exportData,
            fetch: this.fetch,
            hasContent: this.hasContent,
            hasEntries: this.hasEntries,
            hasFooter: this.hasFooter,
            hasSelection: this.hasSelection,
            hiddenColspan: this.hiddenColspan,
            hiddenColumns: this.hiddenColumns,
            i18n: this.i18n,
            id: this.id,
            init: this.init,
            invisibleColumns: this.invisibleColumns,
            isChild: this.isChild,
            isEmpty: this.isEmpty,
            isHighlighted: this.isHighlighted,
            refreshPageSelected: this.refreshPageSelected,
            reset: this.reset,
            state: this.state,
            togglePageSelect: this.togglePageSelect,
            totalFormat: this.totalFormat,
            visibleColumn: this.visibleColumn,
            visibleColumns: this.visibleColumns,
        };
    },

    watch: {
        filters: {
            handler: 'filterUpdate',
            deep: true,
        },
        internalFilters: {
            handler: 'filterUpdate',
            deep: true,
        },
        intervals: {
            handler: 'filterUpdate',
            deep: true,
        },
        length: 'filterUpdate',
        params: {
            handler: 'filterUpdate',
            deep: true,
        },
        preferences: {
            handler: 'savePreferences',
            deep: true,
        },
        search: 'filterUpdate',
    },

    created() {
        this.init();
    },

    beforeDestroy() {
        if (this.ongoingRequest) {
            this.ongoingRequest.cancel();
        }
    },

    methods: {
        activeScenario() {
            return this.state.filterScenarios.find(({ active }) => active);
        },
        init() {
            axios.get(this.path, { params: { params: this.initParams } })
                .then(({ data }) => {
                    this.prepare(data);
                    this.$nextTick(() => {
                        this.state.ready = true;
                        this.$emit('ready');
                        this.fetch();
                    });
                }).catch(this.errorHandler);
        },
        prepare({ apiVersion, template, meta }) {
            this.state.apiVersion = apiVersion;
            this.state.template = template;
            this.state.meta = meta;
            this.bootEnums();
            this.loadPreferences();
        },
        bootEnums() {
            this.template.columns.filter(column => column.enum)
                .forEach(column => (column.enum = new Enum(column.enum, this.i18n)));
        },
        loadPreferences() {
            const preferences = this.userPreferences();

            if (this.invalidPreferences(preferences)) {
                this.clearPreferences();
                return;
            }

            this.matchProperties(preferences.meta, this.meta);

            this.matchProperties(preferences.template, this.template);

            preferences.columns.forEach(source => {
                const dest = this.template.columns
                    .find(({ name }) => name === source.name);
                this.matchProperties(source.meta, dest.meta);
            });

            this.state.filterScenarios = preferences.filterScenarios;
        },
        matchProperties(source, dest) {
            Object.keys(source).forEach(key => {
                this.$set(dest, key, source[key]);
            });
        },
        userPreferences() {
            return localStorage.getItem(this.preferencesKey)
                ? JSON.parse(localStorage.getItem(this.preferencesKey))
                : null;
        },
        invalidPreferences(preferences) {
            return !preferences
                || preferences.apiVersion !== this.state.apiVersion
                || preferences.columns.length !== this.template.columns.length
                || preferences.columns
                    .some(({ name }) => !this.template.columns
                        .some(column => name === column.name));
        },
        savePreferences() {
            localStorage.setItem(this.preferencesKey, JSON.stringify(this.preferences));
        },
        clearPreferences() {
            localStorage.removeItem(this.preferencesKey);
        },
        reset() {
            this.$emit('reset');
            this.clearPreferences();
            this.meta.search = '';

            if (this.activeScenario()) {
                this.activeScenario().active = false;
            }

            this.init();
        },
        request() {
            if (this.ongoingRequest) {
                this.ongoingRequest.cancel();
            }

            this.ongoingRequest = axios.CancelToken.source();

            return this.template.method === 'GET'
                ? axios[this.template.method.toLowerCase()](
                    this.template.readPath, {
                        ...this.readRequest(this.template.method),
                        cancelToken: this.ongoingRequest.token,
                    },
                )
                : axios[this.template.method.toLowerCase()](
                    this.template.readPath,
                    this.readRequest(this.template.method),
                    { cancelToken: this.ongoingRequest.token },
                );
        },
        fetch() {
            this.meta.loading = true;
            this.state.expanded = [];
            this.$emit('fetching');

            return this.request().then(response => {
                const body = response.data;
                this.meta.loading = false;
                this.meta.forceInfo = false;

                if (body.data.length === 0 && this.meta.start > 0) {
                    this.meta.start = 0;
                    this.fetch();
                    return;
                }

                this.state.body = body;

                if (this.meta.number) {
                    this.processNumber();
                }

                this.$emit('fetched');

                this.$nextTick(this.refreshPageSelected);
            }).catch(error => {
                this.meta.loading = false;

                if (!axios.isCancel(error)) {
                    this.errorHandler(error);
                }
            });
        },
        readRequest(method, exportMode = false, selection = false) {
            const params = selection
                ? { selection: this.state.selected }
                : {
                    internalFilters: this.internalFilters,
                    filters: this.filters,
                    intervals: this.intervals,
                    params: this.params,
                    columns: this.requestColumns(exportMode),
                    meta: {
                        start: this.meta.start,
                        length: this.meta.length,
                        sort: this.meta.sort,
                        search: this.meta.search,
                        forceInfo: this.meta.forceInfo,
                        searchMode: this.meta.searchMode,
                    },
                };

            return method === 'GET'
                ? { params }
                : params;
        },
        requestColumns(exportMode) {
            return this.template.columns.reduce((columns, column) => {
                const meta = {};

                if (column.meta.sort) {
                    meta.sort = column.meta.sort;
                }

                if (exportMode) {
                    meta.visible = column.meta.visible;
                }

                if (meta.hasOwnProperty('sort') || meta.hasOwnProperty('visible')) {
                    columns.push({ name: column.name, meta });
                }

                return columns;
            }, []);
        },
        processNumber() {
            this.template.columns
                .filter(column => !!column.number)
                .forEach(column => (new NumberFormatter(this, column)).handle());
        },
        isEmpty() {
            return this.body && this.body.count === 0;
        },
        hasContent() {
            return this.body && this.body.count > 0;
        },
        hasEntries() {
            return this.body && this.body.data.length > 0;
        },
        hasFooter() {
            return this.meta.total
                && this.body
                && this.body.fullRecordInfo;
        },
        hasSelection() {
            return this.state.selected.length > 0;
        },
        visibleColumns() {
            return this.template.columns
                .filter(({ meta }) => !meta.rogue);
        },
        invisibleColumns() {
            return this.template.columns
                .filter(({ meta }) => !meta.rogue && !meta.visible);
        },
        visibleColumn(column) {
            return column.meta.visible
                && !column.meta.hidden
                && !column.meta.rogue;
        },
        columnAlignment(column) {
            return column.align
                ? this.template.aligns[column.align]
                : this.template.align;
        },
        exportData({ path, postEvent }) {
            axios[this.template.method.toLowerCase()](
                path, this.readRequest(this.template.method, true),
            ).then(({ data }) => {
                if (postEvent) {
                    this.$emit(postEvent, data);
                }
            }).catch(error => {
                this.meta.loading = false;
                this.errorHandler(error);
            });
        },
        ajax(method, path, postEvent) {
            axios[method.toLowerCase()](path).then(({ data }) => {
                this.fetch();

                if (postEvent) {
                    this.$emit(postEvent, data);
                }
            }).catch(error => {
                this.meta.loading = false;
                this.errorHandler(error);
            });
        },
        action({
            method, path, postEvent, selection = false,
        }) {
            this.meta.loading = true;

            axios[method.toLowerCase()](path, this.readRequest(method, false, selection))
                .then(({ data }) => {
                    this.meta.loading = false;
                    if (postEvent) {
                        this.$emit(postEvent, data);
                    }
                }).catch(error => {
                    this.meta.loading = false;
                    this.errorHandler(error);
                });
        },
        filterUpdate() {
            if (this.state.ready) {
                this.meta.start = 0;
                this.fetch();
            }
        },
        togglePageSelect() {
            this.body.data.forEach(row => this.toggleRowSelect(row));

            const event = this.state.pageSelected ? 'select-page' : 'deselect-page';

            this.$emit(event, this.state.selected);
        },
        toggleRowSelect(row) {
            if (this.isChild(row)) {
                return;
            }

            const index = this.state.selected
                .findIndex(id => id === row[this.template.dtRowId]);

            if (index === -1 && this.state.pageSelected) {
                this.state.selected.push(row[this.template.dtRowId]);
            } else if (index !== -1 && !this.state.pageSelected) {
                this.state.selected.splice(index, 1);
            }
        },
        refreshPageSelected() {
            this.state.pageSelected = this.body && this.body.data
                && this.body.data.some(row => this.state.selected
                    .some(id => id === row[this.template.dtRowId]));
        },
        isHighlighted(dtRowId) {
            return this.state.highlighted.includes(dtRowId);
        },
        highlight(dtRowId) {
            this.state.highlighted.push(dtRowId);
        },
        removeHighlight(dtRowId) {
            const index = this.state.highlighted.indexOf(dtRowId);

            if (index >= 0) {
                this.state.highlighted.splice(index, 1);
            }
        },
        toggleHighlight(dtRowId) {
            if (this.isHighlighted(dtRowId)) {
                this.removeHighlight(dtRowId);
            } else {
                this.highlight(dtRowId);
            }
        },
        clearHighlighted() {
            this.state.highlighted = [];
        },
        clearSelected() {
            this.state.selected = [];
            this.state.pageSelected = false;
        },
        buttonAction(button, row = null) {
            this.state.action.button = button;
            this.state.action.row = row;

            if (button.confirmation) {
                this.showConfirmation();
            } else {
                this.doButtonAction();
            }
        },
        showConfirmation() {
            this.state.confirmation = true;
        },
        doButtonAction() {
            const { button, row } = this.state.action;

            this.closeConfirmation();

            if (button.event) {
                this.$emit(button.event, row);
            }

            switch (button.action) {
            case 'export':
                this.exportData(button);
                break;
            case 'router':
                this.$router.push({
                    name: button.route,
                    params: row ? this.routeParams(button, row) : {},
                }).catch(this.routerErrorHandler);
                break;
            case 'ajax':
                if (row) {
                    this.ajax(
                        button.method,
                        this.actionPath(button, row[this.template.dtRowId]),
                        button.postEvent,
                    );
                } else {
                    this.action(button);
                }
                break;
            default:
                break;
            }
        },
        routeParams(button, row) {
            const params = {};

            params[this.template.model] = row[this.template.dtRowId];

            return button.params
                ? { ...params, ...button.params }
                : params;
        },
        actionPath({ path }, dtRowId) {
            return path.replace('dtRowId', dtRowId);
        },
        closeConfirmation() {
            this.state.confirmation = false;
            this.state.action.button = null;
            this.state.action.row = null;
        },
        totalFormat(value) {
            const x = value.toString().split('.');
            let x1 = x[0];
            const x2 = x.length > 1 ? `.${x[1]}` : '';
            const rgx = /(\d+)(\d{3})/;

            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1,$2');
            }

            return x1 + x2;
        },
        isChild(row) {
            return Array.isArray(row);
        },
        columnSlots() {
            return this.state.ready
                ? this.template.columns
                    .filter(column => column.meta.slot)
                    .map(column => column.name)
                : [];
        },
        actionSlots() {
            return this.state.ready
                ? this.template.buttons.row
                    .filter(button => button.slot)
                    .map(button => button.slot)
                : [];
        },
        controlSlots() {
            return this.state.ready
                ? this.template.buttons.global
                    .filter(button => button.slot)
                    .map(button => button.slot)
                : [];
        },
        bodySlots() {
            return this.columnSlots()
                .concat(...this.actionSlots())
                .concat('preview');
        },
        customTotals() {
            return this.state.ready
                ? this.template.columns
                    .filter(column => column.meta.customTotal)
                    .map(column => `${column.name}_custom_total`)
                : [];
        },
        hiddenColumns() {
            return this.state.ready
                ? this.template.columns && this.template.columns
                    .filter(column => column.meta.hidden && column.meta.visible)
                : [];
        },
        hiddenColspan() {
            const hiddenLength = this.hiddenColumns().length;

            return this.template.columns.length
                - (hiddenLength ? hiddenLength - 1 : 0)
                + (this.template.actions ? 2 : 1)
                + (this.template.selectable ? 1 : 0);
        },
    },

    render() {
        return this.$slots.default;
    },
};
</script>
