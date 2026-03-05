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
    padding: rem(24);
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
      @include mix.font-style($s: xs, $c: var(--text-subtler));
      background: var(--surface-subtle);
      padding: 2px 6px;
      border-radius: 4px;
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
  padding: rem(10) 0;
}

.education-school {
  @include mix.flex-box($a: center, $g: lg);
  
  .school-logo {
    @include mix.size(rem(64));
    @include mix.flex-box($j: center, $a: center);
    background: white; // 改为白色底色，适应 Logo
    border-radius: 18px;
    box-shadow: var(--shadow-base);
    flex-shrink: 0;
    overflow: hidden;
    padding: rem(3); // 给 Logo 一点内边距
    
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  
  .school-content {
    @include mix.flex-box($d: column, $a: flex-start, $g: sm);
    
    .school-name {
      @include mix.font-style($f: title, $s: xl, $c: var(--text-title));
      margin: 0;
      line-height: 1.2;
    }

    .school-badges {
      @include mix.flex-box($a: center, $g: sm);
      
      .badge {
        @include mix.font-style($s: xs, $c: var(--text-subtle));
        padding: 2px 8px;
        border-radius: 4px;
        background: var(--surface-subtle);
        border: 1px solid var(--border-base-color);
        
        &.highlight {
          color: var(--blue-base);
          background: var(--blue-transparent);
          border-color: var(--blue-ghost);
        }
      }
    }
  }
}

.education-timeline {
  @include mix.flex-box($a: center, $g: md);
  padding-left: rem(6); // Align with some visual balance
  
  .timeline-dot {
    @include mix.size(rem(8));
    border-radius: 50%;
    background: var(--green-base);
    box-shadow: 0 0 0 4px var(--green-transparent);
  }
  
  .timeline-line {
    width: rem(40);
    height: 2px;
    background: var(--border-base-color);
  }
  
  .timeline-period {
    @include mix.font-style($f: pixel, $s: sm, $c: var(--text-subtle));
    letter-spacing: 0.5px;
  }
}

.education-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: rem(16);
  flex-shrink: 0;
  
  .detail-item {
    padding: rem(16);
    border-radius: 12px;
    border: 1px solid transparent;
    @include mix.flex-box($d: column, $a: flex-start, $g: xs);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
    
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
