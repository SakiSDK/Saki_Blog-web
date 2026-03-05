<script lang="ts" setup>
import PageHeader from '@/components/bases/PageHeader.vue';
import AlbumCard from '@/components/cards/album/AlbumCard.vue';
import { message } from '@/plugins/message';
import { useAlbumStore } from '@/stores/album.store';
import type { PageHeaderField } from '@/types/components/Base';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

/** ---------- 页面文字信息 ---------- */
/** 相册文字信息 */
const albumField: PageHeaderField = {
  title: '博客相册',
  desc: '这里存放的是我的博客相册'
}


/** ---------- 状态管理 ---------- */
/** 相册状态 */
const albumStore = useAlbumStore();
const { albumList, loadingMap, pagination, errorMsg } = storeToRefs(albumStore);



onMounted(async () => {
  try {
    const res = await albumStore.fetchAlbumList({
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
    });
  } catch (error) {
    message.error(errorMsg.value || '获取相册列表失败');
  }
})
</script>

<template>
  <TopBar/>
  <div class="album">
    <div class="album__container">
      <div class="album__header">
        <PageHeader :field="albumField"/>
      </div>
      <div class="album__body container">
        <div class="album__sheet" v-if="!loadingMap.list">
          <div class="album-item" v-for="album in albumList" :key="album.slug">
            <div 
              class="album-item__sheet" 
              v-reveal="{
                delay: 1500,
                duration: 1000
              }"
            >
              <router-link 
                :to="`/album/${album.slug}`" 
                class="album__card" 
              >
                <AlbumCard :album="album"/>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="album__footer">
        <FooterBar/>
      </div>
    </div>
  </div>
  <RightBar/>
</template>

<style lang="scss" scoped>
.album {
  &__body {
    width: 100%;
    min-height: calc(100vh - 230px);
    @include mix.margin-y(lg);
    @include mix.flex-box;
  }
  &__sheet {
    @include mix.grid-box($c: 4, $g: lg);
    @include mix.respond-down(lg) {
      @include mix.grid-box($c: 2, $g: lg);
    }
    @include mix.respond-down(sm) {
      @include mix.grid-box($c: 1, $g: lg);
    }
  }
}
</style>