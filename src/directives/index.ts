import { vLazyImg } from "./v-lazy";
import type {App} from 'vue';


export default {
    install(app: App) {
        app.directive("lazy", vLazyImg);
    },
};