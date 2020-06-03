<template>
    <div class="scenarios field is-grouped is-grouped-multiline has-background-light">
        <div class="control">
            <div class="tags has-addons">
                <a class="tag is-bold"
                    :class="none ? 'is-info' : 'is-warning'"
                    @click="all">
                    {{ i18n('all') }}
                </a>
            </div>    
        </div>
        <div class="control"
            v-for="(scenario, index) in state.filterScenarios"
            :key="index">
            <div class="tags has-addons">
                <a class="tag is-bold"
                    :class="scenario.active ? 'is-info' : 'is-warning'"
                    v-if="scenario.edit && scenario.active">
                    <input class="input is-small has-background-info has-text-white is-bold"
                        :class="{ 'has-background-danger': duplicate }"
                        v-model="scenario.name"
                        v-resize
                        v-focus
                        v-select-on-focus
                        @keydown.enter="save">
                </a>
                <a class="tag is-bold"
                    :class="scenario.active ? 'is-info' : 'is-warning'"
                    @click="select(scenario)"
                    v-else>
                    {{ scenario.name }}
                </a>
                <template v-if="scenario.active">
                    <template v-if="scenario.edit">
                        <a class="tag is-info"
                            @click="cancel">
                            <span class="icon is-small">
                                <fa icon="ban"/>
                            </span>
                        </a>
                        <a class="tag is-info has-text-white"
                            @click="save">
                            <span class="icon is-small">
                                <fa icon="check"/>
                            </span>
                        </a>
                    </template>
                    <template v-else>
                        <a class="tag is-info"
                            @click="edit">
                            <span class="icon is-small">
                                <fa icon="pencil-alt"/>
                            </span>
                        </a>
                        <a class="tag is-info has-text-white"
                            @click="remove">
                            <span class="icon is-small">
                                <fa icon="times"/>
                            </span>
                        </a>
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSave, faTrashAlt, faPencilAlt, faBan, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { focus, selectOnFocus, resize } from '@enso-ui/directives';

library.add(faSave, faTrashAlt, faPencilAlt, faBan, faCheck, faTimes);

export default {
    name: 'Scenarios',

    directives: { focus, selectOnFocus, resize },

    inject: ['activeScenario', 'i18n', 'state'],

    data: () => ({
        original: null,
    }),

    computed: {
        activeScenarioIndex() {
            return this.state.filterScenarios.findIndex(({ active }) => active);
        },
        duplicate() {
            return this.state.filterScenarios
                .filter(({ name }) => name === this.activeScenario()?.name).length > 1;
        },
        none() {
            return !this.activeScenario();
        },
    },

    methods: {
        all() {
            if (this.activeScenario()) {
                this.activeScenario().active = false;
            }
        },
        cancel() {
            if (this.original) {
                this.state.filterScenarios.splice(this.activeScenarioIndex, 1, this.original);
                this.original = null;
            } else {
                this.state.filterScenarios.splice(this.activeScenarioIndex, 1);
            }
        },
        edit() {
            this.original = JSON.parse(JSON.stringify(this.activeScenario()));
            this.activeScenario().edit = true;
        },
        remove() {
            this.state.filterScenarios.splice(this.activeScenarioIndex, 1);
        },
        save() {
            if (this.duplicate) {
                return;
            }

            this.activeScenario().edit = false;

            this.original = null;

            if (this.activeScenario().filters.length === 0) {
                this.remove();
            }
        },
        select({ name, filters }) {
            this.state.filterScenarios
                .forEach(scenario => scenario.active = scenario.name === name);
        },
        snapshot() {
            return JSON.parse(JSON.stringify(this.activeScenario()));
        },
    },
};
</script>

<style lang="scss">
    .scenarios {
        a.tag:hover {
            text-decoration: none;
        }

        input.input.is-small {
            height: 20px;
        }
    }
</style>
