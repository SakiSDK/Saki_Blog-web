<script lang="ts" setup>
import PageHeader from '@/components/bases/PageHeader.vue';
import type { PageHeaderField } from '@/components/bases/PageHeader.vue';
import GameCard from '@/components/cards/aboutme/GameCard.vue';
import InfoCard from '@/components/cards/aboutme/InfoCard.vue';
import SmallJoyCard from '@/components/cards/aboutme/SmallJoyCard.vue';
import EducationCard from '@/components/cards/aboutme/EducationCard.vue';
import AnimeCard from '@/components/cards/aboutme/AnimeCard.vue';
import { createI18nUtil } from '@/utils/i18n.util';
import NonsenceCard from '@/components/cards/aboutme/NonsenceCard.vue';
import Techstack from '@/components/cards/aboutme/Techstack.vue';
import PersonalityCard from '@/components/cards/aboutme/PersonalityCard.vue';
import MottoCard from '@/components/cards/aboutme/MottoCard.vue';

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
          <div 
            class="aboutme-info" 
            v-reveal="{
              delay: 1500,
              duration: 1000
            }"
          >
            <InfoCard />
          </div>
          <div 
            class="aboutme-small-joy"
            v-reveal="{
              delay: 1600,
              duration: 1000
            }"
          >
            <SmallJoyCard />
          </div>
          <div 
            class="aboutme-education"
            v-reveal="{
              delay: 1700,
              duration: 1000
            }"
          >
            <EducationCard />
          </div>
          <div 
            class="aboutme-techstack"
            v-reveal="{
              delay: 1800,
              duration: 1000
            }"
          >
            <Techstack/>
          </div>
          <div class="aboutme-personality" v-reveal="{
            delay: 1900,
            duration: 1000
          }">
            <PersonalityCard/>
          </div>
          <div class="aboutme-motto" v-reveal="{
            delay: 2000,
            duration: 1000
          }">
            <MottoCard/>
          </div>
          <div class="aboutme-game" v-reveal="{
            delay: 2100,
            duration: 1000
          }">
            <GameCard />
          </div>
          <div class="aboutme-anime" v-reveal="{
            delay: 2200,
            duration: 1000
          }">
            <AnimeCard />
          </div>
          <div class="aboutme-nonsence" v-reveal="{
            delay: 2300,
            duration: 1000
          }">
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
  &-info,
  &-small-joy {
    @include mix.respond-up(md) {
      grid-row: 1;
    }
  }
  &-info {
    @include mix.respond-up(md) {
      grid-column: 1 / 12;
    }
  }
  &-small-joy {
    @include mix.respond-up(md) {
      grid-column: 12 / 19;
    }
  }
  &-education,
  &-techstack {
    @include mix.respond-up(md) {
      grid-row: 2;
    }
  }
  &-education {
    @include mix.respond-up(md) {
      grid-column: 1 / 9;
    }
  }
  &-techstack {
    @include mix.respond-up(md) {
      grid-column: 9 / 19;
    }
  }
  &-personality,
  &-motto {
    @include mix.respond-up(md) {
      grid-row: 3;
    }
  }
  &-personality {
    @include mix.respond-up(md) {
      grid-column: 1 / 11;
    }
  }
  &-motto {
    @include mix.respond-up(md) {
      grid-column: 11 / 19;
    }
  }
  &-game,
  &-anime {
    @include mix.respond-up(md) {
      grid-row: 4;
    }
  }
  &-game {
    @include mix.respond-up(md) {
      grid-column: 1 / 10;
    }
  }
  &-anime {
    @include mix.respond-up(md) {
      grid-column: 10 / 19;
    }
  }
  &-nonsence {
    @include mix.respond-up(md) {
      grid-row: 5;
      grid-column: 1 / 19;
    }
  }
  &__footer {
    @include mix.margin-d(t, lg);
  }
}
</style>