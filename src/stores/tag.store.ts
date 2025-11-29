import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TagAPI } from '@/apis/tag.api'
import type { Tag } from '@/types' // 假设 Tag 类型定义在此处


export const useTagStore = defineStore('tag', () => {
    /** 标签列表 */
    const tagList = ref([])

    /** 是否正在加载 */
    const loading = ref(false)

    /** 是否已经加载过（前台只需加载一次） */
    const loaded = ref(false)

    /** 获取标签（只加载一次） */
    const fetchTags = async () => {
        if (loaded.value) return

        try {
            loading.value = true
            const res = await TagAPI.getTagList()
            tagList.value = res.data
            loaded.value = true
        } finally {
            loading.value = false
        }
    }

    /** 强制刷新（手动触发） */
    const reloadTags = async () => {
        try {
            loading.value = true
            const res = await TagAPI.getTagList()
            tagList.value = res.data
            loaded.value = true
        } finally {
            loading.value = false
        }
    }

    return {
        tagList,
        loading,
        loaded,

        fetchTags,
        reloadTags,
    }
})
