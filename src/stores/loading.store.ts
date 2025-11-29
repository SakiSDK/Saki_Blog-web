import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoadingStore = defineStore('loading', () => {
  const isGlobalLoading = ref<boolean>(false);
  const isRouteLoading = ref<boolean>(false);

  const setGlobalLoading = (value: boolean) => {
    isGlobalLoading.value = value;
  };

  const setRouteLoading = (value: boolean) => {
    isRouteLoading.value = value;
  };

  return {
    isGlobalLoading,
    isRouteLoading,
    setRouteLoading,
    setGlobalLoading
  };
});