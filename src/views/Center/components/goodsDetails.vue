<template>
  <div class="zt-page">
    <!-- 顶部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="zt-head">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主题内容 -->
    <div class="zt-content">
      <!-- top  商品图片 信息区 -->
      <div class="zt-content__head">
        <div class="zt-head__swiper">
          <!-- 轮播图 -->
          <el-carousel
            height="500px"
            ref="carousel"
            :autoplay="false"
          >
            <el-carousel-item
              v-for="(item, index) in infoData.imgDetailUrlList"
              :key="index"
            >
              <!-- <h3 class="small">{{ item.resUrl }}</h3> -->
              <el-image
                class="zt-swiper__item"
                :src="item.resUrl"
                fit="contain"
              />
            </el-carousel-item>
          </el-carousel>
          <div class="zt-head__images">
            <div class="zt-images__left">
              <div
                class="zt-images__item"
                v-for="(item, index) in infoData.imgUrlList"
                :key="index"
              >
                <el-image
                  fit="contain"
                  class="zt-images__image"
                  :src="item.resUrl"
                  @click="setCarouselItem(index)"
                />
              </div>
            </div>
            <div class="zt-images__right">
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
        </div>
        <div class="zt-head__data">
          <!-- 商品名称 -->
          <div class="zt-data__head">
            <div class="zt-data__title">
              <div class="zt-title">{{ infoData.styleName }}</div>
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
                ￥<span class="zt-wt">{{ infoData.costPrice }}</span>
                <div class="zt-hui">3件起订</div>
              </div>
            </div>
            <div class="zt-price">
              服务
              <div class="zt-price__data zt-hei">
                售后服务 / 满100000元免物流费 / 无忧售后退换货
              </div>
            </div>
          </div>
          <!-- 商品尺码信息 -->
          <div class="zt-data__data">
            <div class="zt-data__color">
              <div class="zt-data__label">颜色</div>
              <div v-for="(item, index) in infoData.styleColorList" :key="index">
                <div class="zt-color__item" @click="colorcgId(index)">
                  <div v-if="item.styleImg">
                    <el-image
                      :src="item.styleImg[0].resUrl"
                      fit="contain"
                    />
                    <div class="zt-color__name">{{ item.styleColor }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="zt-data__size">
              <div class="zt-data__label">尺码</div>
              <div v-if="infoData.styleColorList">
                <div v-for="(item, index) in infoData.styleColorList[sizeId].styleSize" :key="index">
                  <div class="zt-size__item">
                    <!-- {{ item.sizeName }} -->
                    <el-button plain>{{ item.sizeName }}</el-button>
                  </div>
                </div>
              </div>
            </div>
            <div class="zt-data__size">
              <div class="zt-data__label">数量</div>
              <el-input-number size="small" v-model="num" @change="handleChange" :min="1" :max="99" />
            </div>
          </div>
          <!-- 购买 -->
          <div class="zt-data__btn">
            <div class="zt-btn__hei">立即订购</div>
            <div class="zt-btn__jin"><i class="el-icon-plus"></i> 加入订货清单</div>
          </div>
        </div>
      </div>
      <!-- center 产品详情 -->
      <div class="zt-content__data">
        <div class="zt-content__title">
          产品信息
        </div>
        <!-- 售后服务 -->
        <div class="zt-content__data1">
          <div class="zt-data1__flex">
            <div class="zt-content__label">售后服务</div>
            <div class="zt-content__info">
              <p>售后服务</p>
              <p>满100000元面物流费</p>
              <p>无忧售后退换货</p>
            </div>
          </div>
          <div class="zt-data1__flex">
            <div class="zt-content__label">属性</div>
            <div class="zt-content__info">
              <div class="zt-info__flex">
                <div class="zt-info__label">销售单位:</div>
                <div class="zt-info__info">单品</div>
              </div>
              <div class="zt-info__flex">
                <div class="zt-info__label">单个包装尺寸:</div>
                <div class="zt-info__info">500 x 20 x 30 厘米</div>
              </div>
              <div class="zt-info__flex">
                <div class="zt-info__label">单件毛重:</div>
                <div class="zt-info__info">5.5公斤</div>
              </div>
            </div>
          </div>
        </div>
        <el-divider />
        <!-- 产品卖点 -->
        <div class="zt-content__data2">
          <div class="zt-content__label">产品卖点</div>
          <div class="zt-content-flex">
            <div class="zt-content__info">
              <div class="zt-data2__flex">
                <div class="zt-data2__label"><i class="iconfont icon-mianliaomaidian"></i>面料卖点</div>
                <div class="zt-data2__info">荷兰貂皮大衣</div>
              </div>
              <div class="zt-data2__flex">
                <div class="zt-data2__label"><i class="iconfont icon-shejimaidian"></i>设计卖点</div>
                <div class="zt-data2__info">发送到发送到发</div>
              </div>
              <div class="zt-data2__flex">
                <div class="zt-data2__label"><i class="iconfont icon-chuanzhuomaidian"></i>穿着卖点</div>
                <div class="zt-data2__info">发送到发送到发</div>
              </div>
            </div>
            <div class="zt-content__info">
              <div class="zt-data2__flex">
                <div class="zt-data2__label"><i class="iconfont icon-mianliaomaidian"></i>面料卖点</div>
                <div class="zt-data2__info">荷兰貂皮大衣</div>
              </div>
              <div class="zt-data2__flex">
                <div class="zt-data2__label"><i class="iconfont icon-shejimaidian"></i>设计卖点</div>
                <div class="zt-data2__info">发送到发送到发</div>
              </div>
              <div class="zt-data2__flex">
                <div class="zt-data2__label"><i class="iconfont icon-chuanzhuomaidian"></i>穿着卖点</div>
                <div class="zt-data2__info">发送到发送到发</div>
              </div>
            </div>
          </div>
        </div>
        <!-- <el-divider /> -->
        <!-- <div class="zt-content__data3">
          <div class="zt-content__label">尺码信息</div>
          <div class="zt-content__info"> -->
            <!-- <el-table
              :data="infoData.styleSizeList"
              height="250"
              border
              style="width: 100%">
              <el-table-column
                prop="date"
                label="尺寸"
                width="120"
                align="center"
              />
              <el-table-column
                prop="name"
                label="肩宽"
                width="120"
                align="center"
              />
              <el-table-column
                prop="address"
                label="胸围"
                width="120"
                align="center"
              />
              <el-table-column
                prop="address"
                label="衣长"
                width="120"
                align="center"
              />
              <el-table-column
                prop="address"
                label="袖长"
                width="120"
                align="center"
              />
            </el-table> -->
            <!-- </div>
        </div> -->
        <!-- <el-divider /> -->
        <!-- <div class="zt-content__data4">
          <div class="zt-content__label">服装信息</div>
          <div class="zt-content__info">
            <div class="zt-info__item">
              <div class="zt-item__label">厚薄程度</div>
              <div class="zt-item__item">偏薄</div>
              <div class="zt-item__item">适中</div>
              <div class="zt-item__item">偏厚</div>
            </div>
            <div class="zt-info__item">
              <div class="zt-item__label">版型指数</div>
              <div class="zt-item__item">紧身</div>
              <div class="zt-item__item">适中</div>
              <div class="zt-item__item">宽松</div>
            </div>
            <div class="zt-info__item">
              <div class="zt-item__label">弹力指数</div>
              <div class="zt-item__item">无弹</div>
              <div class="zt-item__item">适中</div>
              <div class="zt-item__item">偏弹</div>
            </div>
            <div class="zt-info__item">
              <div class="zt-item__label">柔软指数</div>
              <div class="zt-item__item">偏柔</div>
              <div class="zt-item__item">适中</div>
              <div class="zt-item__item">柔软</div>
            </div>
          </div>
        </div> -->
        <!-- <el-divider /> -->
        <!-- <div class="zt-content__data5">
          <div class="zt-content__label">洗涤说明</div>
          <div class="zt-content__info"></div>
        </div> -->
      </div>
      <!-- 底部 推荐区 -->
      <div class="zt-content__footer">
        <div class="zt-content__title">
          季节推荐
        </div>
        <div class="zt-content">
          <div
            class="zt-content__item"
            :class="goodsLength>=5?'zt-content__item_margin':''"
            v-for="(item, index) in dataList"
            :key="index"
            @click="todetails(item.styleId)"
          >
            <el-image
              class="zt-good__image"
              :src="item.resUrl"
              fit="contain"
            />
            <div class="zt-item__line">{{ item.styleName }}</div>
            <div class="zt-item__line">
              <div class="zt-price__l">{{ item.styleNo }}</div>
              <div class="zt-price__r">￥<div class="zt-item__price">{{ item.tagPrice }}</div></div>
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
import Tabs from '@/components/tabs/tabs'
import { getGoodsDetailes, getProductList } from '@/api/product'

export default {
  name: 'GoodsDetails',
  components: {
    Tabs,
  },
  data() {
    return {
      goodsId: '',
      infoData: {},
      value2: 3,
      colors: ['#CDA46C', '#CDA46C', '#CDA46C'],
      num: 1,
      colorId: 0,
      sizeId: 0,
      ishome: false,
      tabList: [],
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
        seriesId: '3', // 季节id
        shelfTimeSort: 0, // 批发价排序（0：从小到大 1是从大到小）
        tradePriceSort: 0, // 上架时间排序（0：从小到大 1是从大到小）
      },
      goodsLength: 0,
    }
  },
  created() {
    this.goodsId = this.$route.query.id
    this.getData()
    this.loadData()
  },
  methods: {
    async getData() {
      const that = this
      const res = await getGoodsDetailes({
        styleId: that.goodsId,
      })
      that.infoData = res.body.resultList
      that.infoData.recommendationLevel = Number(that.infoData.recommendationLevel)
    },
    async loadData() {
      const that = this
      const res = await getProductList({
        ...that.formData,
      })
      that.dataList = res.body.resultList
      that.goodsLength = res.body.resultList.length
    },
    setCarouselItem(index) {
      this.$refs.carousel.setActiveItem(index)
    },
    handleChange(value) {
      console.log(value)
    },
    colorcgId(id) {
      this.sizeId = id
      this.$forceUpdate()
    },
    checkTab(index) {
      console.log(index)
    },
    todetails(id) {
      this.goodsId = id
      this.getData()
      this.$forceUpdate()
    },
  },
}
</script>

<style lang='scss' scoped>
.zt-head{
  margin: 20px 0;
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
      }
      .zt-head__images{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 10px 0;
        .zt-images__left{
          width: 95%;
          display: flex;
          .zt-images__item{
            margin: 0 10px;
            border: 1px solid #ECE8E5;
            border-radius: 5px;
            .zt-images__image{
              width: 80px;
              height: 80px;
            }
          }
        }
        .zt-images__right{
          width: 4%;
          height: 88px;
          line-height: 88px;
          border-radius: 10px;
          background-color: #ccc;
          font-size: 20px;
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
            margin: 0 5px;
            border-radius: 10px;
            border: 1px solid #ECE8E5;
            .el-image{
              width: 80px;
              height: 80px;
              border-radius: 10px;
            }
            .zt-color__name{
              position: absolute;
              bottom: 0;
              width: 100%;
              text-align: center;
              background: #000;
              opacity: .6;
              font-size: 14px;
              border-radius: 0 0 5px 5px;
              color: #fff;
            }
          }
        }
        .zt-data__size{
          display: flex;
          align-items: center;
          margin-top: 20px;
          .zt-size__item{
            // padding: 5px 20px;
            // border: 1px solid #ccc;
            // border-radius: 5px;
            // box-sizing: border-box;
            margin-right: 20px;
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
              width: 200px;
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
        width: 50%;
        line-height: 30px;
        .zt-data2__flex{
          display: flex;
          color: #666;
          .zt-data2__label{
            width: 200px;
            color: #333;
          }
          .zt-data2__info{
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
        }
      }
      .zt-info__item:nth-child(4){
        border-bottom: none;
      }
    }
    .zt-content__data5{
      display: flex;
      align-items: baseline;
      padding: 0 30px;
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
      .zt-content__item{
        width: 230px;
        color: #333333;
        font-size: 14px;
        margin: 0 10px 10px 0;
        border: 1px solid #ECE8E5;
        .zt-good__image{
          width: 230px;
          height: 300px;
          border-radius: 10px;
          border: 1px solid #F2F2F2;
        }
        .zt-item__line{
          display: flex;
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
