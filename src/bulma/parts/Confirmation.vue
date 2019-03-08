<template>
    <modal show
        @close="closeConfirmation">
        <div class="box">
            <h5 class="subtitle is-5">
                {{ i18n(state.action.button.message || "Are you sure?") }}
            </h5>
            <hr>
            <div class="level">
                <div class="level-left"/>
                <div class="level-right">
                    <div class="level-item">
                        <button class="button is-outlined"
                            @click="closeConfirmation">
                            {{ i18n("Cancel") }}
                        </button>
                        <button class="button is-danger has-margin-left-small"
                            v-focus
                            @click="doButtonAction">
                            {{ i18n("Yes") }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </modal>
</template>

<script>
import { focus } from '@enso-ui/directives';
import { Modal } from '@enso-ui/modal/bulma';

export default {
    name: 'Confirmation',

    components: { Modal },

    directives: { focus },

    inject: ['state', 'i18n', 'closeConfirmation', 'doButtonAction'],
};
</script>
