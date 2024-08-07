<script lang="ts" setup>
import { inject } from 'vue';
import { Application } from '../../Application';
import logoIcon from '@/Assets/MC/logo.png';

const instance = inject('instance') as Application;

const { btns } = instance.tab.InitStates();

instance.tab.InitHooks();

instance.tab.Run();
</script>

<template>
    <div class="Tab">
        <span class="Drag" data-tauri-drag-region></span>
        <span class="Logo" @dblclick="instance.tab.OnClickExpand()" data-tauri-drag-region>
            <img :src="logoIcon" alt="" />
        </span>
        <!-- <span class="Title">IMark</span> -->
        <span class="Btns">
            <span class="Item" v-for="b in btns" :key="b.label" @click="instance.tab.OnClickBtn(b.label)">
                <img :src="b.icon" alt="" />
            </span>
        </span>
    </div>
</template>

<style lang="scss" scoped>
@import './Tab.scss';
</style>
