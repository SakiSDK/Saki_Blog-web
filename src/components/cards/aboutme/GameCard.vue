<script lang="ts" setup>
import BlackMythWukongImg from '@/assets/imgs/game_BlackMythWukong.webp'
import StellarBladeImg from '@/assets/imgs/game_stellarblade.webp'
import Expedition33Img from '@/assets/imgs/game_Expedition33.webp'
import LittleNightmareImg from '@/assets/imgs/game_LittleNightmare.webp'
import EldenRingImg from '@/assets/imgs/game_EldenRing.webp';
import { createI18nUtil } from '@/utils/i18n.util';


interface CardBaseInfo {
  tag: string;
  title: string;
}

interface GameCardField {
  name: string;
  webSite: string;
  image: string;
}

const { tWithPrefix } = createI18nUtil();
const gameT = tWithPrefix('aboutme.gameCard');
const gameItems = tWithPrefix('aboutme.gameCard.items');
const gameCardInfo: CardBaseInfo = {
  title: gameT('title'),
  tag: gameT('tag'),
}
const gameFields: GameCardField[] = [
  {
    image: BlackMythWukongImg,
    name: gameItems('blackMythWuKong.name'),
    webSite: gameItems('blackMythWuKong.link'),
  },
  {
    image: StellarBladeImg,
    name: gameItems('stellarBlade.name'),
    webSite: gameItems('stellarBlade.link'),
  },
  {
    image: Expedition33Img,
    name: gameItems('expedition33.name'),
    webSite: gameItems('expedition33.link'),
  },
  {
    image: LittleNightmareImg,
    name: gameItems('littleNightmare.name'),
    webSite: gameItems('littleNightmare.link'),
  },
  {
    image: EldenRingImg,
    name: gameItems('eldenRing.name'),
    webSite: gameItems('eldenRing.link'),
  },
]
</script>

<template>
  <div class="game">
    <div class="game__container">
      <div class="game-tag">{{ gameCardInfo.tag }}</div>
      <div class="game-title">{{ gameCardInfo.title }}</div>
      <div class="game__content">
        <div class="game__wrapper">
          <a
            class="game-link"
            v-for="game, index in gameFields"
            :key="index"
            :href="game.webSite"
            target="_blank"
          >
            <div class="game-item">
              <img class="game-img" v-lazy="{
                src: game.image
              }" :alt="game.name"/>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.game {
  position: relative;
  height: rem(340);
  &__container {
    @extend %aboutme-container;
  }
  &-tag {
    @extend %aboutme-tag;
    @include mix.font-style($c: var(--white-subtler));
  }
  &-title {
    @extend %aboutme-title;
  }
  &__content {
    height: 100%;
  }

  &__wrapper {
    @extend %flex-center;
    @include mix.position-style($p: absolute, $t: 0, $l: -10%);
    @include mix.size(120%, 100%);
  }
  &-link {
    @include mix.size(20%, 100%);
    position: relative;
    overflow: hidden;
    background-color: var(--black-base);
    // 修复边缘锯齿
    backface-visibility: hidden;
    outline: 1px solid transparent; 
    transition: width 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    will-change: width;
    
    // Hover effect
    &:hover {
      width: 44%;
      .game-img {
        transform: scale(1.1);
        filter: brightness(1.1);
      }
    }
  }

  &-item {
    @include mix.position-style($p: absolute, $l: 0);
    @include mix.size(100%);
  }

  &-img {
    @extend %img-cover;
    // 修复边缘锯齿
    backface-visibility: hidden;
    outline: 1px solid transparent;
    transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), filter 0.6s ease;
    will-change: transform;
  }
}
</style>