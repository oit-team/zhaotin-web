<template>
  <div class="zt-page">
    <!-- 顶部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="zt-head">
      <el-breadcrumb-item :to="{ path: '/styleCenter' }">
        商品中心
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 主题内容 -->
    <!-- 返回内容为空 -->
    <!-- <div v-if="showResult">
      <el-empty :description="resultText">
        <el-button type="primary" @click="$router.go(-1)">
          返回
        </el-button>
      </el-empty>
    </div> -->

    <div class="zt-content">
      <!-- top  商品图片 信息区 -->
      <div class="zt-content__head">
        <div class="zt-head__swiper">
          <!-- 轮播图 -->
          <el-carousel
            ref="carousel"
            height="500px"
            :autoplay="false"
            indicator-position="none"
          >
            <el-carousel-item v-if="infoData.styleVideo">
              <div class="zt-swiper__item">
                <video
                  id="player"
                  ref="styleVideo"
                  width="500px"
                  height="500px"
                  playsinline
                  controls
                  :poster="infoData.styleVideoPatch"
                >
                  <source :src="infoData.styleVideo" type="video/mp4" />
                  <track kind="captions" label="English captions" src="" srclang="en" default />
                </video>
                <!-- <i class="el-icon-video-play video-icon" v-show="isPlay"></i>
                <i class="el-icon-video-pause video-icon" v-show="!isPlay"></i> -->
              </div>
            </el-carousel-item>
            <el-carousel-item
              v-for="(item, index) in infoData.thumbnailList"
              :key="index"
            >
              <el-image
                class="zt-swiper__item"
                :src="item.resUrl"
                fit="contain"
              />
            </el-carousel-item>
          </el-carousel>
          <div ref="pimages" class="zt-head__images">
            <div v-if="imgMarginL < 0" class="zt-images__left" @click="transformImgL">
              <i class="el-icon-arrow-left"></i>
            </div>
            <div ref="imagesL" class="zt-images__center" :style="`marginLeft:${imgMarginL}px`">
              <div
                v-for="(item, index) in infoData.imgUrlList"
                :key="index"
                class="zt-images__item"
                @click="imageIndex = index, setCarouselItem(index)"
              >
                <el-image
                  fit="contain"
                  :class="imageIndex === index ? 'zt-images__select' : 'zt-images__image'"
                  :src="item.resUrl"
                />
                <i v-if="index === 0 && infoData.styleVideo" class="iconfont icon-qiehuanchanpin"></i>
                <!-- <i v-if="index===0&&infoData.styleVideo" class="el-icon-caret-right"></i> -->
              </div>
            </div>
            <div class="zt-images__right" @click="transformImgR">
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
        </div>
        <div class="zt-head__data">
          <!-- 商品名称 -->
          <div class="zt-data__head">
            <div class="zt-data__title">
              <div class="zt-title">
                {{ infoData.styleName }}
              </div>
              <div class="zt-data__code">
                <div>款号：{{ infoData.styleNo }}</div>
                <div class="zt-jin zt-data__p">
                  推荐指数：
                  <el-rate
                    v-model.number="infoData.recommendationLevel"
                    :colors="colors"
                    disabled
                    disabled-void-icon-class="el-icon-star-off"
                    disabled-void-color="#CDA46C"
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- 价格展示 -->
          <div class="zt-data__price">
            <div class="zt-price">
              价格
              <div class="zt-price__data zt-red">
                ￥<span class="zt-wt">{{ infoData.tagPrice }}</span>
                <!-- <div class="zt-hui">3件起订</div> -->
              </div>
            </div>
            <div class="zt-price">
              服务
              <div class="zt-price__data zt-hei" v-html="infoData.service">
              </div>
            </div>
          </div>
          <!-- 商品尺码信息 -->
          <div class="zt-data__data">
            <div class="zt-data__color">
              <div class="zt-data__label flex-shrink-0">
                颜色
              </div>
              <div class="flex flex-wrap items-center">
                <div
                  v-for="(item, index) in infoData.styleColorList"
                  :key="index"
                  class="zt-color__item mb-2"
                  :class="colorIndex === index ? 'zt-color__select' : ''"
                  @click="colorIndex = index, colorcgId(index)"
                >
                  <template v-if="item.styleImg">
                    <el-badge v-show="item.num !== 0" :value="item.num" class="item" type="warning">
                      <el-image
                        :src="item.colorImg"
                        fit="contain"
                      />
                    </el-badge>
                    <el-image
                      v-show="item.num === 0"
                      :src="item.colorImg"
                      fit="contain"
                    />
                    <div class="zt-color__name">
                      {{ item.styleColor }}
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <div class="zt-data__size">
              <div class="zt-data__label flex-shrink-0">
                尺码
              </div>
              <div v-if="infoData.styleColorList && infoData.styleColorList.length !== 0" class="zt-data__info">
                <div v-for="(item, index) in infoData.styleColorList[colorIndex].styleSize" :key="index" class="mb-2">
                  <el-badge v-show="item.num !== 0" :value="item.num" class="item" type="warning">
                    <div
                      class="zt-size__item"
                      :class="sizeIndex === index ? 'zt-size__select' : ''"
                      @click="sizeIndex = index, checkSize(index)"
                    >
                      {{ item.sizeName }}
                    </div>
                  </el-badge>
                  <div
                    v-show="item.num === 0"
                    class="zt-size__item"
                    :class="sizeIndex === index ? 'zt-size__select' : ''"
                    @click="sizeIndex = index, checkSize(index)"
                  >
                    {{ item.sizeName }}
                  </div>
                </div>
              </div>
            </div>
            <div class="zt-data__size">
              <div class="zt-data__label">
                数量
              </div>
              <el-input-number
                v-if="infoData.styleColorList && infoData.styleColorList.length !== 0"
                v-model="num"
                size="small"
                :min="0"
                class="zt-number"
                @change="handleChange"
              />
            </div>
          </div>
          <!-- 购买 -->
          <div class="zt-data__btn">
            <div class="zt-btn__hei" @click="toshoping">
              立即订购
            </div>
            <div class="zt-btn__jin" @click="toorder">
              <i class="el-icon-plus"></i> 加入订货清单
            </div>
          </div>
        </div>
      </div>

      <!-- center 产品详情 -->
      <div class="zt-content__data">
        <div class="zt-content__title">
          商品信息
        </div>
        <!-- 售后服务 -->
        <div class="zt-content__data1">
          <div class="zt-data1__flex">
            <div class="zt-content__label">
              售后服务
            </div>
            <div class="zt-content__info">
              <p style="white-space:pre-wrap" v-html="infoData.service"></p>
            </div>
          </div>
          <div class="zt-data1__flex">
            <div class="zt-content__label">
              基础信息
            </div>
            <div class="zt-content__info">
              <div class="zt-info__flex">
                <div class="zt-info__label">
                  材质
                </div>
                <div class="zt-info__info">
                  {{ infoData.styleFabric }}
                </div>
              </div>
              <div class="zt-info__flex">
                <div class="zt-info__label">
                  版型
                </div>
                <div class="zt-info__info">
                  {{ infoData.styleFlowerPattern }}
                </div>
              </div>
              <div class="zt-info__flex">
                <div class="zt-info__label">
                  类别
                </div>
                <div class="zt-info__info">
                  {{ infoData.styleCategory }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-divider />

        <!-- 产品卖点 -->
        <div class="zt-content__data2">
          <div class="zt-content__label">
            商品卖点
          </div>
          <div class="zt-content-flex">
            <div class="zt-content__info">
              <div class="zt-data2__flex">
                <div class="zt-data2__label">
                  <i class="iconfont icon-mianliaomaidian"></i>面料卖点
                </div>
                <!-- <div class="zt-data2__info">荷兰貂皮大衣</div> -->
                <div class="zt-data2__info" v-html="infoData.sellingPointFabric">
                </div>
              </div>
              <div class="zt-data2__flex">
                <div class="zt-data2__label">
                  <i class="iconfont icon-shejimaidian"></i>设计卖点
                </div>
                <div class="zt-data2__info" v-html="infoData.designSellingPoint">
                </div>
              </div>
              <div class="zt-data2__flex">
                <div class="zt-data2__label">
                  <i class="iconfont icon-chuanzhuomaidian"></i>穿着卖点
                </div>
                <div class="zt-data2__info" v-html="infoData.wearSellingPoint">
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-divider />

        <!-- 服装尺寸 -->
        <div class="zt-content__data3">
          <div class="zt-content__label">
            尺码信息
          </div>
          <div class="zt-content__info">
            <div class="data3-form">
              <div class="form-line">
                <div class="form-line__item">
                  尺码
                </div>
                <div
                  v-for="(item, index) in titleMap"
                  :key="index"
                  class="form-line__item"
                >
                  {{ item }}
                </div>
              </div>
              <div
                v-for="(item, index) in infoData.styleSizeList"
                :key="index"
                class="form-line"
              >
                <div class="form-line__item">
                  {{ item.sizeName }}
                </div>
                <div
                  v-for="(iteM, indeX) in item.sizeConfig"
                  :key="indeX"
                  class="form-line__item"
                >
                  {{ iteM || '-' }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-divider />

        <!-- 服装材料信息 -->
        <div class="zt-content__data4">
          <div class="zt-content__label">
            商品属性
          </div>
          <div class="zt-content__info">
            <div v-for="(item, index) in infoData.styleData" :key="index" class="zt-info__item">
              <div class="zt-item__label">
                {{ item.name }}
              </div>
              <div v-for="(itemN, indexN) in item.options" :key="indexN" class="zt-item__item">
                <div :class="itemN.status === 1 ? 'zt-item__select' : 'zt-item__item-item'">
                  {{ itemN.option }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-divider />

        <!-- 洗涤说明 -->
        <div class="zt-content__data5">
          <div class="zt-content__label">
            洗涤说明
          </div>
          <div v-if="infoData.styleWashing" class="zt-content__list">
            <div v-for="(item, index) in infoData.styleWashing" :key="index" class="zt-content__info">
              <!-- <div v-if="item.status === '1'"> -->
              <el-image
                style="width: 80px; height: 80px"
                :src="item.resUrl"
                fit="contain"
              />
              <div>{{ item.name }}</div>
              <!-- </div> -->
            </div>
          </div>
        </div>
      </div>

      <!-- 底部 推荐区 -->
      <div class="zt-content__footer">
        <div class="zt-content__title">
          季节推荐
        </div>
        <el-empty v-if="showEmp" description="暂无相关数据" />
        <div v-else class="zt-content">
          <div
            v-for="(item, index) in dataList"
            :key="index"
            class="zt-content__item"
            @click="todetails(item.styleId)"
          >
            <el-image
              class="zt-good__image"
              :src="item.resUrl"
              fit="contain"
            />
            <div v-if="item.styleIsVideo" class="zt-video__b">
              <i class="el-icon-video-camera-solid"></i>
            </div>
            <div class="zt-item__line">
              {{ item.styleName }}
            </div>
            <div class="zt-item__line flex">
              <div class="zt-price__l">
                {{ item.styleNo }}
              </div>
              <div class="zt-price__r">
                ￥<div class="zt-item__price">
                  {{ item.tagPrice }}
                </div>
              </div>
            </div>
            <!-- <el-divider /> -->
            <!-- <div class="zt-item__line top-line">已售50000件</div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getGoodsDetailes, getProductList } from '@/api/product'
import { addCart } from '@/api/orderCart'

export default {
  name: 'GoodsDetails',
  data() {
    return {
      goodsId: '',
      infoData: {},
      colors: ['#CDA46C', '#CDA46C', '#CDA46C'],
      num: 0,
      dataList: [],
      formData: {
        styleNo: '', // 商品编号
        pageNum: '1',
        pageSize: '20',
        styleId: '', // 商品id
        styleLength: '', // 商品衣长
        styleCategory: '', // 商品类别
        endTradePrice: '', // 结束批发价
        startTradePrice: '', // 开始批发价
        startcreatTime: '', // 开始时间
        endcreateTime: '', // 结束时间
        styleName: '', // 商品名称
        status: '1', // 商品状态
        seriesId: '', // 季节id
        shelfTimeSort: 0, // 批发价排序（0：从小到大 1是从大到小）
        tradePriceSort: 0, // 上架时间排序（0：从小到大 1是从大到小）
      },
      imageIndex: 0, // 选择图片
      colorIndex: 0, // 选择颜色
      sizeIndex: 0, // 选择大小
      allList: [],
      styleData: {},
      sizeData: {},
      showResult: false,
      resultText: '',
      showEmp: false,
      imgMarginL: 0,
      thumbnailList: [],
      orderType: '',
      sizeConfig: [],
      titleMap: [],
      isPlay: true,
    }
  },
  created() {
    this.goodsId = this.$route.query.id
    this.orderType = this.$route.query.orderType
    if (this.$store.state.order.isStart)
      this.getData()
    else
      this.infoData = this.$store.state.order.detailData
  },
  // mounted() {
  //   this.$refs.styleVideo.addEventListener('play', this.videoPlay)
  //   this.$refs.styleVideo.addEventListener('pause', this.videoPause)
  // },
  beforeDestroy() {
    if (this.$route.path === '/styleCenter/orderGoods') {
      this.$store.commit('order/cgStart', false)
      this.$store.commit('order/cgDetail', this.infoData)
    } else {
      this.$store.commit('order/cgStart', true)
    }
  },
  methods: {
    getData() {
      const that = this
      getGoodsDetailes({
        styleId: that.goodsId,
      }).then((res) => {
        if (res.head.status === 0) {
          that.infoData = res.body.resultList
          that.infoData.styleData = JSON.parse(that.infoData.styleData)
          that.infoData.styleWashing = JSON.parse(that.infoData.styleWashing)
          if (that.infoData.styleWashing) {
            const list = []
            that.infoData.styleWashing.forEach((e) => {
              if (e.status === 1)
                list.push(e)
            })
            that.infoData.styleWashing = JSON.parse(JSON.stringify(list))
          }
          that.thumbnailList = [...that.infoData.imgUrlList, ...that.infoData.imgDetailUrlList]
          that.titleMap = Object
            .keys(that.infoData.titleMap)
            .sort((prev, next) => (+prev.substring(3)) - (+next.substring(3)))
            .map(key => that.infoData.titleMap[key])
          that.infoData.styleSizeList.forEach((e) => {
            that.sizeConfig.push(e.sizeConfig)
          })
          that.formData.seriesId = String(res.body.resultList.seriesId)
          that.$set(that.infoData, 'thumbnailList', that.thumbnailList)
          // recommendationLevel : 推荐指数
          that.infoData.recommendationLevel = Number(that.infoData.recommendationLevel)
          // eslint-disable-next-line operator-assignment
          that.infoData.recommendationLevel += 0
          // 给数据中  加入数量
          that.infoData.styleColorList.forEach((e) => {
            let n = 0
            e.styleSize.forEach((i) => {
              i.num = 0
              n += i.num
              return n
            })
            e.num = n
          })
          that.styleData = {
            styleId: 0,
            styleColor: '', // 颜色
            styleNo: that.infoData.styleNo,
            styleSize: [],
          }
          // 将 视频封面 加到切换轮播的images中
          if (that.infoData.styleVideoPatch !== null) {
            const url = {
              resUrl: that.infoData.styleVideoPatch,
            }
            that.infoData.imgUrlList.unshift(url)
          }
          if (that.infoData.imgDetailUrlList.length !== 0)
            that.infoData.imgUrlList.push(...that.infoData.imgDetailUrlList)

          that.loadData()
        }
      }).catch(() => {
      })
    },
    async loadData() {
      const that = this
      const res = await getProductList({
        ...that.formData,
      })
      that.dataList = res.body.resultList
      if (res.body.resultList.length === 0)
        this.showEmp = true
      else
        this.showEmp = false
    },
    // 轮播图 切换出控制
    setCarouselItem(index) {
      this.$refs.carousel.setActiveItem(index)
    },
    videoPlay() {
      this.isPlay = true
      this.$refs.styleVideo.play()
    },
    videoPause() {
      this.isPlay = false
      this.$refs.styleVideo.pause()
    },
    // 商品数量
    handleChange(value) {
      if (value >= 0) {
        this.infoData.styleColorList[this.colorIndex].styleSize[this.sizeIndex].num = value
        this.infoData.styleColorList.forEach((e) => {
          let n = 0
          e.styleSize.forEach((i) => {
            n += i.num
            return n
          })
          e.num = n
        })
      } else {
        this.$message('请填写正确数字')
      }
    },
    // 切换尺码大小
    checkSize(id) {
      this.num = this.infoData.styleColorList[this.colorIndex].styleSize[id].num
    },
    // 切换颜色
    colorcgId(id) {
      this.sizeIndex = 0
      this.num = this.infoData.styleColorList[id].styleSize[this.sizeIndex].num
    },
    // 推荐区  图片点击事件
    todetails(id) {
      this.goodsId = id
      this.getData()
      window.scrollTo('0', '0')
    },
    // 点击订购
    async toshoping() {
      const that = this
      const data = JSON.parse(JSON.stringify(that.infoData))
      that.$store.commit('order/cgDetail', that.infoData)
      // 新建  商品对象
      const resultList = []
      const resultListinfo = {
        styleId: that.infoData.styleId,
        styleNo: that.infoData.styleNo,
        styleName: that.infoData.styleName,
        userId: sessionStorage.getItem('userId'),
        style: [], // 颜色集合
      }
      const data1 = []
      data.styleColorList.forEach((item, index) => {
        that.$set(item, 'openList', true)
        that.$set(item, 'imgUrl', item.colorImg)
        that.$set(item, 'styleNumber', item.num)
        that.$set(item, 'styleId', that.infoData.styleId)
        that.$set(item, 'stylePrice', that.infoData.tradePrice)
        data1[index] = item
        item.styleSize.forEach((i) => {
          that.$set(i, 'sizeNumber', i.num)
          delete i.num
          delete i.sort
          delete i.sizeKey
          delete i.sizeValue
        })
        data1[index].styleSize = item.styleSize.filter((i) => {
          return i.sizeNumber > 0
        })
      })
      resultListinfo.style = data1.filter((item) => {
        return item.styleSize.length !== 0
      })
      resultList.push(resultListinfo)
      if (resultListinfo.style.length > 0) {
        that.$set(that.infoData, 'styleList', resultList)
        that.$store.commit('order/addOrderStorage', that.infoData)
        that.$router.push('/styleCenter/orderGoods')
      } else {
        that.$message.error('请选择购买的尺码和数量')
      }
    },
    // 加入购物车
    async toorder() {
      this.cart()
      if (this.allList && this.allList.length === 0) {
        this.$message.error('请选择购买的尺码和数量')
      } else {
        const res = await addCart({
          styleList: this.allList,
          cartStyleType: this.orderType,
        })
        if (res.head.status === 0) {
          this.$message({
            message: '成功加入购物清单',
            type: 'success',
          })
          this.$parent.cgcart()
        }
      }
    },
    cart() {
      const that = this
      // that.infoData 返回的商品详情
      that.infoData.styleColorList.forEach((e) => {
        // 如果 当前商品的数量 > 0 则说明有商品
        if (e.num > 0) {
          const styleData = {
            styleId: that.goodsId,
            styleColor: e.id, // 当前颜色id
            styleNo: that.infoData.styleNo,
            styleSize: [],
          }
          // 然后遍历当前颜色的尺码 如果L码有 num 则生成对象添加到当前的StyleSize 中
          e.styleSize.forEach((i) => {
            if (i.num > 0) {
              const sizeData = {
                sizeName: i.sizeName,
                sizeNumber: i.num,
              }
              styleData.styleSize.unshift(sizeData)
            }
          })
          that.allList.unshift(styleData)
        }
      })
    },
    transformImgL() {
      this.imgMarginL += 50
      // if (this.$refs.imagesL.scrollWidth > this.$refs.pimages.scrollWidth) {
      //   this.imgMarginL += 50
      // }
    },
    transformImgR() {
      if (this.$refs.pimages.clientWidth < this.$refs.pimages.scrollWidth)
        this.imgMarginL -= 50
    },
  },
}
</script>

<style lang='scss' scoped>
.zt-head{
  margin: 20px 0;
}
video::-webkit-media-controls-play-button {
  display: block;
}
video::-webkit-media-controls-timeline {
  display: block;
}
--deep video{
  height: 500px !important;
}
.zt-content{
  .zt-content__head{
    display: flex;
    width: 100%;
    margin: 20px 0;
    .zt-head__swiper{
      width: 40%;
      border: 1px solid #ECE8E5;
      border-radius: 10px;
      .zt-swiper__item{
        width: 500px;
        height: 500px;
        video{
          width: 100%;
          height: 100% !important;
        }
      }
      .zt-head__images{
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
        margin: 10px 0;
        .zt-images__left{
          width: 4%;
          height: 88px;
          line-height: 88px;
          border-radius: 10px;
          background-color: #ccc;
          font-size: 20px;
          z-index: 1;
        }
        .zt-images__center{
          width: 95%;
          display: flex;
          flex-wrap: nowrap;
          // overflow-x: auto;
          // overflow-y: hidden;
          .zt-images__item{
            position: relative;
            margin: 0 10px;
            border-radius: 5px;
            box-sizing: border-box;
            .zt-images__image{
              width: 80px;
              height: 80px;
              border-radius: 5px;
              border: 1px solid #ECE8E5;
            }
            .zt-images__select{
              width: 80px;
              height: 80px;
              border-radius: 5px;
              border: 1px solid #CDA46C;
            }
            .icon-qiehuanchanpin{
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%,-50%);
              color: #fff;
              font-size: 30px;
              opacity: 0.7;
              z-index: 1;
            }
          }
        }
        .zt-images__center::-webkit-scrollbar{
          display: none;
        }
        .zt-images__right{
          width: 4%;
          height: 88px;
          line-height: 88px;
          border-radius: 10px;
          background-color: #ccc;
          font-size: 20px;
          z-index: 1;
        }
      }
    }
    .zt-head__data{
      width: 60%;
      color: #666;
      padding: 20px 40px;
      border: 1px solid #ededed;
      border-radius: 10px;
      margin-left: 10px;
      box-sizing: border-box;
      .zt-data__head{
        .zt-data__title{
          font-size: 24px;
          line-height: 36px;
          .zt-title{
            color: #333;
            font-weight: 800;
          }
          .zt-data__code{
            display: flex;
            color: #666;
            justify-content: space-between;
            font-size: 16px;
          }
          .zt-data__p{
            display: flex;
            align-items: center;
          }
        }
      }
      .zt-data__price{
        color: #999999;
        font-size: 14px;
        text-align: center;
        padding: 20px 16px;
        background-color: #f6f5f3;
        border-radius: 10px;
        margin-top: 20px;
        box-sizing: border-box;
        .zt-price{
          display: flex;
          align-items: center;
          margin: 10px 0;
          .zt-price__data{
            margin-left: 50px;
            .zt-wt{
              font-size: 28px;
            }
          }
        }
      }
      .zt-data__data{
        padding: 0 16px;
        margin-top: 20px;
        box-sizing: border-box;
        .zt-data__label{
          margin-right: 30px;
        }
        .zt-data__color{
          display: flex;
          align-items: center;
          .zt-color__item{
            position: relative;
            margin-left: 20px;
            border-radius: 10px;
            height: 80px;
            box-sizing: border-box;
            border: 1px solid #ECE8E5;
            .el-image{
              width: 80px;
              height: 80px;
              border-radius: 10px;
              border: 1px solid #ECE8E5;
            }
            .zt-color__name{
              position: absolute;
              bottom: -1px;
              width: 100%;
              text-align: center;
              background: #000;
              opacity: .6;
              font-size: 14px;
              border-radius: 0 0 10px 10px;
              color: #fff;
            }
          }
          .zt-color__select{
            border-color: #CDA46C;
          }
        }
        .zt-data__size{
          display: flex;
          align-items: center;
          margin-top: 20px;
          .zt-data__info{
            display: flex;
            align-items: center;
            flex-wrap: wrap;
          }
          .zt-size__item{
            padding: 5px 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-sizing: border-box;
            margin-left: 20px;
          }
          .zt-size__item:hover{
            cursor:pointer;
          }
          .zt-size__select{
            // border: 1px solid #CDA46C;
            background-color: #CDA46C;
            color: #fff;
          }
        }
      }
      .zt-data__btn{
        display: flex;
        align-items: center;
        margin-top: 20px;
        padding: 0 16px;
        box-sizing: border-box;
        .zt-btn__hei{
          padding: 8px 0;
          width: 200px;
          text-align: center;
          background-color: #333;
          border-radius: 25px;
          color: #fff;
          box-sizing: border-box;
        }
        .zt-btn__hei:hover{
          cursor:pointer;
        }
        .zt-btn__jin:hover{
          cursor:pointer;
        }
        .zt-btn__jin{
          padding: 8px 0;
          width: 200px;
          text-align: center;
          background-color: #CDA46C;
          border-radius: 25px;
          color: #fff;
          margin-left: 20px;
          box-sizing: border-box;
        }
      }
    }
  }
  ::v-deep .el-input-number{
    margin-left: 20px;
  }
  .zt-number{
    margin-left: 20px;
  }
  .zt-content__data{
    margin-top: 50px;
    .zt-content__title{
      width: 100%;
      color: #CDA46C;
      font-size: 20px;
      font-weight: 800;
      padding: 20px 30px;
      margin-bottom: 30px;
      background-color: #f6f5f3;
    }
    .zt-content__label{
      margin-right: 30px;
      color: #666;
    }
    .zt-content__data1{
      display: flex;
      padding: 0 30px;
      .zt-data1__flex{
        width: 50%;
        display: flex;
        align-items: baseline;
        .zt-content__info{
          line-height: 30px;
          .zt-info__flex{
            display: flex;
            color: #666;
            .zt-info__label{
              width: 100px;
              color: #333;
            }
            .zt-info__info{
              color: #666;
            }
          }
        }
      }
    }
    .zt-content__data2{
      display: flex;
      align-items: baseline;
      padding: 0 30px;
      .zt-content-flex{
        display: flex;
        width: 90%;
      }
      .zt-content__info{
        // width: 50%;
        line-height: 30px;
        .zt-data2__flex{
          display: flex;
          color: #666;
          margin: 10px 0;
          .zt-data2__label{
            width: 120px;
            color: #333;
          }
          .zt-data2__info{
            max-width: 80%;
            color: #666;
          }
        }
      }
      .iconfont{
        font-size: 16px;
        color: #CDA46C;
        margin-right: 10px;
      }
    }
    .zt-content__data3{
      display: flex;
      align-items: baseline;
      padding: 0 30px;
      .zt-content__info{
        min-width: 45%;
        max-width: 90%;
      }
    }
    .zt-content__data4{
      display: flex;
      align-items: baseline;
      padding: 0 30px;
      .zt-content__info{
        .zt-info__item{
          display: flex;
          align-items: center;
          border-bottom: 1px solid #ccc;
          .zt-item__label{
            padding: 0 50px;
          }
          .zt-item__item{
            padding: 10px 50px;
          }
          .zt-item__select{
            padding: 2px 20px;
            background: #CDA46C;
            color: #fff;
            border-radius: 5px;
            box-sizing: border-box;
          }
          .zt-item__item-item{
            padding: 2px 20px;
          }
        }
      }
      .zt-info__item:nth-child(4){
        border-bottom: none;
      }
    }
    .zt-content__data5{
      display: flex;
      align-items: center;
      padding: 0 30px;
      .zt-content__list{
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        width: 90%;
        margin-left: 20px;
        .zt-content__info{
          text-align: center;
          margin-right: 10px;
        }
      }
    }
  }
  .zt-content__footer{
    margin-top: 50px;
    // .zt-footer__tans{
    //   width: 100%;
    //   font-size: 18px;
    //   background-color: #ECE8E5;
    //   box-sizing: border-box;
    // }
    .zt-content__title{
      width: 100%;
      color: #CDA46C;
      font-size: 20px;
      font-weight: 800;
      padding: 20px 30px;
      margin-bottom: 30px;
      background-color: #f6f5f3;
    }
    .zt-content{
      display: flex;
      flex-wrap: wrap;
      .zt-content__item:hover{
        cursor: pointer;
      }
      .zt-content__item{
        position: relative;
        width: 232px;
        color: #333333;
        font-size: 14px;
        margin: 0 0 10px 15px;
        border-radius: 5px;
        border: 1px solid #ECE8E5;
        box-sizing: border-box;
        .zt-good__image{
          width: 230px;
          height: 300px;
          border-radius: 5px;
          border-bottom: 1px solid #F2F2F2;
        }
        .zt-video__b{
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 5px 7px;
          background-color: #FF9606;
          border-radius: 5px;
          box-sizing: border-box;
          .el-icon-video-camera-solid{
            font-size: 20px;
            color: #fff;
          }
        }
        .zt-item__line{
          // display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 14px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          box-sizing: border-box;
        }
        .zt-price__l{
          // display: flex;
          // align-items: baseline;
          color: #FF0000;
        }
        .zt-price__r{
          display: flex;
          align-items: baseline;
          color: #FF0000;
        }
        .zt-item__price{
          color: #FF0000;
          font-size: 24px;
        }
      }
      .zt-content__item_margin{
        width: 230px;
        color: #333333;
        font-size: 14px;
        margin: auto;
        margin-bottom: 16px;
        border: 1px solid #F2F2F2;
      }
    }
  }
}
::v-deep .el-carousel__item{
  border-radius: 10px 10px 0 0;
}
::v-deep .zt-swiper__item{
  position: relative;
}
.video-icon{
  position: absolute;
  top: 40%;
  left: 50%;
  color: #fff;
  transform: translate(-50%, 0);
  z-index: 10;
  font-size: 50px;
}
.el-icon-video-pause{
  opacity: 0;
  transition: all 0.4s;
}
.video-icon:hover{
  .el-icon-video-pause{
    opacity: 0.85;
  }
}
.data3-form{
  border: 1px solid #EBEEF5;
  color: #909399;
  .form-line{
    display: flex;
    justify-content: space-around;
    text-align: center;
    align-items: center;
    border-top: 1px solid #EBEEF5;
    .form-line__item{
      width: 100%;
      height: 40px;
      line-height: 40px;
      border-left: 1px solid #EBEEF5;
    }
    .form-line__item:first-child{
      border: none;
    }
  }
  .form-line:first-child{
    border: none;
  }
}
.zt-jin{
  color: #634a28;
}
.zt-hui{
  color: #999999;
}
.zt-red{
  color: #FF0000;
}
.zt-hei{
  color: #000000;
}
</style>
