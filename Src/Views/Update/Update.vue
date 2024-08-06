<script lang="ts" setup>
import { provide } from 'vue';
import HeaderBarVue from '@/Common/HeaderBar/HeaderBar.vue';
import emptyIcon from '@/Assets/MC/empty.png';
import closeIcon from '@/Assets/MC/close.png';

import { Update } from './Update';

const instance = new Update();

provide('instance', instance);

const { options } = instance.InitStates();

instance.InitHooks();

instance.Run();
</script>

<template>
    <div class="Update">
        <HeaderBarVue></HeaderBarVue>
        <span class="Content">
            <span class="Type">
                <el-input v-model="options.type" placeholder="请输入类型" style="width: calc(100% - 110px); height: 35px"> </el-input>
                <span class="Finish" @click="instance.OnClickSure()">确认</span>
            </span>
            <span class="Label">
                <el-input v-model="options.label" style="width: 100%; height: 30px" :rows="4" type="textarea" placeholder="请输入描述" />
            </span>
            <span class="Image">
                <span class="Empty" v-show="options.images.length == 0">
                    <span class="Icon">
                        <img :src="emptyIcon" alt="" />
                    </span>
                    <span class="Title">拖入图片</span>
                </span>
                <span class="Item" v-for="(i, index) in options.images" :key="index">
                    <span class="Content" @click="instance.OnClickImage(i)">
                        <img :src="i" alt="" />
                    </span>
                    <span class="Close" @click="instance.OnClickDelete(index)">
                        <img :src="closeIcon" alt="" />
                    </span>
                </span>
            </span>
        </span>
    </div>
</template>

<style lang="scss" scoped>
@import './Update.scss';
</style>
