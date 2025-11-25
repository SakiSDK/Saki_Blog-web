<script lang="ts" setup>
import HeroSection from '@/components/sections/HeroSection.vue';
import AboutCard from '@/components/cards/home/AboutCard.vue';
import AnnouncementCard from '@/components/cards/home/AnnouncementCard.vue';
import PictureCard from '@/components/cards/home/PictureCard.vue';
import HelloCard from '@/components/cards/home/HelloCard.vue';
// import NonsenseCard from '@/components/cards/NonsenseCard.vue';
// import StatsPanel from '@/components/cards/StatsPanel.vue';
// import ArticleSection from '@/components/sections/ArticleSection.vue';
// import useDomControl from '@/utils/useDomControl';
import { DomUtil } from '@/utils/dom.util';
import { useThrottleFn, useEventListener, useWindowScroll, useTimeoutFn} from '@vueuse/core'
import { onMounted, ref, watch } from 'vue'


const { directions } = useWindowScroll()



onMounted(async () => {
    const throlledScroll = useThrottleFn(() => {
        if (directions.bottom) {
            if (window.scrollY < window.innerHeight) {
                DomUtil.scrollToNextView();
            }
        } else {
            if (window.scrollY < window.innerHeight) {
                DomUtil.scrollToTop()
            }
        }
    },100)
    useEventListener(window, 'scroll', throlledScroll)
})
</script>

<template>
    <TopBar ref="topBarRef"/>
    <div class="home">
        <HeroSection/>
        <div class="home__content container">
            <div class="home__wrapper">
                <div class="home-aboutme">
                    <AboutCard/>
                </div>
                <div class="home-picture">
                    <PictureCard/>
                </div>
                <div class="home-hello">
                    <HelloCard/>
                </div>
                <div class="home-group">
                    <!-- <NonsenseCard v-reveal/> -->
                    <!-- <StatsPanel v-reveal/> -->
                </div>
                <div class="home-announcement">
                    <AnnouncementCard/>
                </div>
            </div>
            <!-- <ArticleSection/> -->
            <div class="home__info-line">
                
            </div>
        </div>
        <FooterBar/>
    </div>
    <RightBar/>
</template>

<style lang="scss" scoped>
@use 'sass:map';
.home {
    &__content{
        @include mix.margin-d(b, lg);
    }
    &__content {
        min-height: calc(100vh - 293px);
        padding: 40px;
        @include mix.margin-d(t, 50px);
    }
    &__wrapper {
        @include mix.grid-box($c: 18, $g: lg);
        @include mix.respond-down(md){
            grid-template-columns: 1fr !important;
        };
    }
    &-aboutme,
    &-picture,
    &-hello,
    &-group, 
    &-announcement {
        @extend %full-width;
    }

    &-aboutme {
        @include mix.respond-up(md) {
            grid-row: 1;
            grid-column: 1 / 9;
        }
    }
    &-picture {
        @include mix.respond-up(md) {
            grid-row: 1;
            grid-column: 9 / 19;
        }
    }
    &-hello {
        @include mix.respond-up(md) {
            grid-row: 2;
            grid-column: 1 / 10;
        }
    }
    &-group {
        @include mix.respond-up(md) {
            grid-row: 2;
            grid-column: 1 / 9;
        }
    }
    &-announcement {
        @include mix.respond-up(md) {
            grid-row: 3;
            grid-column: 1 / 19;
        }
    }
}
</style>