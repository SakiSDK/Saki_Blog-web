import Home from '../views/Home.vue';
import Aboutme from '../views/Aboutme.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/aboutme',
    name: 'Aboutme',
    component: Aboutme
  },
]

export default routes;