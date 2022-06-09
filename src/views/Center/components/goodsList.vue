<template>
  <div class="zt-page" id="Mpage">
    <div class="zt-tabs__top">
      <!-- <div class="container"> -->
      <Tabs :tab-list="tabList1" :ishome="ishome" @checkTab="checkTab1" />
      <!-- </div> -->
    </div>
    <div class="zt-tabs">
      <div class="zt-tabs__center">
        <Tabs
          :tab-list="tabList"
          :label-text="labelText1"
          @checkTab="checkTab"
        />
        <div class="zt-radio">
          <div class="zt-radio__label">最近一年:</div>
          <!-- <el-radio-group v-model="radio" @change="radioText">
            <el-radio label="1">未下款</el-radio>
            <el-radio label="2">已下款</el-radio>
          </el-radio-group> -->
          <!-- <el-checkbox-group @change="radioText"> -->
          <el-checkbox v-model="radio1" @change="radioText">未下款</el-checkbox>
          <el-checkbox v-model="radio2" @change="radioText">已下款</el-checkbox>
          <!-- </el-checkbox-group> -->
        </div>
      </div>
      <!-- <el-divider /> -->
      <div class="zt-tabs__bottom">
        <div class="zt-bottom__label">排序:</div>
        <div class="zt-bottom__tab">
          <div
            :class="selectB===0?'selectB':'zt-bottom__item'"
            @click="selectItem(0)"
          >默认</div>
          <div
            :class="selectB===1?'selectB':'zt-bottom__item'"
            @click="shouDjiantou = !shouDjiantou,selectItem(1)"
          >
            上架时间
            <i v-if="shouDjiantou" class="el-icon-bottom"></i>
            <i v-else class="el-icon-top"></i>
          </div>
          <!-- <div
            :class="selectB===2?'selectB':'zt-bottom__item'"
            @click="selectItem(2)"
          >
            销量
            <i class="el-icon-top"></i>
          </div> -->
          <div
            :class="selectB===3?'selectB':'zt-bottom__item'"
            @click="priceTF = !priceTF,selectItem(3)"
          >
            价格
            <i v-if="priceTF" class="el-icon-caret-bottom"></i>
            <i v-else class="el-icon-caret-top"></i>
          </div>
          <div class="zt-bottom__price">
            <el-input
              class="zt-Binp"
              size="small"
              placeholder="￥"
              v-model="input1"
            />
            -
            <el-input
              class="zt-Binp"
              size="small"
              placeholder="￥"
              v-model="input2"
            />
            <!-- <div class="zt-price__sub" v-loading.fullscreen.lock="fullscreenLoading" @click="openLoading"> -->
            <div class="zt-price__sub" @click="priceC">
              确定
            </div>
          </div>
        </div>
      </div>
      <el-divider />
    </div>
    <el-empty v-show="showEmp" description="暂无相关数据">
      <div class="nav-r" :class="isTop?'nav-R':''">
        <!-- <div class="addorder zt-flex">
          <i class="el-icon-document-add"></i>
          <div>快速补货</div>
        </div> -->
        <div class="orderCart zt-flex" @click="toCart">
          <i class="el-icon-s-order"></i>
          <div>订货清单</div>
        </div>
        <!-- <div class="service zt-flex">
          <i class="el-icon-chat-line-round"></i>
          <div>在线客服</div>
        </div> -->
        <div class="totop zt-flex" @click="backTop">
          <i class="el-icon-arrow-up"></i>
          <div>返回顶部</div>
        </div>
      </div>
    </el-empty>
    <div class="zt-content" v-loading="fullscreenLoading" v-show="!showEmp" ref="content">
      <div class="nav-r" :class="isTop?'nav-R':''">
        <!-- <div class="addorder zt-flex">
          <i class="el-icon-document-add"></i>
          <div>快速补货</div>
        </div> -->
        <div class="orderCart zt-flex" @click="toCart">
          <i class="el-icon-s-order"></i>
          <div>订货清单</div>
        </div>
        <!-- <div class="service zt-flex">
          <i class="el-icon-chat-line-round"></i>
          <div>在线客服</div>
        </div> -->
        <div class="totop zt-flex" @click="backTop">
          <i class="el-icon-arrow-up"></i>
          <div>返回顶部</div>
        </div>
      </div>
      <div
        class="zt-content__item"
        v-for="(item, index) in dataList"
        :key="index"
        @click="todetails(item.styleId)"
      >
        <el-image
          class="zt-good__image"
          :src="item.resUrl"
          fit="contain"
        />
        <div class="zt-video__b" v-if="item.styleVideo">
          <!-- <i class="el-icon-video-camera-solid"></i> -->
          <i class="iconfont icon-shipin"></i>
        </div>
        <div class="zt-item__line">{{ item.styleName }}</div>
        <div class="zt-item__line">
          <div class="zt-price__l">{{ item.styleNo }}</div>
          <div class="zt-price__r">￥<div class="zt-item__price">{{ item.tradePrice }}</div></div>
        </div>
        <!-- <el-divider /> -->
        <!-- <div class="zt-item__line top-line">已售50000件</div> -->
      </div>
      <el-divider v-if="!isUpdate">已经到底了</el-divider>
    </div>
  </div>
</template>

<script>
import { getProductList } from '@/api/product'
import { getGoodsSizeInfo, getGoodsSizeClass } from '@/api/goods'
import Tabs from '@/components/tabs/tabs'

export default {
  name: 'GoodsList',
  components: {
    Tabs,
  },
  props: {
    inputVal: String,
    // styleLength: String,
  },
  data() {
    return {
      data: {},
      input1: '',
      input2: '',
      tabList1: [],
      dataList: [],
      labelText1: '筛选',
      labelText2: '排序',
      showLabel: false,
      ishome: true,
      bran: sessionStorage.getItem('brandId'),
      Uid: sessionStorage.getItem('userId'),
      selectB: 0,
      goodsLength: 0,
      styleCategory: '',
      goodsId: '',
      formData: {
        styleNo: '', // 商品编号
        pageNum: 1,
        pageSize: 20,
        orderType: '1',
        styleId: '', // 商品id
        styleLength: '', // 商品衣长
        styleCategory: '', // 商品类别dicttimeDisplayName
        endTradePrice: '', // 结束批发价
        startTradePrice: '', // 开始批发价
        startcreatTime: '', // 开始时间
        endcreateTime: '', // 结束时间
        styleName: '', // 商品名称
        styleSearch: '',
        status: '1', // 商品状态
        seriesId: '', // 季节id
        shelfTimeSort: '', // 批发价排序（0：从小到大 1是从大到小）
        tradePriceSort: '', // 上架时间排序（0：从小到大 1是从大到小）
      },
      showEmp: false,
      shouDjiantou: true,
      priceTF: true,
      radio: null,
      radio1: false,
      radio2: false,
      // -----
      fullscreenLoading: false,
      tabList: [],
      // styleLength: '',
      isUpdate: true,
      isTop: false,
    }
  },
  computed: {
  },
  watch: {
    inputVal(val) {
      console.log(val)
    },
    // styleLength(val) {
    //   console.log(val)
    // },
  },
  created() {
    this.loadData()
    this.classData()
    this.classData2()
  },
  mounted() {
    if (this.isUpdate) {
      window.addEventListener('scroll', this.scrollEvent)
    } else {
      window.removeEventListener('scroll', this.scrollEvent)
      this.formData.pageNum = 1
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollEvent)
  },
  methods: {
    async loadData() {
      const that = this
      that.fullscreenLoading = true
      setTimeout(async () => {
        that.fullscreenLoading = false
        that.formData.pageNum = 1
        that.formData.styleSearch = that.inputVal || ''
        const res = await getProductList({
          ...that.formData,
        })
        if (res.body.resultList.length === 0) {
          that.isUpdate = false
          window.removeEventListener('scroll', this.scrollEvent)
          that.showEmp = true
        } else {
          that.isUpdate = true
          window.addEventListener('scroll', this.scrollEvent)
          that.showEmp = false
        }
        that.dataList = res.body.resultList
      }, 1000)
    },
    // 页面 触底加载
    async addData() {
      const that = this
      if (that.isUpdate === true) {
        that.fullscreenLoading = true
        setTimeout(() => {
          that.fullscreenLoading = false
        }, 1000)
        that.formData.pageNum++
        // that.formData.styleLength = that.styleLength || ''
        const res = await getProductList({
          ...that.formData,
        })
        if (res.body.resultList.length === 0) {
          that.isUpdate = false
          window.removeEventListener('scroll', this.scrollEvent)
          that.formData.pageNum = 1
        } else {
          that.isUpdate = true
          that.dataList.push(...res.body.resultList)
          that.$forceUpdate
        }
      }
    },
    scrollEvent() {
      setTimeout(() => {
        if (this.isUpdate) {
          const data = window.innerHeight - this.$refs.content.getBoundingClientRect().y - this.$refs.content.getBoundingClientRect().height
          if (data === 0) {
            this.addData()
            this.$forceUpdate()
          }
          if (this.$refs.content.getBoundingClientRect().y <= 0) {
            this.isTop = true
            this.$forceUpdate
          } else {
            this.isTop = false
            this.$forceUpdate
          }
        }
      }, 500)
    },
    // 二级分类
    async classData() {
      const res = await getGoodsSizeInfo({
        brandId: this.bran,
        userId: this.Uid,
        type: 'STYLE_LENGTH',
      })
      this.tabList = res.body.result
      const all = {
        dicttimeDisplayName: '全部',
        dictitemCode: '',
      }
      this.tabList.unshift(all)
    },
    // 顶部分类
    async classData2() {
      const res = await getGoodsSizeClass({
        dictCode: 'SYSTEM_CONFIG',
      })
      this.tabList1 = res.body.styleCategory
      let number1 = 0
      this.tabList1.forEach(e => {
        number1 += e.countNum
      })
      const all = {
        categoryName: '综合推荐',
        countNum: number1,
      }
      this.tabList1.unshift(all)
    },
    // 点击二级tab
    checkTab(index) {
      const that = this
      let con = ''
      if (index !== 0) {
        con = that.tabList[index].dicttimeDisplayName
      } else {
        con = ''
      }
      that.$nextTick(() => {
        that.formData.styleLength = con
        this.loadData()
        that.$forceUpdate()
      })
    },
    // 点击顶部 tab
    checkTab1(index) {
      const that = this
      let con = ''
      if (index !== 0) {
        con = that.tabList1[index].categoryName
      } else {
        con = ''
      }
      that.$nextTick(() => {
        that.formData.styleCategory = con
        that.loadData()
        that.$forceUpdate()
      })
    },
    selectItem(id) {
      const that = this
      that.selectB = id
      if (id === 0) {
        that.$nextTick(() => {
          that.formData.styleCategory = ''
          that.formData.shelfTimeSort = ''
          that.formData.tradePriceSort = ''
          that.loadData()
          that.$forceUpdate()
        })
      } else if (id === 1 && !this.shouDjiantou) {
        that.$nextTick(() => {
          that.formData.shelfTimeSort = '1'
          that.formData.tradePriceSort = ''
          that.loadData()
          that.$forceUpdate()
        })
      } else if (id === 1 && that.shouDjiantou) {
        that.$nextTick(() => {
          that.formData.shelfTimeSort = '0'
          that.formData.tradePriceSort = ''
          that.loadData()
          that.$forceUpdate()
        })
      } else if (id === 3 && that.priceTF) {
        that.$nextTick(() => {
          that.formData.tradePriceSort = '1'
          that.formData.shelfTimeSort = ''
          that.loadData()
          that.$forceUpdate()
        })
      } else if (id === 3 && !that.priceTF) {
        that.$nextTick(() => {
          that.formData.tradePriceSort = '0'
          that.formData.shelfTimeSort = ''
          that.loadData()
          that.$forceUpdate()
        })
      }
    },
    // 价格筛选  区间
    priceC() {
      this.input1 = this.input1.replace(/\D/g, '')
      this.input2 = this.input2.replace(/\D/g, '')
      if (this.input1 !== '' && this.input2 !== '') {
        if (this.input1 < this.input2) {
          this.formData.startTradePrice = this.input1
          this.formData.endTradePrice = this.input2
          this.loadData()
        } else {
          this.formData.startTradePrice = this.input2
          this.formData.endTradePrice = this.input1
          this.loadData()
        }
      } else {
        this.formData.startTradePrice = ''
        this.formData.endTradePrice = ''
        this.loadData()
      }
    },
    todetails(id) {
      this.$router.push(`/styleCenter/goodsDetails?id=${id}&orderType=${this.formData.orderType}`)
      // this.$router.push({
      //   name: 'goodsDetails',
      //   params: {
      //     id,
      //     orderType: this.formData.orderType,
      //   },
      // })
    },
    toCart() {
      this.$router.push('/styleCenter/shopCart')
    },
    backTop() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop !== 0) {
        window.scrollTo('0', '0')
      }
    },
    radioText(val) {
      if (this.radio1 === this.radio2) {
        this.formData.orderType = '1'
        this.loadData()
      } else if (this.radio1) {
        this.formData.orderType = '2'
        this.loadData()
      } else if (this.radio2) {
        this.formData.orderType = '3'
        this.loadData()
      }
    },
  },
}
</script>

<style lang='scss' scoped>
.zt-page{
  height: 100%;
}
::v-deep .el-loading-spinner{
  left: 50%;
}
.zt-tabs__top{
  width: 100%;
  font-size: 18px;
  background-color: #ECE8E5;
  box-sizing: border-box;
}
.zt-tabs{
  width: 100%;
  font-size: 16px;
  color: #666666;
  .zt-tabs__center{
    display: flex;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    .ct-tabs{
      width: auto;
      margin-right: 50px;
    }
  }
  .zt-tabs__center:hover{
    cursor: pointer;
  }
  .zt-tabs__bottom{
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px 0;
    box-sizing: border-box;
    .zt-bottom__label{
      margin-right: 20px;
    }
    .zt-bottom__tab{
      display: flex;
      align-items: center;
      .zt-bottom__item{
        padding: 0 20px;
      }
      .zt-bottom__item:hover{
        cursor: pointer;
      }
    }
    .zt-bottom__price{
      display: flex;
      align-items: center;
      padding: 10px;
      border: 1px solid #CDA46C;
      border-radius: 30px;
      box-sizing: border-box;
      .zt-Binp{
        width: 120px;
        margin: 0 15px;
      }
      ::v-deep .el-input__inner{
        width: 120px;
        border-radius: 20px;
        border-color: #CDA46C;
      }
      .zt-price__sub{
        width: 70px;
        background-color: #CDA46C;
        color: #fff;
        text-align: center;
        padding: 4px 0;
        border-radius: 20px;
      }
      .zt-price__sub{
        cursor: pointer;
      }
    }
    .selectB{
      padding: 0 20px;
      color: #CDA46C;
    }
    .selectB:hover{
      cursor: pointer;
    }
  }
  ::v-deep .el-divider--horizontal{
    margin: 15px 0;
  }
  .zt-radio{
    display: flex;
    align-items: center;
    .zt-radio__label{
      margin-right: 20px;
    }
  }
  ::v-deep .el-radio{
    font-size: 16px;
  }
  ::v-deep .el-radio__label{
    font-size: 16px;
  }
  ::v-deep .is-checked + .el-radio__label{
    color: #CDA46C;
  }
  ::v-deep .is-checked .el-radio__inner{
    border-color: #CDA46C;
    background: #CDA46C;
  }
  ::v-deep .el-checkbox{
    font-size: 16px;
  }
  ::v-deep .el-checkbox__label{
    font-size: 16px;
  }
  ::v-deep .is-checked + .el-checkbox__label{
    color: #CDA46C;
  }
  ::v-deep .is-checked .el-checkbox__inner{
    border-color: #CDA46C;
    background: #CDA46C;
  }
}
.zt-content{
  position: relative;
  display: flex;
  height: 100%;
  min-height: 50vh;
  flex-wrap: wrap;
  // overflow: auto;
  .zt-content__item:hover{
    cursor: pointer;
  }
  .zt-content__item{
    position: relative;
    width: 230px;
    height: 100%;
    color: #333333;
    font-size: 14px;
    margin: 0 0 10px 15px;
    border: 1px solid #ECE8E5;
    .zt-good__image{
      width: 230px;
      height: 300px;
      border-radius: 10px;
      border: 1px solid #F2F2F2;
    }
    .zt-video__b{
      position: absolute;
      top: 10px;
      right: 10px;
      border-radius: 5px;
      box-sizing: border-box;
      .icon-shipin{
        font-size: 28px;
        color: #FF9606;
      }
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
}
::v-deep .el-empty{
  position: relative;
}
.nav-r{
  position: absolute;
  left: 50%;
  top: 0;
  margin-left: 580px;
  transform: translate(100%, 0px);
  z-index: 100;
}
.nav-R{
  position: fixed;
  // right: 17%;
  top: 10%;
  transform: translate(100%, 0px);
}
.zt-flex{
  text-align: center;
  color: #fff;
  font-size: 14px;
  border-radius: 10px;
  background: linear-gradient(to bottom,#FFB902,#FF9606);
  padding: 5px;
  margin-bottom: 5px;
  white-space: nowrap;
  box-sizing: border-box;
}
.zt-flex:hover{
  cursor: pointer;
}
.el-icon-arrow-up,
.el-icon-chat-line-round,
.el-icon-s-order,
.el-icon-document-add{
  font-size: 30px;
}
.top-line{
  border-top: 1px solid #F2F2F2;
  color: #999999;
}
</style>
