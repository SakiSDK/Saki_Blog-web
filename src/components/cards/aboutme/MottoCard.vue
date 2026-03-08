<script lang="ts" setup>

</script>

<template>
  <div class="motto">
    <div class="motto__container">
      <div class="motto-tag">个人理念</div>
      <!-- 装饰性引号 -->
      <div class="quote-icon-start">“</div>
      <div class="motto-content">
        <p>
          在职业生涯中，我深刻体会到良好的人际关系是成功的基石。通过真诚沟通、相互理解和团队协作，我们能够克服任何挑战，实现共同目标。
        </p>
      </div>
      <!-- 装饰性引号 -->
      <div class="quote-icon-end">”</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.motto {
  height: rem(300);
  
  &__container {
    @extend %aboutme-container;
    @include mix.flex-box($d: column, $j: center, $a: center);
    padding: rem(32) rem(40);
    position: relative;
    overflow: hidden;
    background: var(--surface-base);
  }

  &-tag {
    @extend %aboutme-tag;
  }

  // 装饰引号样式
  .quote-icon-start,
  .quote-icon-end {
    @include mix.position-style($p: absolute, $z: 0);
    font-family: "Georgia", serif;
    @include mix.font-style($s: rem(80), $l: 1, $c: var(--primary-base));
    opacity: 0.15;
    pointer-events: none;
  }
  .quote-icon-start {
    top: rem(40);
    left: rem(20);
  }
  .quote-icon-end {
    bottom: rem(20);
    right: rem(20);
  }
  &-content {
    width: 100%;
    @include mix.position-style($p: relative, $z: 1);
    p {
      @include mix.font-style($s: lg, $l: 1.8, $c: var(--text-base), $f: 'title'); // 使用标题字体保持一致性
      text-align: justify;
      letter-spacing: 0.5px;
      margin: 0;
      // 添加首行缩进
      text-indent: 2em;
    }
  }
}
</style>