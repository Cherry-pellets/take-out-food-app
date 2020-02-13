<template>
  <div class="root">
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <!--使用ref属性为元素或组件添加标记，然后通过this.$refs获取-->
        <!--vue1版本需使用v-el指令,且不能用驼峰式命名,正确写法: v-el:menu-wrapper-->
        <ul>
          <li v-for="(item,index) in goods" :key="index" class="menu-item"
              :class="{'current':currentIndex===index}" @click="selectMenu(index)">
            <!--当currentIndex===$index时该元素拥有current类-->
            <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
            {{item.name}}</span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li v-for="(item,index) in goods" :key="index" class="food-list food-list-hook">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li @click="selectFood(food,$event)" v-for="(food,index1) in item.foods" :key="index1"
                  class="food-item border-1px">
                <div class="icon">
                  <img :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"
                :select-foods="selectFoods"></shopcart>
      <!--也可以用驼峰式：deliveryPrice-->
    </div>
    <food :food="selectedFood" ref="food"></food>
  </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import shopcart from '../shopcart/shopcart';
    import cartcontrol from '../cartcontrol/cartcontrol';
    import food from '../food/food';

    const ERR_OK = 0;
    export default {
        // name: 'goods'
        components: {
            food,
            shopcart,
            cartcontrol
        },
        props: {
            seller: {
                type: Object
            }
        },
        data() {
            return {
                goods: [],
                listHeight: [],
                scrollY: 0,
                // classMap:[]
                selectedFood: {}
            };
        },
        computed: {
            currentIndex() {
                for (let i = 0; i < this.listHeight.length; i++) {
                    let height1 = this.listHeight[i];
                    let height2 = this.listHeight[i + 1];
                    if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                        return i;
                    }
                }
                return 0;
            },
            selectFoods() {
                let foods = [];
                this.goods.forEach((good) => {
                    good.foods.forEach((food) => {
                        if (food.count) {
                            foods.push(food);
                        }
                    });
                });
                return foods;
            }
        },
        created() {
            this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
            this.$http.get('/api/goods').then((response) => {
                response = response.body;
                if (response.errno === ERR_OK) {
                    this.goods = response.data;
                    /* 在created()钩子函数执行的时候DOM 其实并未进行任何渲染，
                    而此时进行DOM操作无异于徒劳，所以此处一定要将DOM操作的
                    js代码放进Vue.nextTick()的回调函数中。
                    * */
                    this.$nextTick(() => {
                        this._initScroll();
                        this._calculateHeight();
                    });
                }
            });
        },
        methods: {
            _initScroll() {
                this.menuScroll = new BScroll(this.$refs.menuWrapper, {
                    click: true // 让menuScroll可以接收点击事件
                });
                // vue1版本使用：this.menuScroll = new BScroll(this.$els.menuWrapper, {});
                this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
                    probeType: 3, // 实时监测scrollY的位置
                    click: true // 因为使用了better-scroll，所以click事件会失效，需要激活
                });
                this.foodsScroll.on('scroll', (pos) => {
                    this.scrollY = Math.abs(Math.round(pos.y));
                });
            },
            _calculateHeight() {
                let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
                let height = 0;
                this.listHeight.push(height);
                for (let i = 0; i < foodList.length; i++) {
                    let item = foodList[i];
                    height += item.clientHeight;
                    this.listHeight.push(height);
                }
            },
            selectMenu(index) {
                /* if (!event.constructed) {
                // vue1如果不加此条件，切换为pc端后会触发两次此函数？
                // vue2加了以后就不执行后面的了
                    console.log(11);
                    return;
                } */
                let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
                // let foodList = document.getElementsByClassName('food-list-hook');
                let el = foodList[index];
                this.foodsScroll.scrollToElement(el, 300);
            },
            selectFood(food, event) {
                this.selectedFood = food;
                this.$refs.food.show();// 执行food组件里面的show方法
            }
        }
    };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .goods
    position absolute
    display flex
    width: 100%
    top: 174px
    bottom 64px
    overflow hidden

    .menu-wrapper
      flex 0 0 80px
      width: 80px
      background #f3f5f7

      .menu-item
        display table
        height: 54px
        width: 56px
        line-height: 14px
        padding 0 12px

        &.current
          position relative
          z-index 10
          margin-top -1px
          background #fff
          font-weight 700

          .text
            border-none()

        .icon
          display inline-block
          vertical-align top
          width: 12px
          height: 12px
          margin-left 4px
          background-size 12px 12px
          background-repeat no-repeat

          &.decrease
            bg-image('decrease_3')

          &.discount
            bg-image('discount_3')

          &.guarantee
            bg-image('guarantee_3')

          &.invoice
            bg-image('invoice_3')

          &.special
            bg-image('special_3')

        .text
          display table-cell
          width: 56px
          vertical-align middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size 12px

    .foods-wrapper
      flex 1

      .title
        padding 14px
        height: 26px
        line-height: 26px
        border-left 2px solid #d9dde1
        font-size 12px
        color rgb(147, 153, 159)
        background #f3f5f7
        padding-bottom 18px

      .food-item
        display flex
        margin 18px
        border-1px(rgba(7, 17, 27, 0.1))

        .icon
          img
            width: 65px
            height: 57px

        &:last-child
          border-none()
          margin-bottom 0

        .icon
          flex 0 0 57px
          margin-right 10px

        .content
          flex 1

          .name
            margin 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size 14px
            color rgb(7, 17, 27)

          .desc
          .extra
            line-height: 10px
            font-size 10px
            color rgb(147, 153, 159)

          .desc
            margin-bottom 8px
            line-height: 12px

          .extra
            .count
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
            right: 0
            bottom: 12px
</style>
