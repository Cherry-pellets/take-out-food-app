import Vue from 'vue';
import Router from 'vue-router';
import goods from '../components/goods/goods';
import seller from '../components/seller/seller';
import ratings from '../components/ratings/ratings';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'goods',
      component: goods
    },
    {
      path: '/seller',
      name: 'seller',
      component: seller
    },
    {
      path: '/goods',
      name: 'goods',
      component: goods
    },
    {
      path: '/ratings',
      name: 'ratings',
      component: ratings
    }
  ],
  linkActiveClass: 'active' // 点击导航栏某一项时，颜色发生改变
});
