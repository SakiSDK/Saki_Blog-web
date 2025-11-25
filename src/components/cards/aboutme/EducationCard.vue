<script lang="ts" setup>

</script>

<template>
    <div class="education">
        <div class="education__container">
            <a class="education-school">
                <p class="education-school-tag tag">
                    毕业院校
                </p>
                <div class="education-school-content content">
                    湖南工程学院
                </div>
            </a>
            <div class="education-major">
                <p class="education-major-tag tag">
                    专业
                </p>
                <div class="education-major-content content">
                    软件工程
                </div>
            </div>
            <div class="education-direction">
                <p class="education-direction-tag tag">
                    主修方向
                </p>
                <div class="education-direction-content content">
                    前端开发
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.tag {
    @include mix.font-style($s: sm, $c: var(--text-subtle));
    @include mix.margin-d(b, lg);
}
.content {
    @include mix.font-style($s: title, $f: 'title', $c: var(--text-subtle));
}
.education {
    height: 320px;
    &__container {
        @extend %aboutme-container;
        @include mix.flex-box($d: column, $j: flex-start, $a: flex-start);
    }
    &-school {
        @include mix.margin-d(b, lg);
        @include hov.underline-style($bg: var(--blue-base));
        &-content {
            color: var(--blue-base);
        }
    }
    &-major {
        @include mix.margin-d(b, lg);
        @include hov.underline-style($bg: var(--red-base));
        &-content {
            color: var(--red-base);
        }
    }
    &-direction {
        @include mix.margin-d(b, lg);
        @include hov.underline-style($bg: var(--yellow-base));
        &-content {
            color: var(--yellow-base);
        }
    }
}
</style>