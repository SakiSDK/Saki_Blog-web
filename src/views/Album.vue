<!-- <script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import RightSideBar from '../base/RightSideBar.vue';
import Topbar from '../base/Topbar.vue';
import AlbumInfoCard from '../cards/AlbumInfoCard.vue';
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import { useScrollLock, useToggle, useIntersectionObserver } from '@vueuse/core';
import useDateFormat from '@/utils/useDateFormat';
import 'vue-waterfall-plugin-next/dist/style.css'
import Footer from '../base/Footer.vue';
import type { Photo } from '@/api/Album.api';
import { usePhotoStore } from '@/stores/usePhotoStore';
import { storeToRefs } from 'pinia';
import PhotoProject from '../modals/PhotoProject.vue';
import loadingImg from '@/assets/images/loading-dark.gif'



/** ---------- 类型定义 ---------- */
interface AlbumProps {
    albumId: number,
    name: string,
    title: string,
    description: string,
    coverPath: string,
    photoCount: number,
    loaded?: boolean,
}

/** ---------- props数据传递 ---------- */
const props = defineProps<AlbumProps>();


/** ----------- 状态管理 ---------- */
const photoStore = usePhotoStore();
const { fetchAlbumPhotos, setCurrentPhoto } = photoStore
const { photos, loading, currentPhoto } = storeToRefs(photoStore);


/** ---------- 时间标准化 ---------- */
const dateFormat = useDateFormat();


/** ---------- 使用useToggle，定义属性状态，以及切换状态方法 ---------- */
const [isShowProjector, toggleProject] = useToggle(false)


/** ---------- 获取图片列表 ---------- */
const clickImgAction = (photo) => {
    toggleProject(true)
    // currentIndex.value = index
    setCurrentPhoto(photo)
}

const isLockScroll = useScrollLock(document.body)
watch(isShowProjector, visible => {
    isLockScroll.value = visible
})

// 标记图片是否加载完成（控制缓入）
const isLoaded = ref(false);
// 加载成功回调：触发缓入动画
const handleLoad = () => {
    // 延迟50ms避免过渡失效（DOM渲染顺序问题）
    setTimeout(() => {
        isLoaded.value = true;
    }, 50);
};


// 初始化为 loading
onMounted(async() => {
    try {
        await fetchAlbumPhotos(props.albumId)
        photos.value.forEach(photo => {
            photo.isInView = false
        })
    } catch (error) {
        console.error(error)
    }
})
</script>
<template>
    <Topbar/>
    <RightSideBar/>
    <div class="album-page">
        <div class="album-page__container container">
            <div class="album-page__header">
                <AlbumInfoCard 
                    :name
                    :title
                    :description
                    :coverPath
                    :photoCount
                    :actionName="'返回'"
                />
            </div>
            <div class="album-page__body" v-if="!loading">
                <Waterfall
                    :list="photos"
                    :gutter="5"
                    background-color="var(--background-color)"
                    :width="400"
                    :lazyload="true"
                    :loadProps="{
                        loading: loadingImg,
                    }"
                >
                    
                    <template #default="{ item, index }">
                        <div 
                            class="photo-card" 
                            @click="clickImgAction(item)"
                        >
                            <!-- 
                                因为在 Vue 3 里，如果你在 v-for 或 Waterfall 这种循环模板中给多个元素都绑定同一个 ref，
                                Vue 默认只会保留最后一个元素的引用。 
                            -->
                            <!-- <LazyImg 
                                :url="item.imagePath " 
                                :index="index"
                                class="photo-card-img" 
                            /> -->
                            <img         
                                :class="{ 'photo-card-img--loaded': isLoaded }"
                                v-lazy-img="{
                                    src: item.imagePath,
                                    onLoad: handleLoad,
                                }" alt=""
                                :index="index"
                                class="photo-card-img" 
                            >
                            <span class="photo-card__title">{{ item.title }}</span>
                            <span class="photo-card__date">
                                {{ dateFormat.formatDate(item.createdAt) }}
                            </span>
                        </div>
                    </template>
                </Waterfall>
            </div>
        </div>
        <Footer/>
        <transition name="fade-in">
            <div class="mask" v-if="isShowProjector">
                <PhotoProject
                    v-model:isShowProjector="isShowProjector"
                    :type="'album'"
                    :photos
                    :currentPhoto
                    @update:currentPhoto="setCurrentPhoto"
                />
            </div>
        </transition>
    </div>
</template>

<style lang="scss" scoped>
%label-style {
    display: inline-block;
    @include mix.container-style(
        $p: xs sm,
        $r: md,
        $bg: rgba(0, 0, 0, .2)
    );
    @include mix.font-style($c: rgb(255, 255, 255), $s: xs);
}
.album-page { 
    padding-top: 70px;
    &__container,
    &__header,
    &__body {
        @include mix.margin-d(b, lg);
    }
    &__container {
        min-height: calc(100vh - 238px);
    }
    &__body {
        @extend %box-style;
        min-height: calc(100vh - 415px);
    }
}
.photo-card {
    position: relative;
    @include mix.container-style($p: 0, $r: lg, $o: hidden);
    &__title,
    &__date {
        @extend %label-style;
    }
    &__title {
        @include mix.position($type: absolute,$t: 10px,$l: 10px);
    }
    &__date {
        @include mix.position($type: absolute,$b: 10px,$r: 10px);
    }
    &-img {
        @include mix.container-style($p: 0, $r: lg);
        @include anim.transition;
        opacity: 0.4;
        &>img {
        }
        &--loaded {
            opacity: 1;
        }
    }
}
.mask {
    @extend %full-screen;
    @include mix.position($type: fixed,$t: 0,$l: 0,$z: modal);
    overscroll-behavior: contain;
    background-color: rgba(255, 255, 255, 0.071);
    backdrop-filter: blur(20px);
}
</style> -->