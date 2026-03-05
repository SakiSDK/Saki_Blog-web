<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import PageHeader from '@/components/bases/PageHeader.vue';
import { useAlbumStore } from '@/stores/album.store';
import { storeToRefs } from 'pinia';
import { Waterfall } from 'vue-waterfall-plugin-next';
import 'vue-waterfall-plugin-next/dist/style.css';
import { useRoute } from 'vue-router';
import PhotoCard from '@/components/cards/album/PhotoCard.vue';
import PhotoPreview from '@/components/cards/album/PhotoPreview.vue';
import type { Photo } from '@/schemas/album.schema';


/** ---------- 状态管理 ---------- */
/** 相册状态 */
const albumStore = useAlbumStore();
const { photoList, loadingMap, currentAlbum, currentPhotoIndex, currentPhoto } = storeToRefs(albumStore);

const route = useRoute()

// 预览状态
const previewVisible = ref(false);
const fromRect = ref<DOMRect | null>(null);

const handlePhotoClick = (photo: Photo, index: number, event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement;
  // 查找最近的 img 元素或直接使用容器
  const imgElement = target.querySelector('img') || target;
  fromRect.value = imgElement.getBoundingClientRect();
  currentPhoto.value = photo;
  currentPhotoIndex.value = index;
  previewVisible.value = true;
};


onMounted(async () => {
  // 2. 如果有相册，默认获取第一个相册的照片进行展示（作为测试/示例）
  const slug = (Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug) || '';
  if (slug) {
    try {
      await albumStore.fetchAlbumDetail(
        slug, {}, true 
      );
    } catch (error) {
      
    }
  }
});
</script>

<template>
  <TopBar/>
  <RightBar/>
  <div class="water-fall">
    <!-- 加上 container 类限制最大宽度并居中 -->
    <div class="water-fall__container">
      <div class="water-fall__header">
        <PageHeader :field="{
          title: currentAlbum?.title || '相册集',
          desc: currentAlbum?.description || '这里存放我的照片'
        }" />
      </div>
      <div class="water-fall__body container">
        <div class="water-fall__sheet" v-if="!loadingMap.detail">
          <Waterfall 
            :list="photoList" 
            :width="320"
            :gutter="0"
            :hasAroundGutter="false"
            :animation-duration="0.5"
            :animation-delay="0.1"
            backgroundColor="transparent"
          >
            <template #item="{ item, index }">
              <div class="water-fall__item" v-reveal>
                <PhotoCard 
                  :photo="item" 
                  @click="handlePhotoClick(item, index, $event)"
                />
              </div>
            </template>
          </Waterfall>
        </div>
      </div>
      <div class="water-fall__footer">
        <FooterBar/>
      </div>
    </div>
  </div>

  <PhotoPreview 
    v-model:visible="previewVisible"
    :photo="currentPhoto"
    :from-rect="fromRect"
  />
</template>

<style lang="scss" scoped>
.water-fall {
  &__body {
    width: 100%;
    min-height: calc(100vh - 230px);
    @include mix.margin-d(t, lg);
  }
  &__item {
    @include mix.padding(xs);
  }
  &__footer {
    @include mix.margin-d(t, rem(70));
  }
}
</style>