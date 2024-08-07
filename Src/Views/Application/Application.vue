<script lang="ts" setup>
import { provide } from 'vue';
import { Application } from './Application';
import TabVue from './Component/Tab/Tab.vue';
import MissionVue from './Component/Mission/Mission.vue';
import logoIcon from '@/Assets/MC/logo.png';

const instance = new Application();

provide('instance', instance);

const { isExpand } = instance.InitStates();

instance.InitHooks();

instance.Run();
</script>

<template>
    <div class="Application">
        <span class="All" v-show="isExpand">
            <TabVue></TabVue>
            <MissionVue></MissionVue>
        </span>
        <span class="Single" v-show="!isExpand">
            <span class="Icon" @dblclick="instance.tab.OnClickExpand()" data-tauri-drag-region>
                <img :src="logoIcon" alt="" />
            </span>
        </span>
    </div>
</template>

<style lang="scss" scoped>
@import './Application.scss';
</style>
