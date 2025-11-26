<script lang="ts" setup>

</script>

<template>
  <div class="nonsence">
    <div class="nonsence__container">
      <div class="nonsence-tag"> 当前目标 </div>
      <div class="nonsence__content">
        <div class="nonsence-word">
          <h4 class="nonsence-word-title">成为一名的 Web 前端工程师</h4>
          <div class="nonsence-word-text">我现在正在努力学习前端开发，希望能找到一份前端工程师的工作。每天都能学到一些新东西，感觉挺充实的</div>
        </div>
        <div class="nonsence-word">
          <h4 class="nonsence-word-title">过好自己的生活</h4>
          <div class="nonsence-word-text">工作归工作，生活也要过得有滋有味。我想保持工作与生活的平衡，有时间做自己喜欢的事，保持健康，跟朋友家人多聚聚。</div>
        </div>
        <div class="nonsence-word">
          <h4 class="nonsence-word-title">出去旅游放松</h4>
          <div class="nonsence-word-text">
            等工作稳定了，我想去旅游放松一下。可能是去海边，也可能是去一个有好吃的地方
            <span>（广州、深圳、长沙、贵州、南宁、内蒙古大草原）</span>
            ，总之就是想换个环境，放松心情。
          </div>
        </div>
        <div class="nonsence-word">
          <h4 class="nonsence-word-title">5070ti</h4>
          <div class="nonsence-word-text">
            当前设备是mackbook air m3用来办公确实不错，但是性能部分还是差点，所以我特别想买一台RTX 5070Ti显卡的电脑
            <span>（具体来说是AMD9800x3d+七彩虹5070ti+宏碁冰刃16Gx2 DDR5内存条+技嘉b850冰雕主板+西部数据sn5000 1t固态硬盘）</span>
            ，既能满足我编程的需求，又能让我在休息时间好好玩玩游戏放松一下。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nonsence {
  height: fit-content;
  &__container {
    @extend %aboutme-container;
    @include mix.padding(lg);
  }
  &-tag {
    @extend %aboutme-tag;
    @include mix.font-style($c: var(--text-subtler));
  }
  &__content {
    @include mix.margin-d(t, xl);
    @include mix.flex-box($d: column, $a: flex-start, $g: sm);
  }
  &-word {
    &-title {
      @include mix.font-style($s: md, $c: var(--text-base), $f: 'title');
    }
    &-text {
      @include mix.margin-d(t, sm);
      @include mix.font-style($s: sm, $c: var(--text-weak));
      line-height: 1.7;
      &>span {
        background: 
          linear-gradient(120deg, var(--primary-weak) 0%, var(--secondary-weak) 100%),
          linear-gradient(120deg, rgba(255, 241, 118, 0.2) 0%, rgba(255, 111, 0, 0.2) 100%);
        @include anim.transition(color);
        color: transparent;
        @include hov.color(var(--white-base));
      }
    }
  }
}
</style>