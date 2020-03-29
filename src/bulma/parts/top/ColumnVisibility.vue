<template>
    <dropdown class="column-visibility"
        manual>
        <template v-slot:label>
            <span class="icon is-small">
                <fa icon="eye"/>
            </span>
        </template>
        <template v-slot:controls>
            <div class="has-padding-medium">
                <div class="level is-mobile">
                    <div class="level-item">
                        <a class="button is-small"
                            :class="{ 'is-info': invisibleColumns().length === 0 }"
                            @click="all">
                            {{ i18n('all') }}
                        </a>
                    </div>
                    <div class="level-item">
                        <a class="button is-small"
                            :class="{ 'is-info': visibleColumns().length === invisibleColumns().length }"
                            @click="none">
                            {{ i18n('none') }}
                        </a>
                    </div>
                </div>
            </div>
        </template>
        <template v-slot:items>
            <dropdown-item v-for="column in visibleColumns()"
                :key="column.name">
                <label class="checkbox">
                <input type="checkbox"
                    v-model="column.meta.visible">
                {{ i18n(column.label) }}
            </label>
            </dropdown-item>
        </template>
    </dropdown>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, DropdownItem } from '@enso-ui/dropdown/bulma';

library.add(faEye);

export default {
    name: 'ColumnVisibility',

    components: { Dropdown, DropdownItem },

    inject: ['i18n', 'visibleColumns', 'invisibleColumns'],

    methods: {
        all() {
            this.visibleColumns().forEach(column => column.meta.visible = true);
        },
        none() {
            this.visibleColumns().forEach(column => column.meta.visible = false);
        },
    },
};
</script>

<style lang="scss">
    .vue-table .column-visibility {
        .options {
            max-height: 250px;

            .dropdown-item {
                padding: .5em .8em;
            }
        }

        .button .icon:first-child:not(:last-child) {
            margin: unset;
        }
    }
</style>
