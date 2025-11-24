<script lang="ts" setup>
import PageHeader from '@/components/bases/PageHeader.vue';
import type { PageHeaderField } from '@/types/components/PageHead';

// import GameCard from '@/components/cards/aboutme/GameCard.vue';
// import InfoCard from '@/components/cards/aboutme/InfoCard.vue';
// import TipsCard from '@/components/cards/aboutme/TipsCard.vue';
// import EducationCard from '@/components/cards/aboutme/EducationCard.vue';
import AnimeCard from '@/components/cards/aboutme/AnimeCard.vue';

const aboutmeField: PageHeaderField = {
  title: '关于我',
  desc: '本页将向你介绍我的个人背景、技能方向，以及我目前关注的领域。'
}
</script>

<template>
  <TopBar/>
  <div class="aboutme">
    <div class="aboutme__container">
      <div class="aboutme__header">
        <PageHeader :field="aboutmeField" :wave="{
          height: '70px'
        }"/>
      </div>
      <div class="aboutme__body container">
        <div class="aboutme__body-wrapper">
          <div class="aboutme-info">
            <!-- <InfoCard /> -->
          </div>
          <div class="aboutme-tips">
            <!-- <TipsCard /> -->
          </div>

          <div class="aboutme-education">
            <!-- <EducationCard /> -->
          </div>
          <div class="aboutme-game">
            <!-- <GameCard /> -->
          </div>
          <div class="aboutme-anime">
            <AnimeCard />
          </div>
        </div>
      </div>
      <div class="aboutme__footer">
        <FooterBar/>
      </div>
    </div>
  </div>
  <RightSideBar />
</template>

<style lang="scss" scoped>
/* 定义动画关键帧：移动背景位置 */
@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
    /* 起始位置 */
  }

  50% {
    background-position: 100% 100%;
    /* 中间位置 */
  }

  100% {
    background-position: 0% 50%;
    /* 结束位置（回到起始） */
  }
}

.aboutme {
  &__container {}

  &__header {}

  &__body {
    @include mix.padding(0 lg);
    min-height: calc(100vh + 60px);

    &-wrapper {
      @include mix.margin-d(t, lg);
      @include mix.grid-box($c: 18, $g: lg);

      @include mix.respond-down(md) {
        @include mix.grid-box($c: 1);
      }
    }
  }

  &__footer {
    width: 100%;
  }

  &-info {
    @include mix.size(100%, fit-content);

    @include mix.respond-up(md) {
      grid-row: 1;
      grid-column: 1 / 12;
    }
  }

  &-tips {
    @include mix.size(100%, fit-content);

    @include mix.respond-up(md) {
      grid-row: 1;
      grid-column: 12 / 19;
    }
  }

  &-game {
    @include mix.size(100%, fit-content);

    @include mix.respond-up(md) {
      grid-row: 3;
      grid-column: 1 / 10;
    }
  }
  &-anime {
    @include mix.size(100%, fit-content);

    @include mix.respond-up(md) {
      grid-row: 3;
      grid-column: 10 / 19;
    }
  }
  &-education {
    @include mix.size(100%, fit-content);

    @include mix.respond-up(md) {
      grid-row: 2;
      grid-column: 10 / 15;
    }
  }
}
</style>