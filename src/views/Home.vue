<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref, watch } from 'vue';

const { t } = useI18n();
import { message } from '@/plugins/message'

const showSuccess = () => {
  const messageId = message.success('操作成功', '您的数据已成功保存', 3000)
  console.log('消息ID:', messageId)
}

const showError = () => {
  message.error('操作失败', '请检查网络连接后重试')
}

const showWarning = () => {
  message.warning('请注意', '此操作将删除重要数据此操作将删除重要数据此操作将删除重要数据此操作将删除重要数据此操作将删除重要数据此操作将删除重要数据此操作将删除重要数据此操作将删除重要数据')
}

const showInfo = () => {
  message.info('提示', '系统将在5分钟后维护')
}

const clearMessages = () => {
  message.clearAll()
}

// 或者使用 show 方法
const showCustomMessage = () => {
  message.show({
    type: 'success',
    title: '自定义消息',
    content: '这是一个自定义配置的消息',
    duration: 5000,
    closable: false
})
}
</script>

<template>
    <Top/>
    <div class="home">
        <div class="home__container">
            <div class="home__header">
                {{ t('test') }}
                <button @click="showSuccess">成功消息</button>
                <button @click="showError">错误消息</button>
                <button @click="showWarning">警告消息</button>
                <button @click="showInfo">信息消息</button>
                <button @click="clearMessages">清空所有</button>
            </div>
            <Footer/>
        </div>
    </div>
    <RightBar/>
</template>

<style lang="scss" scoped>
.home {

}
</style>