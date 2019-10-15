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
        i18n: {
            type: Function,
            default: v => v,
        },
        id: {
            type: String,
            required: true,
        },
        initParams: {
            type: Object,
            default: null,
        },
        intervals: {
            type: Object,
            default: null,
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
        ongoingRequest: null,
    }),

    computed: {
        template() {
            return this.state.template;
        },
        meta() {
            return this.state.meta;
        },
        body() {
            return this.state.body;
        },
        preferencesKey() {
            return `VueTable_${this.id}_preferences`;
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
            hiddenColumns: this.hiddenColumns,
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
                this.savePreferences();
            },
            deep: true,
        },
    },

    created() {
        this.init();
    },

    methods: {
        init() {
            axios.get(this.path, { params: { params: this.initParams } })
                .then(({ data }) => {
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

            this.matchProperties(preferences.meta, this.meta);

            this.matchProperties(preferences.template, this.template);

            preferences.columns.forEach((source) => {
                const dest = this.template.columns
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

            this.request().then((response) => {
                const body = response.data;
                this.meta.loading = false;
                this.meta.forceInfo = false;

                if (body.data.length === 0 && this.meta.start > 0) {
                    this.meta.start = 0;
                    this.fetch();
                    return;
                }

                this.state.body = this.meta.money
                    ? this.processMoney(body)
                    : body;

                this.$emit('fetched');

                this.$nextTick(() => this.refreshPageSelected());
            }).catch((error) => {
                this.meta.loading = false;

                if (!axios.isCancel(error)) {
                    this.errorHandler(error);
                }
            });
        },
        readRequest(method, exportMode = false) {
            const params = {
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

                columns.push({ meta });

                return columns;
            }, []);
        },
        processMoney(body) {
            this.template.columns
                .filter(column => !!column.money)
                .forEach((column) => {
                    const total = this.meta.total
                        && Object.keys(body.total).includes(column.name);

                    let money = body.data.map(row => Number.parseFloat(row[column.name]) || 0);

                    if (total) {
                        money.push(Number.parseFloat(body.total[column.name]) || 0);
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
        visibleColumns() {
            return this.template.columns
                .filter(({ meta }) => !meta.rogue);
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
        exportData(path) {
            axios[this.template.method.toLowerCase()](
                path, this.readRequest(this.template.method, true),
            ).catch((error) => {
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
            }).catch((error) => {
                this.meta.loading = false;
                this.errorHandler(error);
            });
        },
        action(method, path, postEvent) {
            this.meta.loading = true;

            axios[method.toLowerCase()](path, this.readRequest(method))
                .then(({ data }) => {
                    this.meta.loading = false;
                    if (postEvent) {
                        this.$emit(postEvent, data);
                    }
                }).catch((error) => {
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
            this.body.data.forEach((row) => {
                if (!this.isChild(row)) {
                    const index = this.state.selected
                        .findIndex(id => id === row[this.template.dtRowId]);
                    if (!this.state.pageSelected) {
                        this.state.selected.splice(index, 1);
                    } else if (index === -1) {
                        this.state.selected.push(row[this.template.dtRowId]);
                    }
                }
            });
        },
        refreshPageSelected() {
            this.state.pageSelected = this.body && this.body.data
                && this.body.data.some(row => this.state.selected
                    .some(id => id === row[this.template.dtRowId]));
        },
        highlight(dtRowId) {
            const index = this.body.data
                .findIndex(row => row[this.template.dtRowId] === dtRowId);

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
                        this.actionPath(button, row[this.template.dtRowId]),
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

            params[this.template.model] = row[this.template.dtRowId];

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
                ? this.template.columns
                    .filter(column => column.meta.slot)
                    .map(column => column.name)
                : [];
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
    },

    render() {
        return this.$slots.default;
    },
};
</script>
