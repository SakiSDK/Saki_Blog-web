<script lang="ts" setup>
import PageHeader from '@/components/bases/PageHeader.vue';
import type { PageHeaderField } from '@/types/components/Base';
import GameCard from '@/components/cards/aboutme/GameCard.vue';
import InfoCard from '@/components/cards/aboutme/InfoCard.vue';
import SmallJoyCard from '@/components/cards/aboutme/SmallJoyCard.vue';
import EducationCard from '@/components/cards/aboutme/EducationCard.vue';
import AnimeCard from '@/components/cards/aboutme/AnimeCard.vue';
import { createI18nUtil } from '@/utils/i18n.util';
import NonsenceCard from '@/components/cards/aboutme/NonsenceCard.vue';
import Techstack from '@/components/cards/aboutme/Techstack.vue';

/** ---------- 静态数据 ---------- */
const { t } = createI18nUtil();
// 页头字段
const aboutmeField: PageHeaderField = {
  title: t('aboutme.title'),
  desc: t('aboutme.description'),
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
            <InfoCard />
          </div>
          <div class="aboutme-small-joy">
            <SmallJoyCard />
          </div>
          <div class="aboutme-education">
            <EducationCard />
          </div>
          <div class="aboutme-techstack">
            <Techstack/>
          </div>
          <div class="aboutme-game">
            <GameCard />
          </div>
          <div class="aboutme-anime">
            <AnimeCard />
          </div>
          <div class="aboutme-nonsence">
            <NonsenceCard/>
          </div>
        </div>
      </div>
      <div class="aboutme__footer">
        <FooterBar/>
      </div>
    </div>
  </div>
  <RightBar/>
</template>

<style lang="scss" scoped>
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
  &-info,
  &-small-joy,
  &-game,
  &-anime,
  &-education { 
    @extend %full-width;
  }
  &-info {
    @include mix.respond-up(md) {
      grid-row: 1;
      grid-column: 1 / 12;
    }
  }
  &-small-joy {
    @include mix.respond-up(md) {
      grid-row: 1;
      grid-column: 12 / 19;
    }
  }
  &-education {
    @include mix.respond-up(md) {
      grid-row: 2;
      grid-column: 1 / 9;
    }
  }
  &-techstack {
    @include mix.respond-up(md) {
      grid-row: 2;
      grid-column: 9 / 19;
    }
  }
  &-game {
    @include mix.respond-up(md) {
      grid-row: 3;
      grid-column: 1 / 10;
    }
  }
  &-anime {
    @include mix.respond-up(md) {
      grid-row: 3;
      grid-column: 10 / 19;
    }
  }
  &-nonsence {
    @include mix.respond-up(md) {
      grid-row: 4;
      grid-column: 1 / 19;
    }
  }
}
</style>