<template>
    <dropdown class="state">
        <template v-slot:trigger="{ triggerEvents }">
            <div class="field is-grouped"
                v-if="activeScenario() && !activeScenario().edit">
                <p class="control">
                    <a class="button"
                        @click="edit">
                        <span class="icon">
                            <fa icon="pencil-alt"/>
                        </span>
                    </a>
                    <a class="button"
                        @click="remove">
                        <span class="icon">
                            <fa icon="trash-alt"/>
                        </span>
                    </a>
                </p>
            </div>
            <div class="field is-grouped"
                v-else>
                <a class="button"
                    @click="cancel"
                    v-if="activeScenario()">
                    <span class="icon">
                        <fa icon="ban"/>
                    </span>
                </a>
                <a class="button"
                    v-on="triggerEvents"
                    @click="name = activeScenario() ? activeScenario().name : null">
                    <span class="icon">
                        <fa icon="save"/>
                    </span>
                </a>
            </div>
        </template>
        <template v-slot:controls="{ hide }">
            <div class="field has-addons has-padding-left-medium has-padding-right-medium is-marginless">
                <p class="control is-expanded">
                    <input class="input"
                        :class="{ 'is-warning': warning }"
                        v-model="activeScenario().name"
                        v-focus
                        v-select-on-focus
                        @input="warning = false"
                        @keydown.enter.stop="save(); hide()"
                        :placeholder="i18n('Save scenario under an alias')">
                </p>
                <p class="control">
                    <a class="button"
                        :disabled="!name"
                        @click="save(); hide()">
                        <span class="icon">
                            <fa icon="check"/>
                        </span>
                    </a>
                </p>
            </div>
        </template>
    </dropdown>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faSave, faTrashAlt, faPencilAlt, faBan,
} from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from '@enso-ui/dropdown/bulma';
import { focus, selectOnFocus } from '@enso-ui/directives';

library.add(faSave, faTrashAlt, faPencilAlt, faBan);

export default {
    name: 'State',

    directives: { focus, selectOnFocus },

    components: { Dropdown },

    inject: ['activeScenario', 'i18n', 'state'],

    data: () => ({
        scenario: null,
        warning: false,
    }),

    computed: {
        activeScenarioIndex() {
            return this.state.filterScenarios.findIndex(({ active }) => active);
        },
    },

    created() {

    },

    methods: {
        cancel() {
            this.state.filterScenarios.splice(this.activeScenarioIndex, 1, this.scenario);
        },
        remove() {
            this.state.filterScenarios.splice(this.activeScenarioIndex, 1);
        },
        save() {
            if (!this.activeScenario().name
                || this.state.filterScenarios.find(({ name }) => name === this.name)) {
                this.warning = true;
                return;
            }

            this.activeScenario().edit = false;

            this.scenario = null;
        },
        snapshot() {
            return JSON.parse(JSON.stringify(this.activeScenario()));
        },
    },
};
</script>

<style lang="scss">
    .vue-table .dropdown.state .dropdown-menu .dropdown-content {
        width: 24em;
    }
</style>
