<template>
  <div class="cartcontrol">
    <div class="cart-decrease" v-show="food.count>0"
         @click.stop.prevent="decreaseCart" transition="move">
      <span class="inner  icon-remove_circle_outline"></span>
    </div>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script type="text/ecmascript-6">
    import Vue from 'vue';

    export default {
        // name: "cartcontrol"
        props: {
            food: {
                type: Object
            }
        },
        created() {
            // console.log(this.food);
        },
        methods: {
            addCart() {
                // console.log('click');
                if (!this.food.count) {
                    // this.food.count = 1; // 不起作用
                    Vue.set(this.food, 'count', 1);// 为变量设置一个新的属性
                } else {
                    this.food.count++;
                }
            },
            decreaseCart() {
                if (this.food.count) {
                    this.food.count--;
                }
            }
        }
    };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size 0

    .cart-decrease
      display inline-block
      padding 6px
      transition all 0.4s linear

      /* &.move-enter-active, &.move-leave-active
        transition all 0.4s linear
        opacity 1
        transform translate3d(0, 0, 0)
        // transition  rotate(0) */

      .inner
        display inline-block
        line-height: 24px
        font-size 24px
        color rgb(0, 160, 220)

    // transition all 0.4s linear

    /* &.move-enter
    &.move-leave-to
      opacity 0
      transform translate3d(24px, 0, 0)
      .inner
        transform rotate(180deg) */

    .cart-count
      display inline-block
      vertical-align top
      width: 12px
      padding-top 6px
      line-height: 24px
      text-align center
      font-size 10px
      color rgb(147, 153, 159)

    .cart-add
      display inline-block
      line-height: 24px
      font-size 24px
      color rgb(0, 160, 220)
</style>
