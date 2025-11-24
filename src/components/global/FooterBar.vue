<script lang="ts" setup>
import { shallowRef } from 'vue'

defineOptions({
  name: 'FooterBar',
})

const toolFields = shallowRef([
    { href: '', content: '字体网站' },
    { href: '', content: 'SVG图库' },
    { href: '', content: 'iconfont图标库' },
    { href: '', content: '图库' },
    { href: '', content: 'USEVUE' },
    { href: '', content: 'VueTippy' },
    { href: '', content: 'CSS样式演示' },
    { href: '', content: 'Element Plus' },
    { href: '', content: '格式转换' },
])

</script>

<template>
    <div class="footer" v-reveal="'top'">
        <div class="footer__content">
            <div class="footer__left">
                <h3 class="footer__left-maxim">格言<img alt="💡" draggable="false" 
                    src="https://abs-0.twimg.com/emoji/v2/svg/1f4a1.svg" 
                    title="电灯泡">
                </h3>
                <p>以博客为灯塔，照亮求知的道路，激励每一个追梦的灵魂；在这里，知识与情感交织，经验与梦想共舞，
                    探索未知的边界，点燃生活的热情；愿每一位读者在此找到共鸣，汲取力量，携手迈向更广阔的未来
                </p>
            </div>
            <div class="footer__mid">
                <h3 class="footer__mid-title">工具🚗</h3>
                <div class="footer__mid-content">
                    <a 
                        v-for="tool,index in toolFields" :key="index"
                        :href="tool.href"
                    >
                        <span>{{ tool.content }}</span>
                    </a>
                </div>
            </div>
            <div class="footer__right">
                <h3 class="footer__right-title">友链🎈</h3>
            </div>
        </div>
        <div class="footer__info">
            <div class="footer__info-copyright">
                <span>©2024 SakiSDK</span>
            </div>
            <div class="footer__info-links"> 
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

%respond-text-center {
    @include mix.respond-down('xl'){
        text-align: center;
    }
}
.footer {
    width: 100%;
    @include mix.container-style($p: lg 0, $bg: var(--surface-base));
    transform: translateZ(0);
    &__content {
        @include mix.flex-box($j: space-around,$a: stretch, $g: lg);
        @include mix.respond-down('xl'){
            @include mix.flex-box(column,start,center);
            @include mix.margin(0 sm);
        }
        @include mix.respond-up('xl') {
            margin: 0 230px;
        }
    }
    &__left {
        flex: 1;
        @include mix.padding(lg);
        max-width: 375px;
        color: var(--text-weak);
        &-maxim {
            width: 100%;
            @include mix.margin-d(b, sm);
            img {
                @include mix.size(20px);
            }
            @extend %respond-text-center;
        }
        p {
            text-align: justify;
        }
    }
    &__mid {
        flex: 1;
        @include mix.padding(lg);
        max-width: 375px;
        height: auto;
        &-title {
            @include mix.margin-d(b, sm);
            @extend %respond-text-center;
        }
        &-content {
            @include mix.grid-box(2, 0, xs, xxl);
            a {
                display: inline-block;
                color: var(--text-weak);
                @include anim.transition(color);
                @include hov.color(var(--primary-base));
            }
        }
    }
    &__right {
        flex: 1;
        @include mix.padding(lg);
        max-width: 375px;
        height: auto;
        &-title {
            @extend %respond-text-center;
        }
    }
    &__info {
        width: 100%;
        &-copyright {
            width: 100%;
            text-align: center;
        }
    }
}

</style>