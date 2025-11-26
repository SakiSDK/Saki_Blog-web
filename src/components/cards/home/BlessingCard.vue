<script lang="ts" setup>
import { ref } from 'vue';
import { useToggle } from '@vueuse/core';
import { useDomUtil } from '@/utils/dom.util';
import CardHeader from '@/components/bases/CardHeader.vue';

/** ---------- 卡片翻转 ---------- */
const rotateDeg = ref(0);

const rotate = () => {
  rotateDeg.value += 180; // 每次点击累加 180 度
  // 每次翻转切换祝福语
  nextWord();
  toggleFront();
};

/** ---------- 卡片状态 ---------- */
const [isFront, toggleFront] = useToggle(true);

const blessingMessages: string[] = [
  "愿你前路浩浩荡荡，既有披荆斩棘的勇气，也有踏月而行的从容，眼中永远闪烁着对生活的热爱，心中始终怀揣着未凉的理想与光。",
  "愿所有温柔与好运，都像春天的细雨般悄然而至，浸润你生活的每一个角落，让奔波的日子有回甘，让平凡的瞬间藏惊喜。",
  "愿你所求皆如愿，所行皆坦途，所遇皆温暖；愿你在人生的旅途中，既有并肩同行的伙伴，也有独自行走的底气，每一步都走得坚定而踏实。",
  "愿你被世界温柔以待，被岁月格外偏爱；愿你历经风雨后依然心存柔软，尝过世间冷暖后仍能保持纯粹，往后余生，平安喜乐，万事顺意。",
  "愿你永远被温暖包围，被善意簇拥；愿寒夜有灯，雨天有伞，孤独有伴，迷茫有方向，每一个疲惫的时刻都能找到栖息的港湾。",
  "愿你所遇皆良人，所想皆成真，所念皆有回响；愿你在漫长的岁月里，有人懂你的言外之意，疼你的小心翼翼，护你周全，伴你朝夕。",
  "愿你一生努力，一生被爱，想要的都拥有，得不到的都释怀；愿你既能朝九晚五安稳度日，也能偶尔奔赴远方，见识世界的广阔与精彩。",
  "愿你的每一天都比前一天更快乐，每一段旅程都比上一段更丰盈；愿你能在平凡的生活中发现小确幸，在琐碎的日子里收获小美好，日日是好日，岁岁皆安然。",
  "愿你心中有梦，眼里有光，脚下有路；愿你不畏前路漫漫，不惧风雨兼程，始终保持对未来的憧憬，在自己的节奏里慢慢成长，闪闪发光。",
  "愿生活永远善待努力的你，让你的坚持有所回报，付出有所收获；愿你在追逐目标的路上不慌不忙，在应对挑战时从容不迫，终能活成自己喜欢的模样。",
  "愿你平安顺遂，喜乐无忧，无灾无难，无病无扰；愿你三餐四季有温度，柴米油盐有诗意，家人安康，朋友常伴，岁月静好，现世安稳。",
  "愿你所期待的未来如期而来，所向往的生活逐步靠近；愿你既能坚守初心，也能灵活变通，在时光的洪流中不迷失方向，在人生的舞台上绽放光彩。",
  "愿你保持热爱，奔赴山海，永远对世界充满好奇，永远对生活抱有热忱；愿你能去想去的地方，见想见的人，做想做的事，不负韶华，不负自己。",
  "愿你拥有选择的自由和被选择的幸运，既能勇敢追求心中所想，也能坦然接受命运的馈赠；愿你在人生的十字路口，总能做出不留遗憾的决定，活出独一无二的精彩。",
  "愿你所到之处皆为热土，所遇之人皆为挚友；愿你在陌生的城市有归属感，在熟悉的环境有新鲜感，每一次出发都有意义，每一次停留都有温暖。",
  "愿你被温柔环抱，被幸运眷顾，被爱意包围；愿你难过时有人安慰，疲惫时有人依靠，迷茫时有人指引，往后的每一天都被幸福填满，被美好环绕。",
  "愿所有美好不期而遇，所有温柔恰逢其时；愿你在不经意间收获惊喜，在平凡日子里遇见感动，生活有滋有味，日子有声有色，岁月安然无恙。",
  "愿你不负当下，不畏将来，不念过往；愿你能坦然面对过去的遗憾，勇敢拥抱未来的未知，珍惜当下的每一分每一秒，活在当下，享受当下。",
  "愿你的心永远柔软而坚强，既能共情他人的不易，也能抵御生活的磨砺；愿你在经历世事变迁后依然保持善良，在遭遇挫折打击后依然选择坚强。",
  "愿你眉眼如初，风雨如愿，历经沧桑仍少年；愿你无论走多远，都不忘来时路，无论过多久，都保持初心不改，笑容依旧灿烂，眼神依旧清澈。",
  "愿你余生安好，不必再奔波劳碌，不必再为琐事烦忧；愿你有良辰美景可赏，有闲情逸致可享，有挚爱之人相伴，生活恬淡舒适，岁月安然静好。",
  "愿你被爱包围，也有爱可回赠；愿你既能感受到他人的温暖，也能成为别人的光，用爱传递爱，用温暖治愈温暖，让世界因你而更美好。",
  "愿你眼里有故事，心里有晴空，脸上有笑容；愿你历经世事而不世故，见过黑暗仍相信光明，在复杂的世界里保持简单，在浮躁的社会中保持沉静。",
  "愿你身边总有温暖的陪伴，心中总有坚定的信念；愿你在孤独时不孤单，在迷茫时不彷徨，在失落时不绝望，始终有力量前行，有勇气追梦。",
  "愿你每一步都踏得笃定而从容，每一个选择都做得无悔而坚定；愿你在人生的道路上，既有“直挂云帆济沧海”的豪情，也有“行到水穷处，坐看云起时”的淡然。"
];

const groupCount: number = 2;
const groupSize: number = Math.ceil(blessingMessages.length / groupCount);
const frontList: string[] = blessingMessages.slice(0, groupSize);
const backList: string[] = blessingMessages.slice(groupSize);
const currentFrontIndex = ref<number>(0);
const currentBackIndex = ref<number>(0);

/** ----------- 切换祝福语 ----------- */
const nextWord = () => {
  if (isFront.value) {
    currentFrontIndex.value = (currentFrontIndex.value + 1) % frontList.length;
  }
  currentBackIndex.value = (currentBackIndex.value + 1) % backList.length;
};

const { brightColorByHash } = useDomUtil();
</script>

<template>
  <div 
    class="blessing" 
    @click="rotate" 
  >
      <div 
        class="blessing__container" 
        :style="{
          '--rotateDeg': `${rotateDeg}deg`,
          '--blessingBgColor': `${brightColorByHash({
            key: isFront?frontList[currentFrontIndex]:backList[currentBackIndex],
          })}`
        }"
      >
        <div class="blessing__front">
          <div class="blessing__wrapper">
            <CardHeader icon="praise" title="祝福卡片"/>
            <div class="blessing__content">
              {{ frontList[currentFrontIndex] }}
            </div>
          </div>
        </div>
        <div class="blessing__back">
          <div class="blessing__wrapper">
            <CardHeader icon="praise" title="祝福卡片"/>
            <div class="blessing__content">
              {{ backList[currentBackIndex] }}
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<style lang="scss" scoped>
.blessing {
  perspective: 1000px;
  height: 255px;
  &__container {
    position: relative;
    @include mix.size(100%);
    @include anim.transition($p: border-color transform, $dr: slower);
    transform: rotateY(var(--rotateDeg));
    transform-style: preserve-3d;
    &:hover {
      .blessing__front,
      .blessing__back {
        border-color: var(--primary-base);
      }
    }
  }
  &__wrapper {
    @include mix.size(100%);
  }
  &__front, &__back {
    @include mix.size(100%);
    @include mix.position-style($p: absolute, $t: 0, $l: 0);
    @include mix.container-style($p: 0, $b: var(--border-base));
    backface-visibility: hidden; // ⭐ 必须要有，控制是否显示“背面”
    @include mix.flex-box($d: column, $a: flex-start, $j: flex-start);
    @include anim.transition($p: border-color);
  }
  &__back {
    transform: rotateY(180deg); // ⭐ 反面要“倒过来”
  }
  &__content {
    @include mix.container-style($p: lg);
    @include mix.font-style($s: xl, $f: title);
    @include mix.respond-down(xxs){
      @include mix.font-size(md);
    }
    line-height: 1.7;
  }
}
</style>