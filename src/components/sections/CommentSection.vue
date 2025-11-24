<!-- <script lang="ts" setup>
import useDateFormat from '@/utils/useDateFormat';
import CommentUserInfo from '../comments/CommentUserInfo.vue';
import ReplyInput from '../comments/ReplyInput.vue';
import ReplyItem from '../comments/ReplyItem.vue';
import { useToggle } from '@vueuse/core';
import { useUserStore } from '@/stores/useUserStore';
import { storeToRefs } from 'pinia';
import { useCommentStore } from '@/stores/useCommentStore';
import { showMessage } from '../message/message';


/** ---------- 类型定义 ---------- */
export interface Comment {
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
export interface CommentWithReplies extends Comment {
  replies?: CommentWithReplies[];
}
export interface CommentCardField extends Comment {
  comment: CommentWithReplies,
  shortId: string,
}

/** ---------- props ---------- */
const props = defineProps<CommentCardField>()


/** ---------- 状态管理 ---------- */
const { user } = storeToRefs(useUserStore());
const { submitComment } = useCommentStore();


// 时间格式化
const { formatRelativeDate } = useDateFormat();


// 文案页面内容
const avatarPath = new URL('@/assets/images/avatar.webp', import.meta.url).href


const [isShowReplies, toggleIsShowReplies] = useToggle(false);
const [isShowReplyInput, toggleIsShowReplyInput] = useToggle(false);

/** ---------- 逻辑方法 ---------- */
const handleShowReplies = () => toggleIsShowReplies();
const hanldeShowReplyInput = () => toggleIsShowReplyInput();

// 处理回复
const handleReply = async (input: string) => {
  try {
    await submitComment(props.shortId, {
      parentId: props.comment.id,
      content: input,
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
</script>

<template>
  <div class="comment">

    <div class="comment__container">
      <div
        class="comment__wrapper"
        :data-nickname="comment.user.nickname"
        :id="`comment-${comment.id}`"
      >
        <div class="comment__header">
          <div class="comment__header-content">
            <Avatar
              :src="comment.user.avatar"
              :size="'55px'"
            />
            <div class="comment-username">
              {{ comment.user.nickname }}
            </div>
          </div>
          <div
            class="comment-reply"
            @click="hanldeShowReplyInput"
          >
            <Icon name="reply" />
            <span>回复</span>
          </div>
        </div>
        <div class="comment__body">
          <div class="comment-content">
            {{ comment.content }}
          </div>
          <div class="comment__detail">
            <CommentUserInfo
              :device="comment.userDevice"
              :browser="comment.userBrowser"
              :region="comment.userRegion"
            />
            <div class="user-info-date">
              {{ formatRelativeDate(comment.createdAt) }}
            </div>
          </div>
        </div>
      </div>
      <ReplyInput
        v-if="isShowReplyInput"
        :avatarPath="user.avatar"
        :parentId="comment.id"
        :defaultContent="comment.user.nickname"
        @reply="handleReply"
      />
      <Transition name="reply-fade">
        <div
          class="replies"
          v-if="isShowReplies"
        >
          <div class="replies__container">
            <ReplyItem
              v-for="(reply, index) in comment.replies"
              :key="index"
              :comment="reply"
              :userAvatar="user.avatar"
              :shortId="shortId"
              :mainCommentId="comment.id"
            />
          </div>
        </div>
      </Transition>
      <div
        class="replies-holder"
        @click="handleShowReplies"
      >
        <span v-if="comment.replies && comment.replies.length">
          {{ isShowReplies ? '收起回复' : `共有${comment.replies.length}条评论，点击展开回复` }}
          <span
            class="replies-holder-icon"
            :class="{
              'replies--expanded': isShowReplies
            }"
          >
            <Icon :name="'reply-expand'" />
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.reply-item-hightlight {
  border: 1px solid var(--primary-base) !important;
}

// 展开/隐藏动画核心样式（Transition 名称对应 name="reply-fade"）
.reply-fade {

  // 进入动画（展开）
  &-enter-from {
    max-height: 0; // 初始高度 0
    opacity: 0; // 初始透明
    overflow: hidden; // 避免内容溢出
  }

  &-enter-active {
    max-height: 1000px; // 足够大的固定值（覆盖实际最大高度）
    opacity: 1;
    transition:
      max-height 0.3s ease-in-out, // 高度过渡
      opacity 0.3s ease-in-out; // 透明度过渡
    overflow: hidden;
  }

  &-enter-to {
    max-height: auto; // 最终高度自适应（可选，也可以保留 1000px）
  }

  // 离开动画（隐藏）
  &-leave-from {
    max-height: 1000px; // 初始高度为最大固定值
    opacity: 1;
    overflow: hidden;
  }

  &-leave-active {
    max-height: 0; // 过渡到高度 0
    opacity: 0;
    transition:
      max-height 0.3s ease-in-out,
      opacity 0.3s ease-in-out;
    overflow: hidden;
  }

  &-leave-to {
    max-height: 0;
    opacity: 0;
  }
}

.user-info {
  &-date {
    @include mix.font-style($s: sm, $c: var(--text-weak));
  }
}

.comment {
  &__container {
    @include mix.container-style($p: lg, $b: var(--border-base), $r: md);
    @include mix.flex-box($d: column, $j: flex-start, $a: stretch, $g: lg);
    @include anim.transition;
    @include anim.border-color;
    @include anim.translateY;
  }

  &__wrapper {
    @include mix.transition;
    border: 1px solid transparent;
  }

  &__header {
    @include mix.flex-box($j: space-between, $g: sm);
    border-bottom: var(--border-base);
    @include mix.padding-d(b, md);

    &-content {
      @include mix.flex-box($g: sm);
    }
  }

  &-username {
    $font-size: fun.font-size(md) + 1;
    @include mix.font-style($w: bolder, $s: $font-size);
  }

  &-reply {
    @include mix.flex-box;
    color: var(--primary-base);
    cursor: pointer;
    @include mix.underline-style(-3px, var(--primary-base));
  }

  &__body {
    flex: 1;
    @include mix.flex-box($d: column, $j: space-between);
    @include anim.transition;
  }

  &-content {
    @include mix.padding-d(l, md);
    @include mix.margin-d(b, lg);
    color: var(--text-weak);
    line-height: 1.7;

    &::before {
      content: '';
      @include mix.position-style($p: absolute, $l: 0, $t: 0);
      @include mix.size(4px, 100%);
      background: linear-gradient(to bottom, var(--primary-base), var(--primary-soft));
      border-radius: 2px;
    }
  }

  &__detail {
    @include mix.flex-box($j: space-between);
  }

  &-reply,
  &-content {
    position: relative;
  }

  &__detail,
  &-content {
    width: 100%;
  }
}

.replies {
  &-holder {
    text-align: center;
    @include mix.font-style($s: sm, $c: var(--primary-base));

    &>span {
      @include mix.underline-style;
    }

    &-icon {
      display: inline-block;
      @include mix.margin-d(l, xs);
      @include anim.transition;
      rotate: 0deg;
    }
  }

  &--expanded {
    rotate: 180deg;
  }
}
</style> -->