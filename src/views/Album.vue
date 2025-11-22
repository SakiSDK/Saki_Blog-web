<template>
  <div class="test">
    <p>{{ msg }}</p>
  </div>
</template>

<script setup lang="ts">
const msg = 'Hello World' // 缺少分号（根据 Prettier 配置，semi: true 会自动添加）
const unusedVar = 'This variable is unused' // 未使用的变量（ESLint 会警告）
console.log(unusedVar)
</script>

<style scoped>
.test {
  color: red; /* 末尾缺少分号（Prettier 会自动添加） */
}
</style>