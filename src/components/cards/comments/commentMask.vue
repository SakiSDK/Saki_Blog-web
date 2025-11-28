<script lang="ts" setup>

</script>

<template>
    <div class="comment-mask">
        <div class="comment-mask__container">
            <span class="comment-mask-icon">
                <Icon name="password"/>
            </span>
            <h4 class="comment-mask-title">需要登录才能评论</h4>
            <p class="comment-mask-detail">登录后即可发表观点、与其他用户互动</p>
            <button class="comment-mask-login">
                登录
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.comment-mask {
    container: card / size;
    height: 100%;
    @include mix.position($type: absolute, $z: base);
    @include mix.font-style($c: var(--text-base), $s: md);
    background-color: var(--surface-ghost);
    inset: 0;
    backdrop-filter: blur(2px);
    cursor: pointer;
    @include util.container-h-down(1200px){
        background-color: red !important;
    }
    @include util.container-h-up(1200px){
        background-color: red !important;
    }
    &__container {
        @include mix.size(100%);
        @include mix.flex-box($d: column, $g: lg);
        @include util.container-h-down(1200px){
            background-color: red !important;
        }
    }
    &-icon {
        @include mix.flex-box;
        @include mix.container-style($p: md, $r: md, $bg: var(--color-primary-ghost));
        @include mix.font-style($c: var(--color-primary-base), $s: title);
    }
    &-login {
        @include mix.container-style($p: sm xxl, $bg: var(--color-primary-base), $r: sm);
        @include mix.margin-d(t, sm);
        @include anim.transition;
        @include anim.translateY(-2px, none);
        @include anim.bgcolor(var(--color-primary-strong));
        @include mix.font-style($c: var(--color-white-base), $s: lg);
    }
    &-title {
        @include mix.font-size(xl);
    }
    &-detail {
        @include mix.font-style($c: var(--text-subtle), $s: sm);
    }
}
</style>