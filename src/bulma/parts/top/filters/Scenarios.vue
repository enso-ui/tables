<template>
    <div class="scenarios field is-grouped is-grouped-multiline">
        <div class="control">
            <div class="tags has-addons">
                <a class="tag"
                    :class="{ 'is-warning' : activeScenario() }"
                    @click="all">
                    {{ i18n('all') }}
                </a>
            </div>
        </div>
        <div class="control"
            v-for="(scenario, index) in state.filterScenarios"
            :key="index">
            <div class="tags has-addons">
                <a class="tag"
                    v-if="scenario.edit && scenario.active">
                    <input class="input is-small"
                        :class="{ 'has-text-danger': duplicate }"
                        v-model="scenario.name"
                        v-resize
                        v-focus
                        v-select-on-focus
                        @keydown.enter="save">
                </a>
                <a class="tag"
                    :class="{ 'is-dark': scenario.active }"
                    @click="select(scenario)"
                    v-else>
                    {{ scenario.name }}
                </a>
                <template v-if="scenario.active">
                    <template v-if="scenario.edit">
                        <a class="tag"
                            @click="cancel">
                            <span class="icon is-small">
                                <fa :icon="faBan"/>
                            </span>
                        </a>
                        <a class="tag"
                            @click="save">
                            <span class="icon is-small">
                                <fa :icon="faCheck"/>
                            </span>
                        </a>
                    </template>
                    <template v-else>
                        <a class="tag"
                            @click="edit">
                            <span class="icon is-small">
                                <fa :icon="faPen"
                                    size="sm"/>
                            </span>
                        </a>
                        <a class="tag"
                            @click="remove">
                            <span class="icon is-small">
                                <fa :icon="faXmark"/>
                            </span>
                        </a>
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import {
    faBan, faCheck, faPen, faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { focus, selectOnFocus, resize } from '@enso-ui/directives';

export default {
    name: 'Scenarios',

    directives: { focus, selectOnFocus, resize },

    components: { Fa },

    inject: ['activeScenario', 'i18n', 'state'],

    data: () => ({
        faBan,
        faCheck,
        faPen,
        faXmark,
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
        select({ name }) {
            this.state.filterScenarios
                .forEach(scenario => (scenario.active = scenario.name === name));
        },
        snapshot() {
            return JSON.parse(JSON.stringify(this.activeScenario()));
        },
    },
};
</script>
