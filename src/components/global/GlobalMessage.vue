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

// import { message } from '@/plugins/message'

// const showSuccess = () => {
//   const messageId = message.success('操作成功', '您的数据已成功保存', 3000)
//   console.log('消息ID:', messageId)
// }

// const showError = () => {
//   message.error('操作失败', '请检查网络连接后重试')
// }

// const showWarning = () => {
//   message.warning('请注意', '此操作将删除重要数据此操作将删除重要数据此操作将删除重要数据此操作将删除重要数据此操作将删除重要数据此操作将删除重要数据此操作将删除重要数据此操作将删除重要数据')
// }

// const showInfo = () => {
//   message.info('提示', '系统将在5分钟后维护')
// }

// const clearMessages = () => {
//   message.clearAll()
// }

// // 或者使用 show 方法
// const showCustomMessage = () => {
//     message.show({
//         type: 'success',
//         title: '自定义消息',
//         content: '这是一个自定义配置的消息',
//         duration: 5000,
//         closable: false
//     })
// }
</script>

<template>
  <TransitionGroup 
    name="message-slide"
    tag="div"
    class="message__container"
  >
    <div 
      v-for="message in messages"
      :class="['message', `message--${message.type}`]"
    >
      <div class="message-icon">
        <Icon />
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
/* 动画效果 */
.message-slide-enter-active,
.message-slide-leave-active {
  transition: all 0.3s ease;
}

.message-slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.message-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.message-slide-move {
  transition: transform 0.3s ease;
}


.message__container {
  // @include mix.size(fit-content);
  @include mix.position-style($p: fixed, $t: lg, $r: lg, $z: fixed);
  pointer-events: none;
}
.message {
  @include mix.flex-box($ai: flex-start, $jc: flex-start);
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


