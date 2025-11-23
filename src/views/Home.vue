<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref, watch } from 'vue';

const { t } = useI18n();

</script>

<template>
    <TopBar/>
    <div class="home">
        <div class="home__container">
            <div class="home__header">
                {{ t('test') }}
            </div>
            <FooterBar/>
        </div>
    </div>
    <RightBar/>
</template>

<style lang="scss" scoped>
.home {

}
</style>