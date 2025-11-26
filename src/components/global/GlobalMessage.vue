<script lang="ts" setup>
import { ref } from 'vue';
import type { Message, AddMessage } from '@/types/components/Message';

const messages = ref<Message[]>([]);

// 添加消息
const addMessage = (message: AddMessage) => {
  const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  const newMessage: Message = {
    id,
    duration: 3000,
    closable: true,
    ...message
  }
  
  messages.value.push(newMessage)
  
  // 自动移除
  if (newMessage.duration && newMessage.duration > 0) {
    setTimeout(() => {
      removeMessage(id)
    }, newMessage.duration)
  }
  
  return id
}

// 移除消息
const removeMessage = (id: string) => {
  const index = messages.value.findIndex(msg => msg.id === id)
  if (index > -1) {
    messages.value.splice(index, 1)
  }
}

// 清空所有消息
const clearAll = () => {
  messages.value = []
}

// 暴露方法给全局使用
defineExpose({
  addMessage,
  removeMessage,
  clearAll
})
</script>

<template>
  <TransitionGroup 
    name="slide-from-left"
    tag="div"
    class="message__container"
  >
    <div 
      v-for="message in messages"
      :class="['message', `message--${message.type}`]"
    >
      <div class="message-icon">
        <Icon name="close"/>
      </div>
      <div class="message__content">
        <div class="message-title">
          {{ message.title }}
        </div>
        <div v-if="message.content" class="message-text">
          {{ message.content }}
        </div>
      </div>
      <button 
        v-if="message.closable" 
        class="message__close" 
        @click.stop="removeMessage(message.id)"
      >
        <Icon name="close"/>
      </button>
    </div>
  </TransitionGroup>
</template>

<style lang="scss" scoped>
.message__container {
  // @include mix.size(fit-content);
  padding-top: 70px;
  @include mix.position-style($p: fixed, $t: 0, $l: lg, $z: fixed);
  pointer-events: none;
}
.message {
  @include mix.flex-box($a: flex-start, $j: flex-start);
  width: 300px;
  min-height: 30px;
  margin-bottom: 10px;
  @include mix.container-style(
    $p: sm md, 
    $r: sm, 
    $s: 0 4px 12px rgba(0, 0, 0, 0.15), 
    $b: var(--border-base)
  );
  pointer-events: auto;
  @include anim.transition;
  $states: (
    success: var(--green-base),
    info: var(--blue-base),
    warning: var(--yellow-base),
    error: var(--red-base),
  );
  @each $key, $value in $states {
    &--#{$key} {
      border-left: 4px solid #{$value};
      .message-icon {
        color: #{$value};
      }
    }
  }
  &-content {
    flex: 1;
    min-width: 0;
  }
  &-title {
    @include mix.font-style($s: xl, $c: var(--primary-base), $f: 'title');
    @include mix.text-style($lh: 1.4, $wp: break-word);
  }
  &-text {
    margin-top: 10px;
    @include mix.font-style($s: sm, $c: var(--text-subtle))
  }
  &__close {
    @include mix.size(18px);
    margin-left: 12px;
    @include mix.container-style($b: none, $bg: none, $p: 0);
    @include mix.font-style($s: lg, $c: var(--interactive-base));
    cursor: pointer;
    line-height: 1;
    &:hover {
      color: var(--primary-base);
    }
  }
}
</style>


