import { LazyDirective } from "./v-lazy";
import { rippleDirective } from './v-ripple'
import type {App} from 'vue';


export default {
    install(app: App) {
        app.directive("lazy", LazyDirective);
        app.directive("ripple", rippleDirective);
    },
};