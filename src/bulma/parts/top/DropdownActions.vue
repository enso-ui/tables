<template>
    <core-dropdown-actions>
        <template #default="{ buttons, disabled, controlBindings,
            controlEvents, hasSelection }">
             <dropdown class="table-dropdown dropdown-actions"
                ref="dropdown"
                :disabled="disabled">
                <template #label>
                    <span class="icon">
                        <fa :icon="faGears"/>
                    </span>
                </template>
                <template #items>
                    <dropdown-item v-for="button in buttons"
                        :key="button.name"
                        @mouseup="$refs.dropdown.hide()">
                        <control class="is-fullwidth"
                            v-bind="controlBindings(button)"
                            :key="`${button.label}-${button.icon}`"
                            :button="button"
                            v-on="controlEvents(button)"
                            v-if="!button.selection"/>
                        <control class="is-fullwidth dropdown-action-control"
                            v-bind="controlBindings(button)"
                            :key="`${button.label}-${button.icon}`"
                            :button="button"
                            v-on="controlEvents(button)"
                            v-else-if="hasSelection()"/>
                    </dropdown-item>
                </template>
            </dropdown>
        </template>
    </core-dropdown-actions>
</template>

<script>
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import { faGears } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, DropdownItem } from '@enso-ui/dropdown/bulma';
import CoreDropdownActions from '../../../renderless/parts/top/CoreDropdownActions.vue';
import Control from './Control.vue';

export default {
    name: 'DropdownActions',

    components: {
        Control,
        CoreDropdownActions,
        Dropdown,
        DropdownItem,
        Fa,
    },

    data: () => ({
        faGears,
    }),
};
</script>

<style lang="scss">
.dropdown.dropdown-actions {
    width: unset;

    .dropdown-menu {
        width: unset;
    }

    .dropdown-content {
        background: var(--bulma-scheme-main);
        border: 1px solid var(--bulma-border);
        border-radius: var(--bulma-radius);
        overflow: hidden;
    }

    .dropdown-item {
        padding: 0;
        padding-inline-end: 0;
        background: transparent !important;
        border-bottom: 1px solid color-mix(in srgb, var(--bulma-border) 40%, transparent);

        .button {
            border:0;
        }
    }
}
</style>
