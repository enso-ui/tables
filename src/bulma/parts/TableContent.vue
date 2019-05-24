<template>
    <div class="vue-table">
        <top-controls v-on="$listeners"/>
        <div class="table-responsive"
            v-responsive="state.template.responsive">
            <table class="table is-fullwidth is-marginless"
                :class="state.template.style"
                :id="id"
                v-if="hasContent()">
                <table-header ref="header"/>
                <table-body v-on="$listeners">
                    <template v-slot:[slot]="props"
                        v-for="slot in scopedSlots()">
                        <slot :name="slot"
                            v-bind="props"/>
                    </template>
                    <template v-slot:preview="props">
                        <slot name="preview"
                            v-bind="props"/>
                    </template>
                </table-body>
                <table-footer v-if="hasFooter()">
                    <template v-slot:[customTotal]="props"
                        v-for="customTotal in customTotals()">
                        <slot :name="customTotal"
                            v-bind="props"/>
                    </template>
                </table-footer>
            </table>
            <loader v-if="state.meta.loading === true"/>
        </div>
        <bottom-controls v-if="hasContent()"/>
        <div class="has-text-centered no-records-found"
            v-if="isEmpty()">
            {{ i18n('No records were found') }}
        </div>
        <confirmation v-if="state.confirmation"/>
    </div>
</template>
<script>
import Loader from '@enso-ui/loader/bulma';
import TopControls from './top/Controls.vue';
import TableHeader from './TableHeader.vue';
import TableBody from './TableBody.vue';
import TableFooter from './TableFooter.vue';
import BottomControls from './bottom/Controls.vue';
import Confirmation from './Confirmation.vue';
import vResponsive from '../responsive/vResponsive';

export default {
    name: 'TableContent',

    directives: { responsive: vResponsive },

    components: {
        TopControls,
        TableHeader,
        TableBody,
        TableFooter,
        Loader,
        BottomControls,
        Confirmation,
    },

    inject: [
        'state', 'id', 'hasContent', 'hasFooter', 'isEmpty',
        'visibleColumns', 'scopedSlots', 'customTotals', 'i18n',
    ],

    computed: {
        columns() {
            return this.visibleColumns();
        },
    },
};
</script>

<style lang="scss">
    .vue-table {
        .table-responsive {
            width: 100%;
            overflow-x: auto;
            .table {
                font-size: 0.95em;
                td, th {
                    vertical-align: middle;
                }
            }
        }
        .no-records-found {
            padding: 1em;
        }
    }
</style>
