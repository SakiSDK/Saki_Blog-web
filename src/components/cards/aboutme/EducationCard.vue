<script lang="ts" setup>
// EducationCard.vue - 展示教育经历
import schoolLogo from '@/assets/imgs/school.webp';
</script>

<template>
  <div class="education">
    <div class="education__container">
      <!-- Header Section -->
      <div class="education-header">
        <div class="header-title">
          <span class="en">EDUCATION</span>
          <span class="cn">学历</span>
        </div>
        <div class="header-line"></div>
      </div>

      <!-- Body Wrapper (Center Content) -->
      <div class="education-body">
        <!-- School Info -->
        <div class="education-school">
          <div class="school-logo">
            <img :src="schoolLogo" alt="School Logo" />
          </div>
          <div class="school-content">
            <h2 class="school-name">湖南工程学院</h2>
            <div class="school-badges">
              <span class="badge">全日制本科</span>
              <span class="badge highlight">工学学士</span>
            </div>
          </div>
        </div>

        <!-- Timeline / Meta -->
        <div class="education-timeline">
          <div class="timeline-dot"></div>
          <div class="timeline-line"></div>
          <div class="timeline-period">2021.09 - 2026.06</div>
        </div>
      </div>

      <!-- Details Section (Grid) -->
      <div class="education-details">
        <div class="detail-item major">
          <div class="detail-label">专业 Major</div>
          <div class="detail-value">软件工程</div>
        </div>
        <div class="detail-item direction">
          <div class="detail-label">方向 Direction</div>
          <div class="detail-value">前端开发</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.education {
  height: rem(320);
  &__container {
    @extend %aboutme-container;
    @include mix.flex-box($d: column, $j: space-between, $a: stretch);
    @include mix.padding(rem(24));
    background: var(--surface-base);
    position: relative;
    overflow: hidden;
  }
}
.education-header {
  @include mix.flex-box($j: space-between, $a: center, $g: md);
  flex-shrink: 0;
  .header-title {
    @include mix.flex-box($a: baseline, $g: xs);
    .en {
      @include mix.font-style($f: pixel, $s: md, $c: var(--text-subtle));
      letter-spacing: 1px;
      opacity: 0.8;
    }
    .cn {
      @include mix.container-style($p: rem(2) rem(6), $r: sm, $bg: var(--surface-subtle));
      @include mix.font-style($s: xs, $c: var(--text-subtler));
    }
  }
  .header-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, var(--border-base-color), transparent);
    opacity: 0.5;
  }
}
.education-body {
  flex: 1;
  @include mix.flex-box($d: column, $j: center, $a: flex-start, $g: lg);
  @include mix.padding(rem(10) 0);
}
.education-school {
  @include mix.flex-box($a: center, $g: lg);
  .school-logo {
    @include mix.size(rem(64));
    @include mix.flex-box($j: center, $a: center);
    @include mix.container-style($r: lg, $p: rem(3), $bg: var(--white-base), $s: var(--shadow-base), $o: hidden);
    flex-shrink: 0;
    img {
      @extend %full-size;
      object-fit: contain;
    }
  }
  .school-content {
    @include mix.flex-box($d: column, $a: flex-start, $g: sm);
    .school-name {
      @include mix.font-style($f: title, $s: xl, $c: var(--text-title), $l: 1.2);
      margin: 0;
    }
    .school-badges {
      @include mix.flex-box($a: center, $g: sm);
      .badge {
        @include mix.container-style($p: rem(2) rem(8), $r: sm, $bg: var(--surface-subtle), $b: 1px solid var(--border-base-color));
        @include mix.font-style($s: xs, $c: var(--text-subtle));
        &.highlight {
          @include mix.font-style($c: var(--blue-base));
          background: var(--blue-transparent);
          border-color: var(--blue-ghost);
        }
      }
    }
  }
}

.education-timeline {
  @include mix.flex-box($a: center, $g: md);
  @include mix.padding-d(l, rem(6));
  .timeline-dot {
    @include mix.size(rem(8));
    border-radius: 50%;
    background: var(--green-base);
    box-shadow: 0 0 0 4px var(--green-transparent);
  }
  .timeline-line {
    @include mix.size(rem(40), 2px);
    background: var(--border-base-color);
  }
  .timeline-period {
    @include mix.font-style($f: pixel, $s: sm, $c: var(--text-subtle));
    letter-spacing: 0.5px;
  }
}
.education-details {
  @include mix.grid-box($c: 2, $g: rem(16));
  flex-shrink: 0;
  .detail-item {
    @include mix.container-style($p: md, $r: lg, $b: var(--border-base));
    @include mix.flex-box($d: column, $a: flex-start, $g: xs);
    @include hov.move-y;
    @include anim.transition($p: transform, $dr: slow);
    .detail-label {
      @include mix.font-style($s: xs, $c: var(--text-subtler));
    }
    .detail-value {
      @include mix.font-style($s: md, $w: bold);
    }
    &.major {
      background: var(--red-transparent);
      border-color: var(--red-ghost);
      .detail-value { color: var(--red-base); }
    }
    &.direction {
      background: var(--yellow-transparent);
      border-color: var(--yellow-ghost);
      .detail-value { color: var(--yellow-base); }
    }
  }
}
</style>
