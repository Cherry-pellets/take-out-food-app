<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div @click="addFirst" class="buy" v-show="!food.count||food.count===0">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info">
          <h1 class="title">商品信息</h1>
          <p class="text" v-show="food.info">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect :selectType="selectType" :onlyContent="onlyContent"
                        :desc="desc" :ratings="food.ratings" @ratingtype-select="ratingtype_select"
                        @content-toggle="content_toggle"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-for="(rating,index) in food.ratings" :key="index"
                  v-show="needShow(rating.rateType,rating.text)" class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" :src="rating.avatar" width="12" height="12">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType===0,
                      'icon-thumb_down':rating.rateType===1}">{{rating.text}}</span>
                </p>
              </li>
            </ul>
            <div class="no-ratings" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import cartcontrol from '../cartcontrol/cartcontrol';
    import Vue from 'vue';
    import split from '../split/split';
    import ratingselect from '../ratingselect/ratingselect';
    import {formatDate} from '../../common/js/date';
    // 加{},{}里可以包括多个方法

    // const POSITIVE = 0;
    // const NEGATIVE = 1;
    const ALL = 2;

    export default {
        // name: "food"
        components: {
            cartcontrol,
            split,
            ratingselect
        },
        props: {
            food: {
                type: Object
            }
        },
        data() {
            return {
                showFlag: false,
                selectType: ALL,
                onlyContent: true,
                desc: {
                    all: '全部',
                    positive: '推荐',
                    negative: '吐槽'
                }
            };
        },
        methods: {
            show() {
                this.showFlag = true;
                this.selectType = ALL;
                this.onlyContent = false;
                this.$nextTick(() => {
                    if (!this.scroll) {
                        this.scroll = new BScroll(this.$refs.food, {
                            click: true
                        });
                    } else {
                        this.scroll.refresh();
                    }
                });
            },
            hide() {
                this.showFlag = false;
            },
            addFirst() {
                Vue.set(this.food, 'count', 1);
            },
            needShow(type, text) {
                if (this.onlyContent && !text) {
                    return false;
                }
                if (this.selectType === ALL) {
                    return true;
                } else {
                    return type === this.selectType;
                }
            },
            ratingtype_select(type) {
                this.selectType = type;
                // this.scroll.refresh();
            },
            content_toggle(onlyContent) {
                this.onlyContent = onlyContent;
                // this.scroll.refresh();
            }
        },
        filters: {
            formatDate(time) {
                let date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm');
            }
        }
    };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  .food
    position fixed
    left: 0
    top: 0
    bottom 48px
    z-index 30
    width: 100%
    background #fff
    transition all 0.2s linear
    transform translate3d(0, 0, 0)

    &.move-enter
    &.move-leave-to
      transform translate3d(100%, 0, 0)

    .image-header
      position relative
      width: 100%
      height: 0
      padding-top 100% // 百分比相对于盒子的width计算，上下的padding值与width一样，最终效果：盒子看起来宽高相等

      img
        position absolute
        top: 0
        left: 0
        width: 100%
        height: 100%

      .back
        position absolute
        top: 0
        left: 0

        .icon-arrow_lift
          display block
          padding 10px
          font-size 20px
          color #fff

    .content
      position relative
      padding 18px

      .title
        line-height: 14px
        margin-bottom 8px
        font-size 14px
        font-weight 700
        color rgb(7, 17, 27)

      .detail
        margin-bottom 18px
        line-height: 10px
        height: 10px
        font-size 0

        .sell-count
        .rating
          font-size 10px
          color rgb(147, 153, 159)

        .sell-count
          margin-right 12px

      .price
        font-weight 700
        line-height: 24px

        .now
          margin-right 8px
          font-size 14px
          color rgb(240, 20, 20)

        .old
          text-decoration line-through
          font-size 10px
          color rgb(147, 153, 159)

      .cartcontrol-wrapper
        position absolute
        right: 18px
        bottom: 18px

      .buy
        position absolute
        right: 18px
        bottom: 18px
        z-index 10
        line-height: 24px
        height: 24px
        padding: 0 12px
        box-sizing border-box
        font-size 10px
        border-radius 12px
        color #fff
        background rgb(0, 160, 220)
        transition all 0.2s
        opacity 1

        &.fade-enter
        &.fade-leave-to
          opacity 0

    .info
      padding 18px

      .title
        line-height: 14px
        margin-bottom 6px
        font-size 14px
        color rgb(7, 17, 27)

      .text
        line-height: 24px
        padding 0 8px
        font-size 12px
        color rgb(77, 83, 95)

    .rating
      padding-top 18px

      .title
        line-height: 14px
        margin-left 18px
        font-size 14px
        color rgb(7, 17, 27)

      .rating-wrapper
        padding 0 18px

        .rating-item
          position relative
          padding 16px 0
          border-1px(rgba(7, 17, 27, 0.1))

          .user
            position absolute
            right: 0
            top: 16px
            line-height: 12px
            font-size 0

            .name
              display inline-block
              margin-right 6px
              vertical-align top
              font-size 10px
              color rgb(147, 153, 159)

            .avatar
              border-radius 50%

          .time
            margin-bottom 6px
            line-height: 12px
            font-size 10px
            color rgb(147, 153, 159)

          .text
            line-height: 16px
            font-size 12px
            color rgb(7, 17, 27)

            .icon-thumb_up
            .icon-thumb_down
              margin-right 4px
              line-height: 24px
              font-size 12px

            .icon-thumb_up
              color rgb(0, 160, 220)

            .icon-thumb_down
              color rgb(147, 153, 159)

        .no-ratings
          padding 16px 0
          font-size 12px
          color rgb(147, 153, 159)
</style>
