import { LazyDirective } from "./v-lazy";
import { rippleDirective } from './v-ripple'
import revealDirective from './v-reveal'
import type {App} from 'vue';


export default {
    install(app: App) {
        app.directive("lazy", LazyDirective);
        app.directive("ripple", rippleDirective);
        app.directive('reveal', revealDirective);
    },
};