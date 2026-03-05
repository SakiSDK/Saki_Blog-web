<script lang="ts" setup>
import { computed } from 'vue';

interface Props {
  to?: string;
  target?: string;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  to: '',
  target: '_blank',
  className: '',
});

const isExternal = computed(() => {
  return props.to?.startsWith('http') || props.to?.startsWith('//');
});

const isInternal = computed(() => {
  return !isExternal.value && props.to;
});
</script>

<template>
  <a 
    v-if="isExternal" 
    :href="to" 
    :target="target" 
    rel="noopener noreferrer"
    :class="className"
  >
    <slot></slot>
  </a>
  <router-link 
    v-else-if="isInternal" 
    :to="to" 
    :class="className"
  >
    <slot></slot>
  </router-link>
  <div v-else :class="className">
    <slot></slot>
  </div>
</template>
