<template>
    <core-search-mode v-on="$listeners">
        <template v-slot:default="{ clickEvents }">
            <span class="is-right icon is-small search-mode">
                <a class="is-naked"
                    v-on="clickEvents">
                    <fal :key="state.meta.search">
                        <template v-if="state.meta.searchMode === 'startsWith'">
                            <falt :value="state.meta.search[0]"
                                :transform="`shrink-2 ${state.meta.search[1] ? 'left-10' : '' }`"/>
                            <falt :value="state.meta.search[1]"
                                transform="shrink-2"
                                v-if="state.meta.search[1]"/>
                            <fa icon="asterisk" transform="shrink-6 right-10"/>
                        </template>
                        <template v-else-if="state.meta.searchMode === 'full'">
                            <fa icon="asterisk" transform="shrink-6 left-10"/>
                            <falt :value="state.meta.search[0]" transform="shrink-2"/>
                            <fa icon="asterisk" transform="shrink-6 right-10"/>
                        </template>
                        <template v-else>
                            <fa icon="asterisk"
                                :transform="`shrink-6 ${state.meta.search[1] ? 'left-10' : '' }`"/>
                            <falt :value="state.meta.search[0]"
                                :transform="`shrink-2 ${state.meta.search[1] ? '' : 'right-10' }`"/>
                            <falt :value="state.meta.search[1]"
                                transform="shrink-2 right-10"
                                v-if="state.meta.search[1]"/>
                        </template>
                    </fal>
                </a>
            </span>
        </template>
    </core-search-mode>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAsterisk } from '@fortawesome/free-solid-svg-icons';
import CoreSearchMode from '../../../renderless/parts/top/CoreSearchMode.vue';

library.add(faAsterisk);

export default {
    name: 'SearchMode',

    inject: ['state'],

    components: { CoreSearchMode },
};
</script>