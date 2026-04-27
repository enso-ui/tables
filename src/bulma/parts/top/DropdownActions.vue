<template>
    <core-dropdown-actions>
        <template #default="{ buttons, disabled, controlBindings,
            controlEvents, hasSelection }">
             <dropdown class="table-dropdown"
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
                        <control class="is-fullwidth dropdown-action-control"
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
        background: transparent !important;
        border-bottom: 1px solid color-mix(in srgb, var(--bulma-border) 40%, transparent);
    }

    .dropdown-item:last-child {
        border-bottom: 0;
    }

    .dropdown-action-control.button {
        width: 100%;
        min-height: unset;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        padding: 0.6rem 0.85rem;
        border: 0 !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        background: transparent !important;
        color: var(--bulma-dropdown-item-color) !important;
        font-weight: 500;
    }

    .dropdown-action-control.button.is-dark,
    .dropdown-action-control.button.is-black,
    .dropdown-action-control.button.has-background-dark,
    .dropdown-action-control.button.has-background-black {
        background: transparent !important;
        background-color: transparent !important;
        color: var(--bulma-dropdown-item-color) !important;
    }

    .dropdown-action-control.button:hover,
    .dropdown-action-control.button:focus,
    .dropdown-item.is-active .dropdown-action-control.button,
    .dropdown-item.is-current .dropdown-action-control.button {
        background: var(--bulma-scheme-main-ter) !important;
        color: var(--bulma-text-strong) !important;
    }
}
</style>
