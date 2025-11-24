<!-- <script lang="ts" setup>
import WuKongImg from '@/assets/images/games/BlackMythWuKong.webp'
import StarBladeImg from '@/assets/images/games/StellaBlade.webp'
import ExpeditionImg from '@/assets/images/games/Expedition33.webp'
import NightmareImg from '@/assets/images/games/LittleNightmare.webp'
import EldenRingImg from '@/assets/images/games/EldenRing.webp'


const gameFields = [
  {
    img: WuKongImg,
    text: 'BlackMythWuKong',
    officialWebsite: 'https://www.heishenhua.com',
    chineseName: '黑神话：悟空'
  },
  {
    img: StarBladeImg,
    text: 'StarBlade',
    officialWebsite: 'https://www.stellarblade.com',
    chineseName: '剑星'
  },
  {
    img: ExpeditionImg,
    text: 'Expedition33',
    officialWebsite: 'https://www.expeditionsgame.com',
    chineseName: '33号远征队'
  },
  {
    img: NightmareImg,
    text: 'LittleNightmare',
    officialWebsite: 'https://www.bandainamcoent.com/games/little-nightmares',
    chineseName: '小小梦魇'
  },
  {
    img: EldenRingImg,
    text: 'EldenRing',
    officialWebsite: 'https://www.eldenring.com',
    chineseName: '艾尔登法环'
  },
]
</script>

<template>
  <div class="game">
    <div class="game-tag">喜欢的游戏</div>
    <div class="game-title">游戏</div>
    <div class="game__content">
      <div class="game__wrapper">
        <a
          class="game-link"
          v-for="game, index in gameFields"
          :key="index"
          :href="game.officialWebsite"
        >
          <div class="game-item">
            <img
              :src="game.img"
              :alt="game.chineseName"
            >
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.game {
  position: relative;
  height: 200px;
  @include mix.container-style($p: 0,
    $b: var(--border-base),
    $o: hidden,
  );

  &-tag {
    @include mix.position-style(absolute, $l: 20px, $t: 10px, $z: base);
    @include mix.font-style($s: xs, $c: var(--text-weak))
  }

  &-title {
    @include mix.position-style(absolute, $l: 20px, $t: 40px, $z: base);
    @include mix.font-style($s: xxl);
  }

  &__content {
    height: 100%;
  }

  &__wrapper {
    @include mix.position-style(absolute, $t: 0, $l: -10%);
    width: 120%;
    height: 100%;
    @include mix.flex-box;
  }

  &-link {
    position: relative;
    width: 20%;
    height: 100%;
    overflow: hidden;
    transform: skew(-10deg);
    @include anim.transition($duration: 1s);

    &:hover {
      width: 44%;

      .game-item {
        transform: skew(10deg) scale(1.3);
      }
    }
  }

  &-item {
    @include mix.position-style(absolute, $t: 0, $l: -20px);
    width: 200px;
    height: 100%;
    object-fit: cover;
    transform: skew(10deg);
    @include anim.transition($duration: 1s);

    &>img {
      @extend %full-size;
      @include mix.object(center, cover);
    }
  }
}
</style> -->