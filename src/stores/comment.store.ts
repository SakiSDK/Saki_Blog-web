import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { CommentApi } from '@/apis/comment.api';
import type { Comment } from '@/schemas/comment.schema';
import type { Pagination } from '@/schemas/base.schema';

const INIT_PAGINATION_STATE: Pagination = {
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false
}

export const useCommentStore = defineStore('comment', () => {
  const comments = ref<Comment[]>([]);
  const commentCount = ref<number>(0);
  const pagination = ref<Pagination>({ ...INIT_PAGINATION_STATE });
  const isLoading = ref<boolean>(false);
  const errorMsg = ref<string | null>(null);
  
  // Computed
  const hasMore = computed(() => pagination.value.hasNext);

  // Actions
  const fetchComments = async (shortId: string, loadMore: boolean = false) => {
    if (isLoading.value) return;
    isLoading.value = true;
    errorMsg.value = null;

    try {
      const page = loadMore ? pagination.value.page + 1 : 1;
      const res = await CommentApi.getComments(shortId, {
        page,
        limit: pagination.value.pageSize
      });
      
      // Assuming res.data is the response structure
      if (res && res.data) {
        const { list, pagination: newPagination } = res.data; // Adjust based on actual API response
        
        if (loadMore) {
          comments.value.push(...list);
        } else {
          comments.value = list;
        }
        pagination.value = newPagination;
        commentCount.value = newPagination.total;
      }
    } catch (error: any) {
      errorMsg.value = error.message || '获取评论失败';
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  const submitComment = async (shortId: string, data: { content: string, parentId?: number }) => {
    isLoading.value = true;
    try {
      // Need to handle user_device, user_browser. 
      // For now, hardcode or get from navigator.
      const payload = {
        user_device: navigator.platform,
        user_browser: navigator.userAgent,
        content: data.content,
        parent_id: data.parentId
      };
      
      const res = await CommentApi.createComment(shortId, payload);
      if (res && res.data) {
        // Refresh comments
        await fetchComments(shortId, false);
        return res.data;
      }
    } catch (error: any) {
      errorMsg.value = error.message || '评论失败';
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    comments,
    commentCount,
    pagination,
    isLoading,
    hasMore,
    errorMsg,
    fetchComments,
    submitComment
  };
});
