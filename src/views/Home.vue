<script lang="ts" setup>
import HeroSection from '@/components/sections/HeroSection.vue';
import AboutCard from '@/components/cards/home/AboutCard.vue';
import PictureCard from '@/components/cards/home/PictureCard.vue';
import HelloCard from '@/components/cards/home/HelloCard.vue';
import Annuncement from '@/components/cards/home/Annuncement.vue';
import SocialFooter from '@/components/cards/home/SocialFooter.vue';
import ArticleSection from '@/components/sections/ArticleSection.vue';
import { useDomUtil } from '@/utils/dom.util';
import { useThrottleFn, useEventListener, useWindowScroll} from '@vueuse/core'
import { onMounted, ref } from 'vue'
import BlessingCard from '@/components/cards/home/BlessingCard.vue';



const { scrollToNextView, scrollToTop } = useDomUtil();
onMounted(async () => {
    const { directions } = useWindowScroll()
    const throlledScroll = useThrottleFn(() => {
        if (directions.bottom) {
            if (window.scrollY < window.innerHeight) {
                scrollToNextView();
            }
        } else {
            if (window.scrollY < window.innerHeight) {
                scrollToTop()
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
                <div class="home-aboutme" v-reveal>
                    <AboutCard/>
                </div>
                <div class="home-picture" v-reveal>
                    <PictureCard/>
                </div>
                <div class="home-hello" v-reveal>
                    <HelloCard/>
                </div>
                <div class="home-blessing" v-reveal>
                    <BlessingCard/>
                </div>
                <div class="home-announcement" v-reveal>
                    <Annuncement/>
                </div>
            </div>
            <div class="home__article">
                <ArticleSection/>
            </div>
            <div class="home__info-line">
                <SocialFooter/>
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
        @include mix.padding(title);
        @include mix.margin-d(t, 50px);
        @include mix.respond-down(xxs){
            padding: 0;
        }
    }
    &__wrapper {
        width: 100%;
        @include mix.grid-box($c: 18, $g: lg);
        @include mix.respond-down(md){
            display: block;
            grid-template-columns: none !important;
            @include mix.flex-box($d: column, $g: lg);
        };
    }
    &-aboutme,
    &-picture,
    &-hello,
    &-group, 
    &-announcement,
    &-blessing,
    &-article {
        @extend %full-width;
        // width: 200px;
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
    &-blessing {
        @include mix.respond-up(md) {
            grid-row: 2;
            grid-column: 10 / 19;
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