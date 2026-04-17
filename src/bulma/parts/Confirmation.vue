<template>
    <modal @close="closeConfirmation">
        <template #default="{ close }">
            <div class="box">
                <div class="level is-mobile">
                    <div class="level-left">
                        <div class="level-item">
                            <p class="title is-5 animate__animated animate__flash">
                                {{ i18n(state.action.button.message) }}
                            </p>
                        </div>
                    </div>
                    <div class="level-right">
                        <div class="level-item">
                            <button class="button"
                                @click="close">
                                {{ i18n("Cancel") }}
                            </button>
                            <button class="button is-dark ml-1"
                                @click="doButtonAction(); close();">
                                {{ i18n("Delete") }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </modal>
</template>

<script>
import { Modal } from '@enso-ui/modal/bulma';

export default {
    name: 'Confirmation',

    components: { Modal },

    inject: ['closeConfirmation', 'doButtonAction', 'i18n', 'state'],
};
</script>
