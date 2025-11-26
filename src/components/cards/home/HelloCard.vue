<script lang="ts" setup>
import type { TippyOptions } from 'vue-tippy'
import Carousel from '@/components/bases/Carousel.vue'

// 自动导入所有 svg 文件
const svgModules: Record<string, any> = import.meta.glob(
    '../../../assets/svgs/*.svg',
    { eager: true }
)
const svgPaths: string[] = Object.entries(svgModules).map(([path]) => {
    return new URL(path, import.meta.url).href
})
const leftGroup: string[] = svgPaths.slice(0, 5)
const rightGroup: string[] = svgPaths.slice(5, 10)
const repeatGroup = (group: string[], repeat: number = 2) =>
    Array.from({ length: repeat }).flatMap(() => group)

//页面文案内容
const greetContent = {
    title: 'Ciallo '
}
const postTippyConfig: TippyOptions = {
    content: '更多文章',
    placement: 'right',
    theme: 'link',
    appendTo: 'parent',
}
</script>

<template>
    <div class="greet">
        <div class="greet__container">
            <div class="greet__left">
                <h2 class="greet__left-title">{{ greetContent.title }}</h2>
            </div>
            <div class="greet__right">
                <div class="greet__right__content">
                    <Carousel />
                </div>
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.greet {
    width: 100%;
    &__container { 
        min-height: 255px;
        @include mix.size(100%);
        @include mix.flex-box(row,flex-start);
        @include mix.container-style($o: hidden, $b: var(--border-base));
        @include hov.card($t: true);
    }
    &__left {
        flex: 1;
        min-height: 225px;
        @include mix.flex-box($d: column, $j: space-between,$a: flex-start);
        &-title {
            @include mix.z-index(base);
            @include mix.padding-d(t, lg);
            @include mix.font-style($s: xl-title, $c: var(--primary-base), $f: title, $w: bold);
        }
    }
    &__right {
        flex: 1;
        height: 100%;
        position: relative;
        &__content {
            @include mix.position-style(absolute,0,0);
            rotate:60deg;
        }
    }
}
</style>