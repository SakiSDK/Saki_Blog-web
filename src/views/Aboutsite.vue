<script lang="ts" setup>
import PageHeader from '@/components/bases/PageHeader.vue';
import type { PageHeaderField } from '@/components/bases/PageHeader.vue';
import SiteTechStackCard from '@/components/cards/aboutsite/SiteTechStackCard.vue';
import SiteIntroCard from '@/components/cards/aboutsite/SiteIntroCard.vue';


const pageField: PageHeaderField = {
  title: '关于本站',
  desc: '探索本站的构建技术与设计理念',
}
</script>

<template>
  <TopBar/>
  <div class="aboutsite">
    <div class="aboutsite__container">
      <div class="aboutsite__header">
        <PageHeader 
          :field="pageField" 
          :wave="{ height: '70px' }"
        />
      </div>
      <div class="aboutsite__body container">
        <div class="aboutsite__wrapper">
          <div 
            class="aboutsite-tech" 
            v-reveal="{
              delay: 1500,
              duration: 1000
            }"
          >
            <SiteTechStackCard/>
          </div>
          <div 
            class="aboutsite-intro"
            v-reveal="{
              delay: 1600,
              duration: 1000
            }"
          >
            <SiteIntroCard/>
          </div>
        </div>
      </div>
      <div class="aboutsite__footer">
        <FooterBar/>
      </div>
    </div>
  </div>
  <RightBar/>
</template>

<style lang="scss" scoped>
.aboutsite {
  min-height: 100vh;
  &__container {
    margin: 0 auto;
  }
  &__header {
    @include mix.margin-d(b, xl);
  }
  &__body {
    min-height: calc(100vh - 190px);
  }
  &__wrapper {
    @include mix.margin-d(t, lg);
    @include mix.grid-box($c: 18, $g: lg);
    @include mix.respond-down(md) {
      @include mix.grid-box($c: 1);
    }
  }
  &__footer {
    @include mix.margin-d(t, xl);
  }

  &-tech {
    @include mix.respond-up(md) {
      grid-column: 1 / 11;
    }
  }

  &-intro {
    @include mix.respond-up(md) {
      grid-column: 11 / 19;
    }
  }
}
</style>
