<script lang="ts" setup>
import HeroSection from '@/components/sections/HeroSection.vue';
import AboutCard from '@/components/cards/home/AboutCard.vue';
// import NoticeCard from '@/components/cards/NoticeCard.vue';
import PictureCard from '@/components/cards/home/PictureCard.vue';
import HelloCard from '@/components/cards/home/HelloCard.vue';
// import NonsenseCard from '@/components/cards/NonsenseCard.vue';
// import StatsPanel from '@/components/cards/StatsPanel.vue';
// import ArticleSection from '@/components/sections/ArticleSection.vue';
// import useDomControl from '@/utils/useDomControl';
import { useThrottleFn, useEventListener, useWindowScroll, useTimeoutFn} from '@vueuse/core'
import { onMounted, ref, watch } from 'vue'


// const {scrollToArticle,scrollToHero} = useDomControl()
const { directions } = useWindowScroll()



onMounted(async () => {
    // const throlledScroll = useThrottleFn(() => {
    //     if (directions.bottom) {
    //         if (window.scrollY < window.innerHeight) {
    //             scrollToArticle();
    //         }
    //     } else {
    //         if (window.scrollY < window.innerHeight) {
    //             scrollToHero()
    //         }
    //     }
    // },100)
    // useEventListener(window, 'scroll', throlledScroll)
})
</script>

<template>
    <div class="home">
        <TopBar ref="topBarRef"/>
        <HeroSection/>
        <div class="home__content container">
            <div class="home__intro">
                <div class="home__about">
                    <AboutCard v-reveal/>
                </div>
                <!-- <NoticeCard v-reveal/> -->
                <div class="home__picture">
                    <PictureCard/>
                </div>
                <div class="home__hello">
                    <HelloCard v-reveal/>
                </div>
                <div class="home__intro-content">
                    <!-- <NonsenseCard v-reveal/> -->
                    <!-- <StatsPanel v-reveal/> -->
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
    &__content,
    &__intro {
        @include mix.margin-d(b, lg);
    }
    &__content {
        min-height: calc(100vh - 293px);
        padding: 40px;
        @include mix.margin-d(t, 50px);
        @include mix.respond-down('sm') {
            @include mix.padding(lg);
        }
    }
    &__intro {
        @include mix.grid-box($c: 18, $g: lg, $j: center);
        @include mix.respond-down(xl){
            grid-template-columns: 1fr !important;
        };
        &-content {
            @include mix.flex-box($a:stretch, $g: lg);
            width: 100%;
            @include mix.respond-up(xl){
                grid-row: 2;
                grid-column: 10/19;
            }
        }
    }
    &__about,
    &__picture,
    &__hello {
        @include mix.size(100%, fit-content);
    }
    &__about { 
        @include mix.respond-up('xl') {
            grid-row: 1;
            grid-column: 1/9;
        }
    }
    &__picture {
        @include mix.respond-up('xl') {
            grid-row: 1;
            grid-column: 9/19;
        }
    }
    &__hello {
        @include mix.respond-up('xl'){
            grid-row: 2;
            grid-column: 1/10;
        }
    }
}
</style>