<script lang="ts" setup>
import mushokuImg from '@/assets/imgs/anime_mushokutensei.webp'
import FurirenImg from '@/assets/imgs/anime_furiren.webp'
import KimetsuImg from '@/assets/imgs/anime_kimetsu.webp'
import ShadowImg from '@/assets/imgs/anime_TheEminenceInShadow.webp'
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useTimeoutFn } from '@vueuse/core'
import { createI18nUtil } from '@/utils/i18n.util'
import type { AnimeCardField, CardBaseInfo } from '@/types/components/Aboutme'


/** ---------- Anime State ---------- */
const currentIndex = ref<number>(0)
const autoplaySpeed = 5000; // 5秒
let timer: number | null = null
const isTransitionEnabled = ref<boolean>(true)


/** ---------- Anime text ---------- */
const { tWithPrefix } = createI18nUtil();
const animeT = tWithPrefix('aboutme.animeCard');
const animeItemsT = tWithPrefix('aboutme.animeCard.items');
const animeCardInfo: CardBaseInfo = {
    title: animeT('title'),
    tag: animeT('tag'),
}
const animeFields: AnimeCardField[] = [
    {
        name: animeItemsT('mushokutensei.name'),
        webSite: animeItemsT('mushokutensei.webSite'),
        key: animeItemsT('mushokutensei.key'),
        image: mushokuImg,
    },
    {
        name: animeItemsT('furiren.name'),
        webSite: animeItemsT('furiren.webSite'),
        key: animeItemsT('furiren.key'),
        image: FurirenImg,
    },
    {
        name: animeItemsT('shadow.name'),
        webSite: animeItemsT('shadow.webSite'),
        key: animeItemsT('shadow.key'),
        image: ShadowImg,
    },
    {
        name: animeItemsT('kimetsu.name'),
        webSite: animeItemsT('kimetsu.webSite'),
        key: animeItemsT('kimetsu.key'),
        image: KimetsuImg,
    },
]

/** ---------- 逻辑方法 ---------- */
const totalOrigin = animeFields.length // 原数组长度（4）
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
            <div class="anime-tag">{{ animeCardInfo.tag }}</div>
            <div class="anime-title">{{ animeCardInfo.title }}</div>
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
                        :title="anime.name"
                    >
                        <img :src="anime.image" :alt="anime.name">
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
    }
    &-title {
        @extend %aboutme-title;
    }
    &__content {
        @extend %full-size;
    }
    &__wrapper {
        height: 100%;
        @include mix.flex-box($j: flex-start, $w: nowrap);
    }
    &-img { 
        @extend %full-size;
        flex-shrink: 0;
        @include anim.transition($dr: 1s);
        &:hover {
            transform: scale(1.2);
        }
        &>img {
            @extend %full-size;
            @include mix.object-style(center, cover);
        }
    }
}
</style>