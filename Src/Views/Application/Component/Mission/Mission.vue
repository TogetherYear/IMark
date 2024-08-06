<script lang="ts" setup>
import { inject } from 'vue';
import { Application } from '../../Application';
import emptyIcon from '@/Assets/MC/empty.png';
import arrowIcon from '@/Assets/MC/arrow.png';
import editIcon from '@/Assets/MC/edit.png';
import deleteIcon from '@/Assets/MC/delete.png';
import topIcon from '@/Assets/MC/top.png';
import toBIcon from '@/Assets/MC/toB.png';

const instance = inject('instance') as Application;

const { list, listDom } = instance.mission.InitStates();

instance.mission.InitHooks();

instance.mission.Run();
</script>

<template>
    <div class="Mission">
        <span class="Empty" v-show="list.length == 0">
            <img :src="emptyIcon" alt="" />
        </span>
        <span class="List" ref="listDom">
            <span class="Item" v-for="(l, index) in list" :key="l.id" :style="{ height: l.expand ? 'min-content' : '30px' }">
                <span class="Type H" :style="{ fontSize: l.expand ? '14px' : '12px' }" v-html="l.expand ? l.type : l.label"></span>
                <span class="Label" v-html="l.label"></span>
                <span class="Time H">{{ l.time }}</span>
                <span class="Images" v-show="l.images.length != 0">
                    <span class="Current" @click="instance.mission.OnClickImage(l)">
                        <img :src="l.images[l.current]" alt="" />
                    </span>
                    <span class="Oper">
                        <span class="Pre" v-show="l.images.length > 1 && l.current + 1 > 1" @click="l.current--">
                            <img :src="arrowIcon" alt="" />
                        </span>
                        <span class="Aft" v-show="l.images.length > 1 && l.current < l.images.length - 1" @click="l.current++">
                            <img :src="arrowIcon" alt="" />
                        </span>
                    </span>
                    <span class="Index" v-show="l.images.length != 1">{{ l.current + 1 }}/{{ l.images.length }}</span>
                </span>
                <span class="T">
                    <span class="Arrow" @click="instance.mission.OnClickExpand(l)" :style="{ transform: l.expand ? 'rotate(180deg)' : 'rotate(0deg)' }">
                        <img :src="arrowIcon" alt="" />
                    </span>
                    <span class="Edit" @click="instance.mission.OnClickEdit(l)">
                        <img :src="editIcon" alt="" />
                    </span>
                    <span class="Delete" @click="instance.mission.OnClickDelete(l)">
                        <img :src="deleteIcon" alt="" />
                    </span>
                </span>
                <span class="B" v-show="l.expand" :style="{ top: l.images.length != 0 ? 'calc(100% - 180px)' : 'calc(100% - 30px)' }">
                    <span class="ToB" v-show="index < list.length - 1" @click="instance.mission.OnClickToB(index)">
                        <img :src="toBIcon" alt="" />
                    </span>
                    <span class="ToT" v-show="index > 0" @click="instance.mission.OnClickToT(index)">
                        <img :src="toBIcon" alt="" />
                    </span>
                    <span class="ToFirst" v-show="index != 0" @click="instance.mission.OnClickToFirst(index)">
                        <img :src="topIcon" alt="" />
                    </span>
                </span>
            </span>
        </span>
    </div>
</template>

<style lang="scss" scoped>
@import './Mission.scss';
</style>
