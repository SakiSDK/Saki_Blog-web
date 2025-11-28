<script lang="ts" setup>
import CommentCard from '../cards/CommentCard.vue'
import { ref, computed, onMounted, watch } from 'vue'
import CommentMask from '../comments/CommentMask.vue'
import { useCommentStore } from '@/stores/useCommentStore'
import { usePostStore } from '@/stores/usePostStore'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/useUserStore'
import { showMessage } from '../message/message'
import loadingImg from '@/assets/images/loading-dark.gif'


// 限制输入长度
const LIMIT_INPUT: number = 1000

/** ---------- 状态管理 ---------- */
const { fetchComments, submitComment } = useCommentStore()
const { commentCount, comments, isLoading, hasMore } = storeToRefs(useCommentStore());
const { currentPost } = storeToRefs(usePostStore())
const { user } = storeToRefs(useUserStore());


//页面动态数据
const inputContent = ref<string>('')


/** ---------- 计算属性 ---------- */
const inputContentCount = computed<number>(() => inputContent.value.length);
const commentCountContent = computed<string>(() => '共 ' + commentCount.value + ' 条评论')

/** ---------- 元素绑定 ---------- */
const scrollContainer = ref(null);

// 页面文案内容
const commentTitle: { iconName: string, content: string } = {
  iconName: 'message',
  content: '发布评论'
}
const commentFormText: {
  type: string,
  placeholder: string,
  wordLimit: number,
} = {
  type: 'text',
  placeholder: '请输入内容',
  wordLimit: 500
}
const wordLimit: string = '/' + commentFormText.wordLimit;//字数限制


/** ---------- 逻辑方法 ---------- */
const clearInputContent = () => {
  inputContent.value = '';
};
// 提交评论逻辑
const handleSubmitComment = async () => {
  try {
    if (!currentPost.value?.shortId) return;
    const newComment = await submitComment(currentPost.value.shortId, {
      content: inputContent.value,
    });

    showMessage({
      type: 'primary',
      content: '评论成功',
    })
  } catch (error) {
    showMessage({
      type: 'error',
      content: error.message,
    });
  } finally {
    // 提交完成后重置输入框
    inputContent.value = '';
  }
}

// 加载更多评论
const handleLoadMore = async () => {
  try {
    if (hasMore.value) {
      console.log('加载更多评论')
      await fetchComments(currentPost.value.shortId, true);
    } else {
      console.log('没有更多数据了')
      await fetchComments(currentPost.value.shortId);
    }
  } catch (e) {
    console.log(e);
  }
}

// 处理用户输入
const onInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  if (inputContentCount.value > LIMIT_INPUT) {
    inputContent.value = inputContent.value.slice(0, LIMIT_INPUT);
  }
  target.style.height = 'auto'   // 先重置
  target.style.height = target.scrollHeight + 'px' // 再根据内容调整
}

/** ---------- 监听变量 ---------- */


onMounted(async () => {
  // 获取评论列表
  try {
    await fetchComments(currentPost.value.shortId);
  } catch (error) {
    console.log(error)
  }
})
</script>

<template>
  <div
    class="comment"
    ref="scrollContainer"
  >
    <div class="comment__wrapper">
      <CommentMask />
      <CardHeader
        :iconName="commentTitle.iconName"
        :title="commentTitle.content"
      />
      <div class="comment-form">
        <div class="comment-form__wrapper">
          <div class="comment-form__box">
            <div class="commtent-form__avatar-wrapper">
              <Avatar
                :src="user.avatar"
                :size="'55px'"
              />
            </div>
            <div class="comment-form__text">
              <textarea
                :type="commentFormText.type"
                :placeholder="commentFormText.placeholder"
                v-model="inputContent"
              />
              <div class="comment-form__text-limit">
                <span>{{ inputContentCount }}</span><span>{{ wordLimit }}</span>
              </div>
            </div>
          </div>
          <div class="comment-form__actions">
            <button
              class="comment-form__cancel"
              @click="clearInputContent"
            >清空</button>
            <button
              class="comment-form__submit"
              @click="handleSubmitComment"
            >发布</button>
          </div>
        </div>
      </div>
    </div>
    <div class="comment__list">
      <div
        class="comment__list__header"
        v-reveal
      >
        <span class="comment__list__header-stat">{{ commentCountContent }}</span>
        <span
          class="comment__list__header-refresh"
          v-tippy="{
            content: '刷新评论列表',
            theme: 'link',
            appentTo: 'parent'
          }"
        >
          <Icon name="refresh" />
        </span>
      </div>
      <div class="comment__list__content">
        <div
          class="comment__list__content-item"
          v-for="item in comments"
          :key="item.id"
        >
          <CommentCard
            v-reveal
            :comment="item"
          />
        </div>
        <img
          v-if="isLoading"
          :src="loadingImg"
          alt="加载评论中..."
        >
        <div
          class="comment__list-loadmore"
          @click="handleLoadMore"
        >
          <span>{{ hasMore ? '更多评论' : '收起评论' }}</span>
          <span
            class="comment__list-loadmore-icon"
            :class="{ 'comment__list--expanded': hasMore }"
          >
            <Icon name="reply-fold" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comment {
  &__wrapper {
    position: relative;
    @include mix.container-style($p: 40px 60px, $b: var(--border-base), $o: hidden);
    @include anim.transition;
    @include anim.border-color;
    @include anim.translateY;
    @include mix.margin-d(b, lg);
  }

  &-title {
    display: inline-flex;
    @include mix.flex-box($j: flex-start, $g: sm);
    @include mix.margin-d(b, lg);
    font-weight: normal;
  }

  &-form {
    @include mix.margin-d(b, xl);
    @include mix.margin-d(t, md);

    &__box {
      @include mix.size(100%);
      @include mix.flex-box($a: flex-start, $g: lg);
    }

    &__actions {
      @include mix.margin-d(t, md);
      @include mix.flex-box($j: flex-end, $g: md);
    }

    &__submit,
    &__cancel {
      @include mix.container-style($p: sm md, $b: var(--border-base), $r: md);
      @include anim.transition;
      @include anim.translateY(-2px, none);
    }

    &__submit {
      background-color: var(--color-primary-base);
      @include anim.bgcolor(var(--color-primary-strong));
    }

    &__cancel {
      background-color: var(--interactive-base);
      @include anim.bgcolor(var(--interactive-strong));
    }

    &__info {
      @include mix.flex-box($j: flex-start, $g: sm);

      &-item {
        flex: 1;
        @include mix.flex-box($j: flex-start);
        @include mix.container-style($b: var(--border-base), $r: md, $p: 0, $o: hidden);
        @include mix.margin-d(b, lg);
        font-size: fun.font-size(sm);

        &>span {
          @include mix.container-style($p: sm md, $r: 0, $bg: var(--interactive-base));
          border-right: var(--border-base);
        }

        &>input {
          flex: 1;
          @include mix.container-style($p: 0 md, $r: md);
          @include mix.radius-d(tl bl, 0);
        }
      }

      &-send {
        @include mix.margin-d(b, lg);
        @include mix.container-style($p: sm md, $b: var(--border-base), $r: md, $bg: var(--interactive-base));
        font-size: fun.font-size(sm);
        @include anim.transition;
        @include anim.translateY(-2px, none);
        @include anim.bgcolor(var(--interactive-strong))
      }
    }

    &__text {
      position: relative;
      width: 100%;
      @include mix.margin-d(b, sm);

      &>textarea {
        @include mix.container-style($p: sm md, $b: var(--border-base), $r: md);
        width: 100%;
        min-height: 150px;
        font-size: fun.font-size(sm);
        line-height: 1.7;
        resize: none;
      }

      &-limit {
        @include mix.position(absolute, $b: 15px, $r: 10px);
        @include mix.font-style($s: xs, $c: var(--text-subtle));
      }
    }
  }

  &__list {
    @include mix.container-style($p: lg 60px, $b: var(--border-base));

    &--expanded {
      rotate: 180deg;
    }

    &__header {
      @include mix.flex-box($j: space-between);
      @include mix.container-style($p: sm lg, $b: var(--border-base), $r: md);
      @include mix.margin(lg 0);

      &-stat,
      &-refresh {
        font-size: fun.font-size(lg);
      }

      &-refresh {
        cursor: pointer;
        @include anim.transition;

        &:hover {
          color: var(--color-primary-base);
        }
      }
    }

    &-loadmore {
      @include mix.margin-d(t, sm);
      text-align: center;
      @include mix.font-style($c: var(--color-primary-base));
      @include mix.underline-style;

      &-icon {
        display: inline-block;
        @include mix.margin-d(l, xs);
        @include anim.transition;
        rotate: 0;
      }
    }

    &__content {
      @include mix.flex-box(column);

      &-item {
        width: 100%;
        @include mix.margin-d(b, lg);
      }
    }
  }
}
</style>