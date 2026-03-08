<script lang="ts" setup>
import ConstructionCard from '@/components/cards/other/ConstructionCard.vue';
</script>

<template>
  <div class="construction-view">
    <ConstructionCard />
  </div>
</template>

<style lang="scss" scoped>
.construction-view {
  height: 100vh;
  width: 100vw;
  @include mix.flex-box($j: center, $a: center);
  background-color: var(--bg-base);
  overflow: hidden;
}
</style>
