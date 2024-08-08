<script lang="ts" setup>
import HeaderBarVue from '@/Common/HeaderBar/HeaderBar.vue';
import { provide } from 'vue';

import { Type } from './Type';

const instance = new Type();

provide('instance', instance);

const { name } = instance.InitStates();

instance.InitHooks();

instance.Run();
</script>

<template>
    <div class="Type">
        <HeaderBarVue></HeaderBarVue>
        <span class="Content">
            <span class="Input">
                <el-input v-model="name" placeholder="请输入分类" style="height: 100%"> </el-input>
            </span>
            <span class="Finish" @click="instance.OnClickFinish()">确认</span>
        </span>
    </div>
</template>

<style lang="scss" scoped>
@import './Type.scss';
</style>
