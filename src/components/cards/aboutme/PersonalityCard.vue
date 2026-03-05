<script lang="ts" setup>
import INTPIMG from '@/assets/imgs/aboutme_intp.webp'

</script>

<template>
    <div class="personality">
        <div class="personality__container">
            <div class="personality-tag">
                性格
            </div>
            <div class="personality-title">
                <span>逻辑学家</span>
                <span>INTP-T</span>
            </div>
            <div class="personality-img">
                <img :src="INTPIMG" alt="">
            </div>
            <div class="personality-tip">
                <span>在</span>
                <a class="personality-link" href="https://www.16personalities.com/ch/intp-%E4%BA%BA%E6%A0%BC"> 16personalities </a>
                <span>了解更多关于 执政官</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.personality {
    height: rem(300);
    &__container {
        position: relative;
        height: 100%;
        @include mix.container-style($b: var(--border-base));
        @include mix.flex-box($d: column, $a: flex-start, $j: space-between);
        @include hov.card($t: true);
        &:hover {
            .personality-img {
                transform: rotate(15deg);
            }
        }
    }
    &-tag {
        @include mix.position-style($p: absolute, $l: rem(20), $t: rem(10));
        @include mix.font-style($s: sm, $c: var(--text-weak))
    }
    &-title {
        @include mix.flex-box($d: column, $a: flex-start, $g: lg);
        @include mix.margin-d(t, xxl);
        &>span {
            @include mix.font-style($s: title, $f: title,);
            letter-spacing: rem(3);
        }
        &>span:nth-child(2) {
            color: var(--color-primary-base);
        }
    }
    &-img {
        @include mix.size(rem(200));
        @include mix.position-style($p: absolute, $t: rem(15), $r: rem(20));
        @include anim.transition($dr: 1s);
    }
    &-tip {
        @include mix.margin-d(t, sm);
        @include mix.font-style($s: sm, $c: var(--text-weak));
    }
    &-link {
        @include anim.transition(color);
        @include hov.underline-style(-rem(3), var(--primary-base));
        @include hov.color(var(--primary-base));
    }
}

</style>