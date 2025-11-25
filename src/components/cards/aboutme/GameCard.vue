<script lang="ts" setup>
import BlackMythWukongImg from '@/assets/imgs/game_BlackMythWukong.webp'
import StellarBladeImg from '@/assets/imgs/game_stellarblade.webp'
import Expedition33Img from '@/assets/imgs/game_Expedition33.webp'
import LittleNightmareImg from '@/assets/imgs/game_LittleNightmare.webp'
import EldenRingImg from '@/assets/imgs/game_EldenRing.webp';
import { createI18nUtil } from '@/utils/i18n.util';
import type { CardBaseInfo, GameCardField } from '@/types/components/Aboutme';


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
    webSite: gameItems('blackMythWuKong.webSite'),
  },
  {
    image: StellarBladeImg,
    name: gameItems('stellarBlade.name'),
    webSite: gameItems('stellarBlade.webSite'),
  },
  {
    image: Expedition33Img,
    name: gameItems('expedition33.name'),
    webSite: gameItems('expedition33.webSite'),
  },
  {
    image: LittleNightmareImg,
    name: gameItems('littleNightmare.name'),
    webSite: gameItems('littleNightmare.webSite'),
  },
  {
    image: EldenRingImg,
    name: gameItems('eldenRing.name'),
    webSite: gameItems('eldenRing.webSite'),
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
          >
            <div class="game-item" v-lazy="{
              src: game.image
            }">
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
  height: 340px;
  &__container {
    @extend %aboutme-container;
  }
  &-tag {
    @extend %aboutme-tag;
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
    transform: skew(-10deg);
    background-color: var(--black-base);
    @include anim.transition($dr: 1s);
    &:hover {
      width: 44%;
      .game-item {
        transform: skew(10deg) scale(1.3);
      }
    }
  }

  &-item {
    @include mix.position-style($p: absolute, $t: 0, $l: -20px);
    @include mix.size(300px, 100%);
    transform: skew(10deg) translateX(-40px);
    @include anim.transition($p: with transform, $dr: 1s);
    background-position: center;
    background-color: var(--black-base);
  }
}
</style>