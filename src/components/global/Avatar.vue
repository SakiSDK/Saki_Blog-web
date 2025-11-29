<script lang="ts" setup>
import type { AvatarProps } from '@/types/components/Avatar';
defineOptions({
  name: 'Avatar',
})

defineProps<AvatarProps>();
</script>

<template>
  <div 
    class="avatar"
    :style="{
      '--avatar-size': style?.size ?? '50px',
      '--avatar-radius': style?.radius ?? '50%',
    }"  
  >
    <img 
      :src="src" 
      v-lazy="{
        src
      }"
      alt="头像"
    >
  </div>
</template>

<style lang="scss" scoped>
.avatar {
  @include mix.size(var(--avatar-size));
  @include mix.radius(var(--avatar-radius));
  overflow: hidden;
  background-color: var(--white-base);
  @extend %flex-center;
  @include hov.rotate(180deg, true);
  &>img {
    display: block;
    @extend %full-size;
    object-fit: cover;
  }
}

</style>