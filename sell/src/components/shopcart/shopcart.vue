<template>
  <div class="root">
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}&nbsp;元</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <div transition="drop" v-for="(ball,index) in balls" :key="index"
             v-show="ball.show" class="ball">
          <div class="inner"></div>
        </div>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <h1 class="empty" @click="empty">清空</h1>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="(food,index) in selectFoods" :key="index">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
    import cartcontrol from '../cartcontrol/cartcontrol';
    import BScroll from 'better-scroll';

    export default {
        // name: "shopcart"
        components: {
            cartcontrol
        },
        data() {
            return {
                balls: [
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    }
                ],
                fold: true
            };
        },
        props: {
            deliveryPrice: {// 驼峰式和横杠式的相互转化
                type: Number,
                default: 0
            },
            minPrice: {
                type: Number,
                default: 0
            },
            selectFoods: {
                type: Array,
                default() {
                    return [
                        {
                            price: 10,
                            count: 0
                        }
                    ];
                }
            }
        },
        computed: {
            totalPrice() {
                let total = 0;
                this.selectFoods.forEach((food) => {
                    total += food.price * food.count;
                });
                return total;
            },
            totalCount() {
                let count = 0;
                this.selectFoods.forEach((food) => {
                    count += food.count;
                });
                return count;
            },
            payDesc() {
                if (this.totalPrice === 0) {
                    return `￥${this.minPrice}元起送`;
                } else if (this.totalPrice < this.minPrice) {
                    let diff = this.minPrice - this.totalPrice;
                    return `还差￥${diff}元起送`;
                } else {
                    return '去结算';
                }
            },
            payClass() {
                if (this.totalPrice < this.minPrice) {
                    return 'not-enough';
                } else {
                    return 'enough';
                }
            },
            listShow: {
                get() { // 直接写后面的逻辑代码会报错，需要使用get和Set方法
                    if (!this.totalCount) {
                        // this.fold = true;
                        return false;
                    }
                    return !this.fold;
                }
            }
        },
        updated() {
            // console.log('121');
            if (!this.totalCount) {
                this.fold = true;
            }
            // console.log(this.fold);
            if (!this.fold) {
                // console.log('111');
                if (!this.scroll) {
                    this.$nextTick(() => {
                        this.scroll = new BScroll(this.$refs.listContent, {
                            click: true
                        });
                    });
                }
            }
        },
        methods: {
            toggleList() {
                if (!this.totalCount) {
                    return;
                }
                this.fold = !this.fold;
            },
            empty() {
                this.selectFoods.forEach((food) => {
                    food.count = 0;
                });
            },
            hideList() {
                this.fold = true;
            },
            pay() {
                if (this.totalPrice < this.minPrice) {
                    return;
                }
                window.alert(`支付${this.totalPrice}元`);
            }
        }
    };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .shopcart
    position fixed
    left: 0
    bottom: 0
    z-index 50
    width: 100%
    height: 48px

    .content
      display flex
      background #141d27
      font-size 0 // 去除元素之间的缝隙
      color: rgba(255, 255, 255, 0.4)

      .content-left
        flex 1

        .logo-wrapper
          display inline-block
          position relative
          top -10px
          margin: 0 12px
          padding 6px
          width: 56px
          height: 56px
          box-sizing border-box
          vertical-align top
          border-radius 50%
          background #141d27 // 默认为透明的，不设置这里圆圈的凸出部分看不见

          .logo
            width: 100%
            height: 100%
            border-radius 50%
            // background rgba(255, 255, 255, 0.4)
            background: #2b343c
            text-align center

            &.highlight
              background rgb(0, 160, 220)

            .icon-shopping_cart
              font-size 24px
              line-height: 44px
              color: #80858a

              &.highlight
                color #fff

          // 它的高度=父元素(logo->logo-wrapper)的高度=66-6*2

          .num
            position absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700
            color #fff
            background rgb(240, 20, 20)
            box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4)

        .price
          display inline-block
          vertical-align top
          margin-top 12px
          line-height: 24px
          padding-right 12px
          box-sizing border-box
          border-right 1px solid rgba(255, 255, 255, 0.1)
          font-size 16px
          font-weight 700

          &.highlight
            color #fff

        // color rgba(255, 255, 255, 0.4)

        .desc
          display inline-block
          vertical-align top
          margin 12px 0 0 12px
          line-height: 24px
          // color: rgba(255, 255, 255, 0.4)
          font-size 12px

      .content-right
        flex 0 0 105px
        width: 105px

        .pay
          height: 48px
          line-height: 48px
          text-align center
          font-size 14px
          font-weight 700
          // background: #2b343c

          &.not-enough
            background #2b343b

          &.enough
            background #00b43c
            color #fff

    .ball-container
      .ball
        position fixed
        left: 32px
        bottom 22px
        z-index 200

        &.drop-transition
          transition all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)

          .inner
            width: 16px
            height: 16px
            border-radius 50%
            background rgb(0, 160, 220)
            transition all 0.4s linear

    .shopcart-list
      position absolute
      top: 0
      left: 0
      z-index -1
      width: 100%
      transition all .5s
      transform translate3d(0, -100%, 0)

      // &.fold-enter-active
      // &.fold-leave-active
      // transition all 0.5s

      // transform translate3d(0, -100%, 0)

      &.fold-enter
      &.fold-leave-to
        transform translate3d(0, 0, 0)

      .list-header
        height: 40px
        line-height: 40px
        padding 0 18px
        background #f3f5f7
        border-bottom rgba(7, 17, 27, 0.1)

        .title
          float left
          font-size 14px
          color rgb(7, 17, 27)

        .empty
          float: right;
          font-size 12px
          color rgb(0, 160, 220)

      .list-content
        padding 0 18px
        max-height 217px
        overflow hidden
        background #fff

        .food
          position relative
          padding 12px 0
          box-sizing border-box
          border-1px(rgba(7, 17, 27, 0.1))

          .name
            line-height: 24px
            font-size 14px
            color rgb(7, 17, 27)

          .price
            position absolute
            right 90px
            bottom 12px
            line-height: 24px
            font-size 14px
            font-weight 700
            color rgb(240, 20, 20)

          .cartcontrol-wrapper
            position absolute
            right: 0
            bottom: 6px

  .list-mask
    position fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index 40
    backdrop-filter blur(10px)
    opacity 1
    background rgba(7, 17, 27, 0.6)
    transition all 0.5s

  // 让iphone手机可以看见模糊效果
  // &.fade-enter-active, &.fade-leave-active
  // transition all 0.5s
  // opacity 1
  // background rgba(7, 17, 27, 0.6)

  &.fade-enter, &.fade-leave-to
    opacity 0
    background rgba(7, 17, 27, 0)
</style>
