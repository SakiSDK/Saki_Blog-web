<script lang="ts" setup>
// import useDateFormat from '@/utils/useDateFormat';

interface RecentPost {
    shortId: string,
    title: string,
    coverPath: string,
    createdAt: string,
}


/** ---------- props数据传递 ---------- */
const props = defineProps<{ 
    posts: RecentPost[],
}>()


/** ---------- 状态管理 ---------- */
// const postStore = usePostStore()
// const { getPostDetail } = postStore;
// const { goTo } = useAppRouter();
// const {formatDate} = useDateFormat()


/** ---------- 页面文案内容 ---------- */
const pageContent: Record<string, string> = {
    title: '最近文章',
    detail: '最近发布的文章',
    iconName: 'recent',
}


/** ---------- 页面跳转 ---------- */
const goToPostDetail = async (shortId: string) => {
    // await getPostDetail(shortId);
    // goTo(`/post/${shortId}`)
}
</script>

<template>
    <div class="recent">
        <div class="recent__container">
            <CardHeader
                :iconName="pageContent.iconName"
                :title="pageContent.title"
                :detail="pageContent.detail"
            />
            <div 
                class="recent__post" 
                v-for="(post, index) in posts" 
                :key="index"
            >
                <div 
                    class="recent__post__wrapper" 
                    @click="goToPostDetail(post.shortId)"
                >
                    <div 
                        class="recent__post-cover"
                    >
                        <img v-lazy-img="post.coverPath" alt="">
                    </div>
                    <div class="recent__post__content">
                        <div class="recent__post-title">{{ post.title }}</div>
                        <!-- <div class="recent__post-title">{{ formatDate(post.createdAt) }}</div> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.recent {
    width: 100%;
    &__container {
        @extend %full-size;
        @extend %box-style;
        @include anim.card-hover;
    }
    &__post {
        @include mix.radius(lg);
        @include anim.transition;
        @include anim.bgcolor(var(--color-primary-base));
        @include anim.font-color(var(--text-inverse));
        cursor: pointer;
        &__wrapper {
            @include mix.flex-box($j: flex-start, $w: nowrap, $g: lg);
            @include mix.margin-d(t, sm);
            @include mix.padding(sm);
        }
        &-cover {
            @include mix.size(60px);
            transform: translateZ(0);
            @include mix.radius(lg);
            overflow: hidden;
            &>img {
                @include mix.object;
                overflow: hidden;
                @include mix.size(60px);
                transform: translateZ(0);
            }
        }
        &-title {
            flex: 6;
            @include mix.text-ellipsis(2);
            white-space: wrap;
        }
    }
}

</style>