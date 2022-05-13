<template>
  <div class="zt-page">
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
      </div>
      <!-- <el-divider /> -->
      <div class="zt-tabs__bottom">
        <div class="zt-bottom__label">排序</div>
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
    <el-empty v-if="showEmp" description="暂无相关数据" />
    <!-- <div
      class="zt-content"
      v-else
      v-infinite-scroll="addData"
      infinite-scroll-delay="3000"
      infinite-scroll-distance="0"
    > -->
    <div class="zt-content" v-loading="fullscreenLoading" v-else ref="content">
      <!-- :class="goodsLength>=5?'zt-content__item_margin':''" -->
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
          <i class="el-icon-video-camera-solid"></i>
        </div>
        <div class="zt-item__line">{{ item.styleName }}</div>
        <div class="zt-item__line">
          <div class="zt-price__l">{{ item.styleNo }}</div>
          <div class="zt-price__r">￥<div class="zt-item__price">{{ item.tradePrice }}</div></div>
        </div>
        <!-- <el-divider /> -->
        <!-- <div class="zt-item__line top-line">已售50000件</div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { getProductList } from '@/api/product'
import { getGoodsSizeInfo } from '@/api/goods'
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
        styleId: '', // 商品id
        styleLength: '', // 商品衣长
        styleCategory: '', // 商品类别
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
      // -----
      fullscreenLoading: false,
      tabList: [],
      styleLength: '',
      isUpdate: true,
    }
  },
  computed: {
  },
  watch: {
    inputVal(val) {
      console.log(val)
    },
    styleLength(val) {
      console.log(val)
    },
  },
  created() {
    this.loadData()
    this.classData()
  },
  mounted() {
    if (this.isUpdate && this.$route.path === '/styleCenter/goodsList') {
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
      setTimeout(() => {
        that.fullscreenLoading = false
      }, 1000)
      that.formData.pageNum = 1
      that.formData.styleSearch = that.inputVal || ''
      that.formData.styleLength = that.styleLength || ''
      const res = await getProductList({
        ...that.formData,
      })
      if (res.body.resultList.length === 0) {
        that.isUpdate = false
        that.showEmp = true
      } else {
        that.isUpdate = true
        that.showEmp = false
      }
      that.dataList = res.body.resultList
      that.tabList1 = res.body.styelTypeList
      let number1 = 0
      that.tabList1.forEach(e => {
        number1 += e.categoryNumber
      })
      const all = {
        styleType: '全部',
        categoryNumber: number1,
      }
      that.tabList1.unshift(all)
      that.goodsLength = res.body.resultList.length
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
        console.log(that.formData)
        that.formData.styleLength = that.styleLength || ''
        const res = await getProductList({
          ...that.formData,
        })
        if (res.body.resultList.length === 0) {
          that.isUpdate = false
          that.$message.warning('已经到底了')
          // that.$message('bu')
          that.formData.pageNum = 1
        } else {
          that.isUpdate = true
          that.dataList.push(...res.body.resultList)
          console.log(that.dataList)
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
        }
      }, 500)
    },
    // 顶部分类
    async classData() {
      const res = await getGoodsSizeInfo({
        brandId: this.bran,
        userId: this.Uid,
        type: 'STYLE_LENGTH',
      })
      this.tabList = res.body.result
      const all = {
        dicttimeDisplayName: '综合推荐',
        dictitemCode: '',
      }
      this.tabList.unshift(all)
      // const styleL = this.tabList[0].dicttimeDisplayName
      // this.styleLength = styleL
    },
    checkTab(index) {
      const that = this
      let styleL = ''
      if (index !== 0) {
        styleL = that.tabList[index].dicttimeDisplayName
      }
      that.styleLength = styleL
      that.$nextTick(() => {
        // that.$refs.child.loadData()
        this.loadData()
        that.$forceUpdate()
      })
    },
    checkTab1(index) {
      const that = this
      let cla = ''
      if (index !== 0) {
        cla = that.tabList1[index].styleType
      }
      that.$nextTick(() => {
        that.formData.styleCategory = cla
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
          that.formData.shelfTimeSort = 1
          that.formData.tradePriceSort = ''
          that.loadData()
          that.$forceUpdate()
        })
      } else if (id === 1 && that.shouDjiantou) {
        that.$nextTick(() => {
          that.formData.shelfTimeSort = 0
          that.formData.tradePriceSort = ''
          that.loadData()
          that.$forceUpdate()
        })
      } else if (id === 3 && that.priceTF) {
        that.$nextTick(() => {
          that.formData.tradePriceSort = 1
          that.formData.shelfTimeSort = ''
          that.loadData()
          that.$forceUpdate()
        })
      } else if (id === 3 && !that.priceTF) {
        that.$nextTick(() => {
          that.formData.tradePriceSort = 0
          that.formData.shelfTimeSort = ''
          that.loadData()
          that.$forceUpdate()
        })
      }
    },
    // searchVal(val) {
    //   this.VAL = val
    //   console.log(val)
    //   this.classData()
    // },
    // 价格筛选  区间
    priceC() {
      this.input1 = this.input1.replace(/\D/g, '')
      this.input2 = this.input2.replace(/\D/g, '')
      console.log(this.input1)
      console.log(this.input2)
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
      this.$router.push(`/styleCenter/goodsDetails?id=${id}`)
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
    padding: 10px 0;
    box-sizing: border-box;
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
}
.zt-content{
  display: flex;
  height: 100%;
  flex-wrap: wrap;
  overflow: auto;
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
.top-line{
  border-top: 1px solid #F2F2F2;
  color: #999999;
}
</style>
