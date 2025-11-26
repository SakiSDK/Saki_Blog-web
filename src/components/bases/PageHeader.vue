<script lang="ts" setup>
import type { PageHeaderField } from '@/types/components/Base';
import Wave from './Wave.vue';


defineProps<{
    field: PageHeaderField
    wave?: {
        height: string,
    }
}>();

</script>

<template>
    <div class="page-header">
        <h2 class="page-title">{{ field.title }}</h2>
        <p class="page-desc">{{ field.desc }}</p>
        <div class="page-infos">
            <div class="page-info" v-for="info in field.infos">
                <div class="page-info-title">{{ info.title }}</div>
                <div class="page-info-value">{{ info.value }}</div>
            </div>
        </div>
        <Wave :height="wave?.height"/>
    </div>
</template>

<style lang="scss" scoped>
@use 'sass:map';

.page {
    &-header {
        position: relative;
        @include mix.padding(70px 50px);
        @include mix.padding-d(t, 90px);
        background: var(--primary-base);
        overflow: hidden;
        color: var(--white-base);
    }
    &-title,
    &-desc {
        @include mix.z-index(base)
    }
    &-title {
        @include mix.margin-d(b, sm);
        @include mix.font-style($s: xxl-title, $c: inherit, $f: title);
    }
    &-desc {
        @include mix.font-style($s: md, $c: inherit);
        opacity: .7;
    }
    &-infos { 
        @include mix.margin-d(t, md);
        @include mix.flex-box($j: flex-start, $g: md);
    }
    &-info {
        @include mix.flex-box($g: xs);
        color: var(--white-subtle);
    }
}

</style>