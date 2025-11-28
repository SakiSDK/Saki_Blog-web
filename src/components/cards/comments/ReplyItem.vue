<!-- <script lang="ts" setup>
import { useCommentStore } from '@/stores/useCommentStore';
import CommentUserInfo from '../comments/CommentUserInfo.vue';
import ReplyInput from '../comments/ReplyInput.vue';
import { useToggle } from '@vueuse/core';
import { showMessage } from '../message/message';



export interface ClientInfo {
  comment: {
    user: {
      avatar: string,
      shortId: string,
      nickname: string,
      [key: string]: any,
    },
    id: number,
    parentId: number,
    content: string,
    isAuthor: boolean,
    userDevice: string,
    userBrowser: string,
    userRegion: string,
    createdAt: string,
    postShortId: string,
    [key: string]: any,
  }
  userAvatar?: string,
  shortId: string,
  mainCommentId?: number,
}
const props = defineProps<ClientInfo>()


/** ---------- 状态管理 ---------- */
const [isShowReplyInput, toggleIsShowReplyInput] = useToggle(false);
const { submitComment } = useCommentStore();


/** ---------- 逻辑方法 ---------- */
const hanldeShowReplyInput = () => toggleIsShowReplyInput();

// 添加换行转换方法
const formatContent = (content: string) => {
  if (!content) return '';
  return content
    // 先处理换行
    .replace(/\n/g, '<br>')
    // 匹配回复的@username
    .replace(
      /\[@([^\]]+)\]/g,
      // 包裹成span，data-at-username存储提取的纯用户名（去掉@和[]）
      '<span class="reply-at-user" data-at-username="$1">@$1</span>'
    );
};

// 处理回复
const handleReply = async (input: string) => {
  try {
    await submitComment(props.shortId, {
      parentId: props.comment.id,
      content: input,
      mainCommentId: props.mainCommentId,
    })
    showMessage({
      type: 'primary',
      content: '回复成功',
    })
  } catch (error: any) {
    console.log(error);
    showMessage({
      type: 'error',
      content: '评论失败，请稍后再重试',
    })
  } finally {
    toggleIsShowReplyInput(false);
  }
}


const handleAtUserClick = (e: MouseEvent) => {
  const atElement = (e.target as HTMLElement).closest('.reply-at-user');
  if (!atElement) return;

  console.log(atElement)
  // 提取纯用户名（含空格）
  const targetUsername = atElement.getAttribute('data-at-username')
  console.log('targetUsername', targetUsername)
  if (!targetUsername) return;

  // 获取父级评论id，处理无parentid情况
  const parentCommentId = props.comment.parentId;
  if (!parentCommentId) {
    alert('父级评论不存在')
    return;
  }

  // 3. 修正ID选择器：加上前缀 `comment-`（和模板保持一致）
  const targetComment = document.getElementById(`comment-${parentCommentId}`);
  console.log('目标评论ID：', `comment-${parentCommentId}`, '找到的评论：', targetComment);

  if (targetComment) {
    // 4. 可选：验证目标评论的昵称是否和@的用户名一致（避免@错人）
    const commentNickname = targetComment.getAttribute('data-nickname');
    if (commentNickname !== targetUsername) {
      alert(`定位到父评论，但该评论作者是“${commentNickname}”，不是@的“${targetUsername}”`);
      return;
    }
  }


  // 查找 data-nickname 完全匹配的评论（空格会被正确识别）
  const targetComment = document.querySelector(
    `.reply-item[data-nickname="${targetUsername}"][id="commnet-${props.comment.parentId}"]`
  )
  console.log('parentId', props.comment.parentId)
  console.log(targetComment)

  console.log('targetComment', targetComment)

  if (targetComment) {
    // 平滑滚动定位 + 高亮反馈
    targetComment.scrollIntoView({ behavior: 'smooth', block: 'center' });
    targetComment.classList.add('reply-item-hightlight');
    setTimeout(() => targetComment.classList.remove('reply-item-hightlight'), 2000);
    console.log('滚动定位成功')
  } else {
    alert(`未找到用户“${targetUsername}”的评论`);
  }
}
</script>

<template>
  <div
    class="reply-item"
    :data-nickname="comment.user.nickname"
    :id="`comment-${comment.id}`"
  >
    <div class="reply-item__header">
      <div class="reply-item__header-content">
        <Avatar
          :src="comment.user.avatar"
          :size="'40px'"
        />
        <div class="reply-item__username">
          {{ comment.user.nickname }}
        </div>
        <CommentUserInfo
          :device="comment.userDevice"
          :browser="comment.userBrowser"
          :region="comment.userRegion"
          :date="comment.createdAt"
        />
      </div>
      <div
        class="reply-item-reply"
        @click="hanldeShowReplyInput"
      >
        <Icon name="reply" />
        <span>回复</span>
      </div>
    </div>
    <div class="reply-item__body">
      <div
        class="reply-item-content"
        v-html="formatContent(comment.content)"
        @click="handleAtUserClick"
      >
      </div>
    </div>
    <ReplyInput
      v-if="isShowReplyInput"
      :avatarPath="userAvatar"
      :parentId="comment.id"
      :defaultContent="comment.user.nickname"
      :mainCommentId="comment.id"
      @reply="handleReply"
    />
  </div>
</template>

<style lang="scss" scoped>
.reply-item-hightlight {
  border: 1px solid var(--primary-base) !important;
}

:deep(.reply-at-user) {
  @include mix.margin-d(r, xs);
  @include mix.underline-style;
  color: var(--primary-base);
  cursor: pointer;
}

.reply-item {
  @include mix.flex-box($d: column, $j: flex-start, $g: md);
  @include mix.container-style($r: 0);
  @include anim.transition;
  border: 1px solid transparent;
  @include mix.radius(sm);

  &__header {
    width: 100%;
    @include mix.flex-box($j: space-between, $g: md);
    border-bottom: var(--border-base);
    @include mix.padding-d(b, md);

    &-content {
      @include mix.flex-box($g: sm);
    }
  }

  &__username {
    @include mix.font-size(sm);
  }

  &-reply {
    position: relative;
    height: fit-content;
    @include mix.flex-box;
    @include mix.font-style($s: sm, $c: var(--primary-base));
    cursor: pointer;
    @include mix.underline-style(-3px, var(--primary-base));
  }

  &__body,
  &-content {
    width: 100%;
  }

  &__body {
    @include mix.margin-d(b, sm);
  }

  &-content {
    $font-size: fun.font-size(sm)-1px;
    position: relative;
    @include mix.padding-d(l, md);
    @include mix.margin-d(b, lg);
    @include mix.font-style($s: $font-size, $c: var(--text-weak));
    line-height: 1.5;

    &::before {
      content: '';
      @include mix.position-style($p: absolute, $l: 0, $t: 0);
      @include mix.size(4px, 100%);
      background: linear-gradient(to bottom, var(--primary-base), var(--primary-soft));
      border-radius: 2px;
    }
  }

  &__input {
    textarea {
      @include mix.font-size(sm);
    }
  }
}
</style> -->