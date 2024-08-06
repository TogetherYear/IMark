<script lang="ts" setup>
import { provide } from 'vue';
import { Application } from './Application';
import TabVue from './Component/Tab/Tab.vue';
import MissionVue from './Component/Mission/Mission.vue';

const instance = new Application();

provide('instance', instance);

const {} = instance.InitStates();

instance.InitHooks();

instance.Run();
</script>

<template>
    <div class="Application">
        <TabVue></TabVue>
        <MissionVue></MissionVue>
    </div>
</template>

<style lang="scss" scoped>
@import './Application.scss';
</style>
