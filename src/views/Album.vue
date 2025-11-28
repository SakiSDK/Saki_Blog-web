<script lang="ts" setup>
import PageHeader from '@/components/bases/PageHeader.vue';
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
    <div class="album__container">

    </div>
    <FooterBar/>
  </div>
  <RightBar/>
</template>

<style lang="scss" scoped>
.album {
  &__container {
    min-height: calc(100vh - 293px);
  }
}
</style>