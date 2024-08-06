<script lang="ts" setup>
import { provide } from 'vue';
import HeaderBarVue from '@/Common/HeaderBar/HeaderBar.vue';
import TransformableVue from '@/Common/Transformable/Transformable.vue';

import { Picture } from './Picture';

const instance = new Picture();

provide('instance', instance);

const { current } = instance.InitStates();

instance.InitHooks();

instance.Run();
</script>

<template>
    <div class="Picture">
        <HeaderBarVue></HeaderBarVue>
        <span class="Title">{{ current.type }} --- {{ current.label }}</span>
        <span class="Content">
            <TransformableVue>
                <span class="Preview">
                    <img :src="current.url" alt="" />
                </span>
            </TransformableVue>
        </span>
    </div>
</template>

<style lang="scss" scoped>
@import './Picture.scss';
</style>
