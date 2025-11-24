<script lang="ts" setup>
import mushokuImg from '@/assets/imgs/anime_mushokutensei.webp'
import FurirenImg from '@/assets/imgs/anime_furiren.webp'
import KimetsuImg from '@/assets/imgs/anime_kimetsu.webp'
import ShadowImg from '@/assets/imgs/anime_TheEminenceInShadow.webp'
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useTimeoutFn } from '@vueuse/core'


const currentIndex = ref<number>(0)
const autoplaySpeed = 5000; // 5秒
let timer: number | null = null
const isTransitionEnabled = ref<boolean>(true)


const animeFields = [
    {
        img: mushokuImg,
        tip: '无职转生',
        key: 'mushoku',
    },
    {
        img: FurirenImg,
        tip: '葬送的芙丽莲',
        key: 'furiren',
    },
    {
        img: KimetsuImg,
        tip: '鬼灭之刃',
        key: 'kimetsu',
    },
    {
        img: ShadowImg,
        tip: '想要成为影之实力者',
        key: 'shadow',
    },
]

const totalOrigin = animeFields.length // 原数组长度（4）
const totalCopied = totalOrigin * 2 // 复制后数组长度（8）
// 切换下一张
const next = async () => {
    if (!isTransitionEnabled.value) return

    // 1. 正常滚动：索引+1
    currentIndex.value += 1

    // 2. 临界值判断：当滚动到“复制组的第一张”（索引=原数组长度）
    useTimeoutFn(() => { 
        if (currentIndex.value === totalOrigin) {
            // 3. 等待当前滚动动画完成（500ms是CSS过渡时间，需和下面的transition对应）
            isTransitionEnabled.value = false // 关闭过渡，避免复位时的动画
            nextTick(() => {
                currentIndex.value = 0 // 瞬间复位到原数组第一张

                requestAnimationFrame(() => {
                    isTransitionEnabled.value = true
                })
            })
        }
    }, 600)
}

// 启动自动播放
const startAutoplay = () => {
    stopAutoplay()
    timer = window.setInterval(next, autoplaySpeed)
}

// 停止自动播放
const stopAutoplay = () => {
    if (timer) {
        clearInterval(timer)
        timer = null
    }
}

// 优化：鼠标悬停停止自动播放，离开继续（提升用户体验）
const handleMouseEnter = () => stopAutoplay()
const handleMouseLeave = () => startAutoplay()



onMounted(startAutoplay)
onUnmounted(stopAutoplay)
</script>

<template>
    <div class="anime">
        <div class="anime__container">
            <div class="anime-tag">喜欢的动漫</div>
            <div class="anime-title">番剧</div>
            <div class="anime__content" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
                <div 
                    class="anime__wrapper" 
                    :style="{
                        transform: `translateX(-${currentIndex * 100}%)`,
                        transition: isTransitionEnabled ? 'transform 0.6s ease-in-out' : 'none'
                    }"
                >
                    <div class="anime-img"
                        v-for="anime,index in [...animeFields, ...animeFields]" 
                        :key="index"
                        :title="anime.tip"
                    >
                        <img :src="anime.img" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.anime {
    height: 340px;
    &__container { 
        @extend %aboutme-container;
        overflow: hidden;
        padding: 0;
    }
    &-tag {
        @extend %aboutme-tag;
        color: var(--white-subtle);
        @include mix.z-index(base);
    }
    &-title {
        @include mix.position-style($p: absolute, $t: 40px, $l: 20px, $z: base);
        @include mix.font-style($s: title, $f: 'title', $c: var(--white-base));
    }
    &__content {
        @extend %full-size;
    }
    &__wrapper {
        height: 100%;
        @include mix.flex-box($j: flex-start, $w: nowrap);
    }
    &-img { 
        height: 100%;
        width: 100%;
        flex-shrink: 0;
        @include anim.transition($dr: slow);
        &:hover {
            transform: scale(1.2);
        }
        &>img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
}
</style>