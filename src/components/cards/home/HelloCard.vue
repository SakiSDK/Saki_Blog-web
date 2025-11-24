<script lang="ts" setup>
import type { TippyOptions } from 'vue-tippy'

// 自动导入所有 svg 文件
const svgModules: Record<string, any> = import.meta.glob(
    '../../../assets/svg/*.svg',
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
                    <div 
                        class="greet__right-imgs" 
                        v-for="group, index in [leftGroup,rightGroup]" 
                        :key="index"
                    >
                        <template v-for="(src) in repeatGroup(group)">
                            <img :src="src" alt="">
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.greet {
    width: 100%;
    min-height: 225px;
    &__container { 
        @include mix.size(100%);
        @include mix.flex-box(row,flex-start);
        @include mix.container-style($o: hidden, $b: var(--border-base));
        @include mix.font-style($s:xl, $f:'title');
        @include hov.card($it: true);
    }
    &__left {
        flex: 1;
        min-height: 225px;
        @include mix.flex-box($d: column, $j: space-between,$a: flex-start);
        &-title {
            @include mix.padding-d(t, lg);
            @include mix.respond-down('sm'){
                @include mix.font-size(md);
            }
        }
    }
    &__right {
        flex: 1;
        height: 100%;
        position: relative;
        &__content {
            @include mix.position-style(absolute,-120px,0);
            @include mix.flex-box($g: sm);
            animation: scroll 20s linear infinite;
            img {
                @include mix.size(100px);
                @include mix.padding(sm);
            }
        }
        &-imgs {
            @include mix.flex-box($d: column, $g: sm);
            &:nth-of-type(2) {
                transform: translateY(-50px);
            }
            &>img {
                @include mix.container-style($p: xs, $r: lg, $bg:var(--white-base), $s: var(--shadow-base));
            }
        }
    }
}
</style>