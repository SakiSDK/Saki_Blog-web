<script lang="ts" setup>
import { useDomUtil } from '@/utils/dom.util';

// 自动导入所有 svg 文件
const svgModules: Record<string, any> = import.meta.glob(
    '../../assets/svgs/*.svg',
    { eager: true }
)
const svgPaths: string[] = Object.entries(svgModules).map(([path]) => {
    return new URL(path, import.meta.url).href
})
// 核心：动态计算分组（固定分2组）
const groupCount = 2; // 分组数量（可按需改，但你这里是左右两组，固定为2）
const groupSize = Math.ceil(svgPaths.length / groupCount); // 每组长度（向上取整，避免漏元素）

// 自动拆分左右组，无需硬编码索引
const leftGroup = svgPaths.slice(0, groupSize);
const rightGroup = svgPaths.slice(groupSize); // 从groupSize到末尾，不用写结束索引

const repeatGroup = (group: string[], repeat: number = 2) =>
    Array.from({ length: repeat }).flatMap(() => group)
const { brightColorByHash } = useDomUtil();
</script>

<template>
    <div class="carousel">
        <div
            class="carousel-part"
            v-for="group, index in [leftGroup, rightGroup]"
            :key="index"
        >
            <template v-for="(src) in repeatGroup(group)">
                <div
                    class="logo-svg"
                    :style="{
                        '--svg-bgcolor': brightColorByHash({
                            key: src,
                        }),
                    }"
                    v-reveal
                >
                    <img
                        :src="src"
                    />
                </div>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.carousel {
    @include mix.position-style($p: absolute, $t: -110px, $r: 0);
    @include mix.flex-box($g: sm);
    animation: scroll 15s linear infinite;

    &-part {
        @include mix.flex-box($d: column, $g: sm, $s: 0);
        &:nth-of-type(2) {
            transform: translateY(-50px);
        }
        &>.logo-svg {
            @include mix.size(100px);
            @include mix.container-style($p: xs,
                $r: 13px,
                $bg: var(--white-base),
                $s: var(--shadow-base)
            );
            &>img {
                @include mix.size(100%);
            }
        }
    }
}
</style>