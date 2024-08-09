<script lang="ts" setup>
import { inject } from 'vue';
import { Application } from '../../Application';
import logoIcon from '@/Assets/MC/logo.png';
import addIcon from '@/Assets/MC/add.png';
import deleteIcon from '@/Assets/MC/delete.png';
import editIcon from '@/Assets/MC/edit.png';

const instance = inject('instance') as Application;

const { btns, types, isShowType, lastRead, isShowError, errorMsg } = instance.tab.InitStates();

instance.tab.InitHooks();

instance.tab.Run();
</script>

<template>
    <div class="Tab">
        <span class="Drag" data-tauri-drag-region></span>
        <span class="Logo" @dblclick="instance.tab.OnClickExpand()" data-tauri-drag-region>
            <img :src="logoIcon" alt="" />
        </span>
        <span class="Read">{{ lastRead }}</span>
        <span class="Error" :style="{ opacity: isShowError ? '1' : '0' }">{{ errorMsg }}</span>
        <span class="Btns">
            <span class="Item" v-for="b in btns" :key="b.label" @click="instance.tab.OnClickBtn(b.label)">
                <img :src="b.icon" alt="" />
            </span>
            <span class="Select" v-show="isShowType">
                <span class="Which" v-for="t in types" :key="t" @click="instance.tab.OnClickType(t)">
                    <span class="Edit" @click.stop="instance.tab.OnClickEditType(t)">
                        <img :src="editIcon" alt="" />
                    </span>
                    <span class="Delete" @click.stop="instance.tab.OnClickDeleteType(t)">
                        <img :src="deleteIcon" alt="" />
                    </span>
                    <span class="Type">{{ t }}</span>
                </span>
                <span class="Which" @click="instance.tab.OnClickType('添加')">
                    <span class="Icon">
                        <img :src="addIcon" alt="" />
                    </span>
                    <span class="Label">添加</span>
                </span>
            </span>
        </span>
    </div>
</template>

<style lang="scss" scoped>
@import './Tab.scss';
</style>
