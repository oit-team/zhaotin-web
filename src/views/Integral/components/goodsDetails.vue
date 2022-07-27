<template>
  <div class="zt-page">
    <!-- 顶部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="zt-head">
      <el-breadcrumb-item :to="{ path: '/integral/goodsList' }">
        积分商城
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主题内容 -->
    <!-- 返回内容为空 -->
    <div v-if="showResult">
      <el-empty :description="resultText">
        <el-button type="primary" @click="$router.back()">
          返回
        </el-button>
      </el-empty>
    </div>
    <div v-else class="zt-content">
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
            <el-carousel-item v-if="infoData.styleVideo !== null">
              <div class="zt-swiper__item">
                <video
                  id="player"
                  ref="styleVideo"
                  width="500px"
                  height="500px"
                  :src="infoData.styleVideo"
                  controls
                  :poster="infoData.styleVideoPatch || infoData.videoImage"
                >
                  <source :src="infoData.styleVideo" type="video/mp4" />
                  <track kind="captions" label="English captions" src="" srclang="en" default />
                </video>
              </div>
            </el-carousel-item>
            <el-carousel-item
              v-for="(item, index) in infoData.thumbnailList"
              :key="index"
            >
              <el-image
                class="zt-swiper__item"
                :src="item.resUrl || item"
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
                  :src="item.resUrl || item"
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
        <div v-if="infoData.goodsSort === 2" class="zt-head__data">
          <!-- 商品名称 -->
          <div class="zt-data__head">
            <div class="zt-data__title">
              <div class="zt-title">
                {{ infoData.goodsName }}
              </div>
              <div class="zt-data__code">
                <div>款号：{{ infoData.goodsCode }}</div>
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
              积分
              <div class="zt-price__data zt-red">
                <span class="zt-wt">{{ infoData.goodsIntegral }}</span>
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
              <div class="zt-data__label">
                颜色
              </div>
              <div
                v-for="(item, index) in infoData.styleColorList"
                :key="index"
                class="zt-color__item"
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
            <div class="zt-data__size">
              <div class="zt-data__label">
                尺码
              </div>
              <div v-if="infoData.styleColorList && infoData.styleColorList.length !== 0" class="zt-data__info">
                <div v-for="(item, index) in infoData.styleColorList[colorIndex].styleSize" :key="index">
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
                @change="handleChange"
              />
            </div>
          </div>
          <!-- 购买 -->
          <div class="zt-data__btn">
            <div class="zt-btn__hei" @click="toRedeem">
              立即兑换
            </div>
          </div>
        </div>
        <div v-if="infoData.goodsSort === 1" class="zt-head__data">
          <!-- 商品名称 -->
          <div class="zt-data__head">
            <div class="zt-data__title">
              <div class="zt-title">
                {{ infoData.goodsName }}
              </div>
              <div class="zt-data__code">
                <div>编号：{{ infoData.goodsCode }}</div>
              </div>
            </div>
            <div class="note">
              <div class="my-5">
                兑换说明：{{ infoData.integralDesc }}
              </div>
            </div>
            <!-- <div class="zt-data__size flex">
              <div class="zt-data__label w-20">
                数量:
              </div>
              <el-input-number
                v-model="infoData.goodsNumber"
                size="small"
                :min="0"
              />
            </div> -->
            <!-- 购买 -->
            <div class="zt-data__btn">
              <div></div>
              <div class="zt-btn__hei" @click="toRedeem">
                立即兑换
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- center 产品详情 -->
      <div v-if="infoData.goodsSort === 2" class="zt-content__data">
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
              <!-- <div class="zt-info__flex" style="white-space:pre-wrap">
                {{ infoData.styleAttribute }}
              </div> -->
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
        <div class="zt-content__data5">
          <div class="zt-content__label">
            洗涤说明
          </div>
          <div v-if="infoData.styleWashing" class="zt-content__list">
            <div v-for="(item, index) in infoData.goodsWashing" :key="index" class="zt-content__info">
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
    </div>
  </div>
</template>

<script>
import { getDetails } from '@/api/integral'

export default {
  name: 'GoodsDetails',
  data() {
    return {
      goodsId: '',
      infoData: {},
      colors: ['#CDA46C', '#CDA46C', '#CDA46C'],
      num: 0,
      redeemNote: '',
      imageIndex: 0, // 选择图片
      colorIndex: 0, // 选择颜色
      sizeIndex: 0, // 选择大小
      showResult: false,
      resultText: '',
      showEmp: false,
      imgMarginL: 0,
      thumbnailList: [],
      orderType: '',
      sizeConfig: [],
      titleMap: [],
      isPlay: true,
      goodsData: {},
    }
  },
  created() {
    this.goodsId = this.$route.query.id
    if (this.$store.state.integral.isStart) this.getData()
    else this.infoData = this.$store.state.integral.detailData
  },
  beforeDestroy() {
    this.$store.commit('integral/cgDetail', this.infoData)
  },
  methods: {
    getData() {
      getDetails({ goodsId: this.goodsId }).then((res) => {
        const state = res.body.resultList?.state || res.body.goodsDetails?.state
        if (state === 1) {
          if (res.body.resultList !== undefined && res.body.resultList !== null) {
            this.infoData = res.body.resultList
            this.infoData.styleData = JSON.parse(this.infoData.styleData)
            this.infoData.styleWashing = JSON.parse(this.infoData.styleWashing)
            if (this.infoData.styleWashing) {
              const list = []
              this.infoData.styleWashing.forEach((e) => {
                if (e.status === 1)
                  list.push(e)
              })
              this.infoData.styleWashing = JSON.parse(JSON.stringify(list))
            }
            this.titleMap = Object
              .keys(this.infoData.titleMap)
              .sort((prev, next) => (+prev.substring(3)) - (+next.substring(3)))
              .map(key => this.infoData.titleMap[key])
            this.infoData.styleSizeList.forEach((e) => {
              this.sizeConfig.push(e.sizeConfig)
            })
            this.thumbnailList = [...this.infoData.imgUrlList, ...this.infoData.imgDetailUrlList]
            this.$set(this.infoData, 'thumbnailList', this.thumbnailList)
            // recommendationLevel : 推荐指数
            this.infoData.recommendationLevel = Number(this.infoData.recommendationLevel)
            // eslint-disable-next-line operator-assignment
            this.infoData.recommendationLevel += 0
            this.$set(this.infoData, 'goodsNumber', 0)
            // 给数据中  加入数量
            this.infoData.styleColorList.forEach((e) => {
              let n = 0
              e.styleSize.forEach((i) => {
                i.num = 0
                n += i.num
                return n
              })
              e.num = n
            })
            this.styleData = {
              styleId: 0,
              styleColor: '', // 颜色
              styleNo: this.infoData.styleNo,
              styleSize: [],
            }
            // 将 视频封面 加到切换轮播的images中
            if (this.infoData.styleVideoPatch !== null) {
              const url = {
                resUrl: this.infoData.styleVideoPatch,
              }
              this.infoData.imgUrlList.unshift(url)
            }
            if (this.infoData.imgDetailUrlList.length !== 0) this.infoData.imgUrlList.push(...this.infoData.imgDetailUrlList)
          } else {
            this.infoData = res.body.goodsDetails
            this.$set(this.infoData, 'goodsNumber', 0)
            // 将 视频封面 加到切换轮播的images中
            this.thumbnailList = [...this.infoData.imgUrlList]
            this.$set(this.infoData, 'thumbnailList', this.thumbnailList)
            const url = {
              resUrl: this.infoData.styleVideoPatch,
            }
            if (this.infoData.styleVideoPatch !== null) this.infoData.imgUrlList.unshift(url)
          }
        } else {
          this.$message.warning('该商品暂未上架')
        }
      }).catch(() => {
      }).finally(() => {
      })
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
      // if (value >= 0 && this.styleType === 2) {
      if (value >= 0) {
        this.infoData.styleColorList[this.colorIndex].styleSize[this.sizeIndex].num = value
        this.infoData.styleColorList.forEach((e) => {
          let n = 0
          e.styleSize.forEach((i) => {
            n += i.num
            return n
          })
          e.num = n
          this.infoData.goodsNumber += e.num
        })
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
    // 点击 兑换
    async toRedeem() {
      if (this.infoData.goodsSort === 2 && this.infoData.goodsNumber !== 0) {
        this.$store.commit('integral/addOrderStorage', this.infoData)
        this.$router.push('/integral/redeem')
      } else if (this.infoData.goodsSort === 1) {
        this.$store.commit('integral/addOrderStorage', this.infoData)
        this.$router.push('/integral/redeem')
      } else {
        this.$message.error('请填写购买商品的数量')
      }
    },
    transformImgL() {
      this.imgMarginL += 100
    },
    transformImgR() {
      if (this.$refs.pimages.clientWidth < this.$refs.pimages.scrollWidth) this.$set(this, 'imgMarginL', this.imgMarginL - 100)
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
          z-index: 99;
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
          z-index: 99;
        }
      }
    }
    .zt-head__data{
      width: 60%;
      color: #666;
      padding-left: 80px;
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
              width: 78px;
              height: 78px;
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
        margin-top: 40px;
        padding: 0 16px;
        box-sizing: border-box;
        .zt-btn__hei{
          padding: 8px 0;
          width: 200px;
          text-align: center;
          background-color: #CDA46C;
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
  .zt-content__data{
    margin: 50px 0;
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
        min-width: 70%;
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
