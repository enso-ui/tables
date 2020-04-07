<template>
    <div class="level">
        <div class="level-left">
            <div class="level-item">
                {{ i18n('Value') }}
            </div>
        </div>
        <div class="level-right">
            <div class="level-item">
                <vue-switch class="is-medium"
                    v-model="filter.value"/>
            </div>
        </div>
    </div>
</template>

<script>
import VueSwitch from '@enso-ui/switch/bulma';

export default {
    name: 'Boolean',

    components: { VueSwitch },

    inject: ['i18n'],

    props: {
        filter: {
            type: Object,
            required: true,
        },
    },

    computed: {
        applicable() {
            return true
        },
    },

    created() {
        this.filter.type = 'boolean';
        this.filter.value = true;
    }
};
</script>
