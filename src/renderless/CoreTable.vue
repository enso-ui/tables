<script>
import accounting from 'accounting-js';

export default {
    name: 'CoreTable',
    props: {
        errorHandler: {
            type: Function,
            default: (error) => {
                throw error;
            },
        },
        filters: {
            type: Object,
            default: null,
        },
        id: {
            type: String,
            required: true,
        },
        intervals: {
            type: Object,
            default: null,
        },
        i18n: {
            type: Function,
            default: v => v,
        },
        params: {
            type: Object,
            default: null,
        },
        path: {
            type: String,
            required: true,
        },
    },
    data: () => ({
        state: {
            apiVersion: null,
            ready: false,
            confirmation: false,
            action: {
                button: null,
                row: null,
            },
            pageSelected: false,
            selected: [],
            expanded: [],
            highlighted: [],
            template: {},
            body: {},
            meta: {},
        },
    }),
    computed: {
        preferencesKey() {
            return `VueTable_${this.id}_preferences`;
        },
        preferences() {
            return this.state.ready && {
                apiVersion: this.state.apiVersion,
                template: {
                    style: this.state.template.style,
                },
                meta: {
                    start: this.state.meta.start,
                    length: this.state.meta.length,
                    search: this.state.meta.search,
                    sort: this.state.meta.sort,
                },
                columns: this.state.template.columns
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
            };
        },
    },
    provide() {
        return {
            action: this.action,
            actionPath: this.actionPath,
            ajax: this.ajax,
            buttonAction: this.buttonAction,
            columnAlignment: this.columnAlignment,
            closeConfirmation: this.closeConfirmation,
            doButtonAction: this.doButtonAction,
            exportData: this.exportData,
            fetch: this.fetch,
            hasContent: this.hasContent,
            hasEntries: this.hasEntries,
            hasFooter: this.hasFooter,
            i18n: this.i18n,
            id: this.id,
            init: this.init,
            isChild: this.isChild,
            isEmpty: this.isEmpty,
            refreshPageSelected: this.refreshPageSelected,
            reset: this.reset,
            scopedSlots: this.scopedSlots,
            customTotals: this.customTotals,
            state: this.state,
            togglePageSelect: this.togglePageSelect,
            totalFormat: this.totalFormat,
            visibleColumn: this.visibleColumn,
            visibleColumns: this.visibleColumns,
        };
    },
    watch: {
        filters: {
            handler() {
                this.filterUpdate();
            },
            deep: true,
        },
        intervals: {
            handler() {
                this.filterUpdate();
            },
            deep: true,
        },
        length: {
            handler() {
                this.filterUpdate();
            },
        },
        params: {
            handler() {
                this.filterUpdate();
            },
            deep: true,
        },
        search: {
            handler() {
                this.filterUpdate();
            },
        },
        preferences: {
            handler() {
                if (this.hasContent()) {
                    this.savePreferences();
                }
            },
            deep: true,
        },
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            axios.get(this.path).then(({ data }) => {
                const { apiVersion, template, meta } = data;
                this.state.apiVersion = apiVersion;
                this.state.template = template;
                this.state.meta = meta;
                this.loadPreferences();
                this.state.ready = true;
                this.$emit('ready');
                this.fetch();
            }).catch(this.errorHandler);
        },
        loadPreferences() {
            const preferences = this.userPreferences();
            if (this.invalidPreferences(preferences)) {
                this.clearPreferences();
                return;
            }
            this.matchProperties(preferences.meta, this.state.meta);
            this.matchProperties(preferences.template, this.state.template);
            preferences.columns.forEach((source) => {
                const dest = this.state.template.columns
                    .find(({ name }) => name === source.name);
                this.matchProperties(source.meta, dest.meta);
            });
        },
        matchProperties(source, dest) {
            Object.keys(source).forEach((key) => {
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
                || preferences.columns.length !== this.state.template.columns.length
                || preferences.columns
                    .some(({ name }) => !this.state.template.columns
                        .some(column => name === column.name));
        },
        savePreferences() {
            localStorage.setItem(this.preferencesKey, JSON.stringify(this.preferences));
        },
        clearPreferences() {
            localStorage.removeItem(this.preferencesKey);
        },
        reset() {
            this.clearPreferences();
            this.state.meta.search = '';
            this.init();
        },
        fetch() {
            this.state.meta.loading = true;
            this.state.expanded = [];
            this.$emit('fetching');
            axios[this.state.template.method.toLowerCase()](
                this.state.template.readPath,
                this.readRequest(),
            ).then((response) => {
                const body = response.data;
                this.state.meta.loading = false;
                this.state.meta.forceInfo = false;
                if (body.data.length === 0 && this.state.meta.start > 0) {
                    this.state.meta.start = 0;
                    this.fetch();
                    return;
                }
                this.state.body = this.state.meta.money
                    ? this.processMoney(body)
                    : body;
                this.$emit('fetched');
                this.$nextTick(() => this.refreshPageSelected());
            }).catch((error) => {
                this.state.meta.loading = false;
                this.errorHandler(error);
            });
        },
        readRequest(method = null) {
            const params = {
                name: this.name || this.id,
                cache: this.state.template.cache,
                flatten: this.state.template.flatten,
                appends: this.state.template.appends,
                filters: this.filters,
                intervals: this.intervals,
                params: this.params,
                columns: this.requestColumns(),
                meta: this.trimNeutrals({
                    start: this.state.meta.start,
                    length: this.state.meta.length,
                    sort: this.state.meta.sort,
                    total: this.state.meta.total,
                    enum: this.state.meta.enum,
                    date: this.state.meta.date,
                    translatable: this.state.meta.translatable,
                    actions: this.state.meta.actions,
                    search: this.state.meta.search,
                    forceInfo: this.state.meta.forceInfo,
                    comparisonOperator: this.state.meta.comparisonOperator,
                    fullInfoRecordLimit: this.state.meta.fullInfoRecordLimit,
                }),
            };
            return (method || this.state.template.method) === 'GET'
                ? { params }
                : params;
        },
        requestColumns() {
            return this.state.template.columns.reduce((columns, column) => {
                columns.push({
                    label: column.label,
                    name: column.name,
                    data: column.data,
                    enum: column.enum,
                    dateFormat: column.dateFormat,
                    meta: this.trimNeutrals({
                        searchable: column.meta.searchable,
                        sortable: column.meta.sortable,
                        sort: column.meta.sort,
                        total: column.meta.total,
                        date: column.meta.date,
                        translatable: column.meta.translatable,
                        nullLast: column.meta.nullLast,
                        rogue: column.meta.rogue,
                        visible: column.meta.visible,
                        hidden: column.meta.hidden,
                        notExportable: column.meta.notExportable,
                        visible: column.meta.visible,
                    }),
                });
                return columns;
            }, []);
        },
        trimNeutrals(meta) {
            Object.keys(meta).forEach((key) => {
                if (meta[key] === false || meta[key] === null) {
                    delete meta[key];
                }
            });
            return meta;
        },
        processMoney(body) {
            this.state.template.columns
                .filter(column => !!column.money)
                .forEach((column) => {
                    const total = this.state.meta.total
                        && Object.keys(body.total).includes(column.name);
                    let money = body.data.map(row => parseFloat(row[column.name]) || 0);
                    if (total) {
                        money.push(body.total[column.name]);
                    }
                    money = accounting.formatColumn(money, column.money);
                    body.data = body.data.map((row, index) => {
                        row[column.name] = money[index];
                        return row;
                    });
                    if (total) {
                        body.total[column.name] = money.pop();
                    }
                });
            return body;
        },
        isEmpty() {
            return this.state.body && this.state.body.count === 0;
        },
        hasContent() {
            return this.state.body && this.state.body.count > 0;
        },
        hasEntries() {
            return this.state.body && this.state.body.data.length > 0;
        },
        hasFooter() {
            return this.state.meta.total
                && this.state.body
                && this.state.body.fullRecordInfo;
        },
        visibleColumns() {
            return this.state.template.columns
                .filter(({ meta }) => !meta.rogue);
        },
        visibleColumn(column) {
            return column.meta.visible
                && !column.meta.hidden
                && !column.meta.rogue;
        },
        columnAlignment(column) {
            return column.align
                ? this.state.template.aligns[column.align]
                : this.state.template.align;
        },
        exportData(path) {
            axios[this.state.template.method.toLowerCase()](
                path, this.exportRequest(),
            ).catch((error) => {
                this.state.meta.loading = false;
                this.errorHandler(error);
            });
        },
        exportRequest() {
            const params = {
                name: this.name || this.id,
                appends: this.state.template.appends,
                filters: this.filters,
                intervals: this.intervals,
                params: this.params,
                columns: this.requestColumns(),
                meta: {
                    start: 0,
                    length: this.state.body.filtered,
                    sort: this.state.template.sort,
                    enum: this.state.template.enum,
                    date: this.state.template.date,
                    translatable: this.state.template.translatable,
                    search: this.state.meta.search,
                    comparisonOperator: this.state.template.comparisonOperator,
                },
            };
            return this.state.template.method === 'GET'
                ? { params }
                : params;
        },
        ajax(method, path, postEvent) {
            axios[method.toLowerCase()](path).then(({ data }) => {
                this.$toastr.success(data.message);
                this.fetch();
                if (postEvent) {
                    this.$emit(postEvent);
                }
            }).catch((error) => {
                this.state.meta.loading = false;
                this.errorHandler(error);
            });
        },
        action(method, path, postEvent) {
            this.state.meta.loading = true;
            axios[method.toLowerCase()](path, this.readRequest(method))
                .then(() => {
                    this.state.meta.loading = false;
                    if (postEvent) {
                        this.$emit(postEvent);
                    }
                }).catch((error) => {
                    this.state.meta.loading = false;
                    this.errorHandler(error);
                });
        },
        filterUpdate() {
            if (this.state.ready) {
                this.state.meta.start = 0;
                this.fetch();
            }
        },
        togglePageSelect() {
            this.state.body.data.forEach((row) => {
                if (!this.isChild(row)) {
                    const index = this.state.selected
                        .findIndex(id => id === row.dtRowId);
                    if (!this.state.pageSelected) {
                        this.state.selected.splice(index, 1);
                    } else if (index === -1) {
                        this.state.selected.push(row.dtRowId);
                    }
                }
            });
        },
        refreshPageSelected() {
            this.state.pageSelected = this.state.body
                && this.state.body.data
                    .some(row => this.state.selected
                        .some(id => id === row.dtRowId));
        },
        highlight(id) {
            const index = this.state.body.data
                .findIndex(({ dtRowId }) => dtRowId === id);
            if (index >= 0) {
                this.state.highlighted.push(index);
            }
        },
        clearHighlighted() {
            this.state.highlighted = [];
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
                this.exportData(button.path);
                break;
            case 'router':
                this.$router.push({
                    name: button.route,
                    params: row ? this.routeParams(button, row) : {},
                });
                break;
            case 'ajax':
                if (row) {
                    this.ajax(
                        button.method,
                        this.actionPath(button, row.dtRowId),
                        button.postEvent,
                    );
                } else {
                    this.action(button.method, button.path, button.postEvent);
                }
                break;
            default:
                break;
            }
        },
        routeParams(button, row) {
            const params = {};
            params[this.state.template.pathSegment] = row.dtRowId;
            return button.params
                ? { ...params, ...button.params }
                : params;
        },
        actionPath(button, dtRowId) {
            return button.path.replace('dtRowId', dtRowId);
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
        scopedSlots() {
            return this.state.ready
                ? this.state.template.columns
                    .filter(column => column.meta.slot)
                    .map(column => column.name)
                : [];
        },
        customTotals() {
            return this.state.ready
                ? this.state.template.columns
                    .filter(column => column.meta.customTotal)
                    .map(column => `${column.name}_custom_total`)
                : [];
        },
    },
    render() {
        return this.$slots.default;
    },
};
</script>
