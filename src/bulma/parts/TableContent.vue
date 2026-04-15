<template>
    <top-controls v-bind="$attrs">
        <template #[slot]="props"
            v-for="slot in controlSlots()">
            <slot :name="slot"
                v-bind="props"/>
        </template>
    </top-controls>
    <div class="table-responsive"
        v-responsive="state.template.responsive">
        <table class="table is-fullwidth m-0"
            :class="state.template.style"
            :id="id"
            v-if="hasContent()">
            <table-header ref="header"/>
            <table-body v-bind="$attrs">
                <template #[slot]="props"
                    v-for="slot in bodySlots()">
                    <slot :name="slot"
                        v-bind="props"/>
                </template>
            </table-body>
            <table-footer v-if="hasFooter()">
                <template #[customTotal]="props"
                    v-for="customTotal in customTotals()">
                    <slot :name="customTotal"
                        v-bind="props"/>
                </template>
            </table-footer>
        </table>
        <skeleton type="table"
            :columns="state.template.columns.length"
            :rows="state.meta.length"
            v-if="skeleton"/>
        <overlay v-else-if="showOverlay"/>
    </div>
    <bottom-controls v-bind="$attrs"
        v-if="hasContent()"/>
    <div class="has-text-centered no-records-found"
        v-else-if="!skeleton">
        {{ i18n('No records were found') }}
    </div>
    <confirmation v-if="state.confirmation"/>
</template>

<script>
import { Overlay, Skeleton } from '@enso-ui/loader/bulma';
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
        Overlay,
        Skeleton,
        BottomControls,
        Confirmation,
    },

    inject: [
        'bodySlots', 'controlSlots', 'customTotals', 'hasContent',
        'hasFooter', 'hiddenColumns', 'i18n', 'id', 'isEmpty', 'state', 'visibleColumn',
    ],

    inheritAttrs: false,

    computed: {
        showOverlay() {
            return this.state.meta.loading && this.hasContent();
        },
        skeleton() {
            return this.state.meta.loading && !this.hasContent();
        },
    },
};
</script>
