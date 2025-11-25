<!-- <script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import NotFoundImg from '@/assets/images/notfound.gif'
import { storeToRefs } from 'pinia';
import { usePostStore } from '@/stores/usePostStore';
import { showMessage } from '@/components/message/message';


/** ---------- 状态管理 ---------- */
const postStore = usePostStore();
const { recentLoading } = storeToRefs(postStore)
const { getRecentPosts } = postStore;
const recentPosts = ref([]);


/** ---------- 页面文案内容 ---------- */
const notFoundField = reactive({
    title: 'NOT FOUND',
    desc: '你访问的内容似乎已经不在这里了，也许被移走了，也可能从未出现过。要不要试试回到首页？',
})

onMounted( async () => {
    try {
        const res = await getRecentPosts();
        recentPosts.value = res;

    } catch (error) {
        showMessage({
            type: 'error',
            content: error.message,
        });
    }
})
</script>

<template>
    <Topbar/>
    <div class="notfound">
        <div class="notfound__container">
            <div class="notfound__header">
                <PageHeader :field="notFoundField"/>
                <div class="notfound__header-btn">
                    <Icon name="rocket"/>
                    <span>返回首页</span>
                </div>
            </div>
            <div class="notfound__body">
                <div class="notfound__wrapper">
                    <div class="notfound__card">
                        <div class="notfound__card-img">
                            <img 
                                v-lazy-img="{ src: NotFoundImg }"
                                alt="notfound"
                            />
                        </div>
                        <div class="notfound__card-content">
                            <h2 class="notfound__card-title">404</h2>
                            <p class="notfound__card-detail">未查询到任何可展示的数据。请检查你的访问路径或尝试重新加载页面。</p>
                            <div class="notfound__card-btn">
                                <Icon name="rocket"/>
                                <span>返回首页</span>
                            </div>
                        </div>
                    </div>
                    <div class="recent-post">
                        <div 
                            class="post-card" 
                            v-for="post, index in recentPosts" 
                            :key="index"
                        >
                            <div>
                                <div 
                                    v-lazy-img="{
                                        src: post.coverPath
                                    }" 
                                    alt="文章图片"
                                    class="post-card-cover"
                                />
                            </div>
                            <div class="post-card-title">{{ post.title }}</div>
                            <p class="post-card-date"></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="notfound__footer">
                <Footer/>
            </div>
        </div>
    </div>
    <RightSideBar/>
</template>

<style lang="scss" scoped>
.recent-post {
    @include mix.container-style($b: var(--border-base));
    @include anim.card-hover;
    @include mix.grid-box($c: 2, $g: xl);
}
.post-card {
    @include mix.flex-box($j: flex-start, $w: nowrap, $g: lg);
    &-cover {
        flex: 2;
        height: 60px;
        @include mix.object;
        overflow: hidden;
        transform: translateZ(0);
        @include mix.radius(lg);
        @include mix.size(100px);
    }
}
.notfound {
    &__container,
    &__header,
    &__body,
    &__footer {
        width: 100%;
    }
    &__header {
        position: relative;
        &-btn {
            @include mix.position-style($p: absolute, $b: 80px, $r: 50px);
            @include mix.container-style(
                $p: sm md, $r: sm,
                $bg: var(--white-base),
            );
            @include mix.flex-box($g: xs);
            cursor: pointer;
            backdrop-filter: blur(15px);
            @include mix.font-style($c: var(--primary-base));
            letter-spacing: 3px;
            @include anim.button-hover;
            &>span {
                @include mix.underline-style($bt: -3px);
            }
        }
    }
    &__body {
        min-height: calc(100vh - 520px);
        @include mix.margin-d(t, 20px);
        @include mix.flex-box;
    }
    &__wrapper {
        width: 800px;
        @include mix.flex-box($d: column, $g: xl);
    }
    &__card {
        @include mix.flex-box($g: xxl);
        @include mix.container-style($p: lg xl,$b: var(--border-base));
        @include anim.card-hover;
        @include mix.respond-down(md) {
            flex-direction: column;
        }
        &-img {
            height: 100%;
            @include mix.size(350px);
            @include mix.radius(sm);
            border: var(--border-base);
            overflow: hidden;
        }
        &-content {
            height: 100%;
            @include mix.flex-box($d: column, $g: lg);
        }
        &-title {
            @include mix.font-style($s: logo, $f: 'accent', $c: var(--primary-base));
        }
        &-detail {
            width: 300px;
        }
        &-btn {
            @include mix.container-style($bg: var(--primary-base), $r: sm);
            @include mix.flex-box($g: xs);
            color: var(--white-base);
            cursor: pointer;
            @include anim.button-hover;
            &>span{
                @include mix.underline-style($bt: -1px, $bg: var(--white-base));
            }
        }
    }
}
</style> -->