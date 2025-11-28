<script lang="ts" setup>
import PageHeader from '@/components/bases/PageHeader.vue';
import AlbumCard from '@/components/cards/album/AlbumCard.vue';
import type { PageHeaderField } from '@/types/components/Base';

const albumField: PageHeaderField = {
  title: '博客相册',
  desc: '这里存放的是我的博客相册'
}
</script>

<template>
  <TopBar/>
  <div class="album">
    <div class="album__header">
      <PageHeader :field="albumField"/>
    </div>
    <div class="album__container container">
      <div class="album-item" v-for="_ in 4">
        <AlbumCard/>
      </div>
    </div>
    <FooterBar/>
  </div>
  <RightBar/>
</template>

<style lang="scss" scoped>
.album {
  &__container {
    width: 100%;
    min-height: calc(100vh - 293px);
    @include mix.margin-y(lg);
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