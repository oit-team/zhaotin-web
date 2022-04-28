<template>
  <div>
    <div class="zt-tabs">
      <div class="zt-tabs__center">
        <Tabs :tab-list="tabList1" :label-text="labelText1" @checkTab="checkTab" />
      </div>
      <el-divider />
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
        </div>
      </div>
      <el-divider />
    </div>
    <el-empty v-if="showEmp" description="暂无相关数据" />
    <div class="zt-content" v-else>
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
import Tabs from '@/components/tabs/tabs'

export default {
  name: 'GoodsList',
  components: {
    Tabs,
  },
  props: {
    inputVal: String,
    styleLength: String,
  },
  data() {
    return {
      data: {},
      tabList1: [],
      dataList: [],
      labelText1: '分类',
      labelText2: '排序',
      showLabel: false,
      ishome: true,
      bran: sessionStorage.getItem('brandId'),
      Uid: sessionStorage.getItem('userId'),
      selectB: 0,
      goodsLength: 0,
      styleCategory: '',
      goodsId: '',
      pageSize: '20',
      pageNum: 1,
      // inputVal: '',
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
        status: '1', // 商品状态
        seriesId: '', // 季节id
        shelfTimeSort: 0, // 批发价排序（0：从小到大 1是从大到小）
        tradePriceSort: 0, // 上架时间排序（0：从小到大 1是从大到小）
      },
      showEmp: false,
      shouDjiantou: true,
      priceTF: true,
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
  },
  mounted() {
  },
  methods: {
    async loadData() {
      const that = this
      that.formData.styleName = that.inputVal || ''
      that.formData.styleLength = that.styleLength || ''
      const res = await getProductList({
        ...that.formData,
      })
      if (res.body.resultList.length === 0) {
        this.showEmp = true
      } else {
        this.showEmp = false
      }
      that.dataList = res.body.resultList
      that.tabList1 = res.body.styelTypeList
      const all = {
        styleType: '全部',
      }
      this.tabList1.unshift(all)
      that.goodsLength = res.body.resultList.length
    },
    checkTab(index) {
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
      console.log(id)
      if (id === 0) {
        that.$nextTick(() => {
          that.formData.styleCategory = ''
          that.formData.shelfTimeSort = 0
          that.formData.tradePriceSort = 0
          that.loadData()
          that.$forceUpdate()
        })
      } else if (id === 1 && !this.shouDjiantou) {
        that.$nextTick(() => {
          that.formData.shelfTimeSort = 1
          that.loadData()
          that.$forceUpdate()
        })
      } else if (id === 1 && that.shouDjiantou) {
        that.$nextTick(() => {
          that.formData.shelfTimeSort = 0
          that.loadData()
          that.$forceUpdate()
        })
      } else if (id === 3 && that.priceTF) {
        that.$nextTick(() => {
          that.formData.tradePriceSort = 1
          that.loadData()
          that.$forceUpdate()
        })
      } else if (id === 3 && !that.priceTF) {
        that.$nextTick(() => {
          that.formData.tradePriceSort = 0
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
    todetails(id) {
      this.$router.push(`/styleCenter/goodsDetails?id=${id}`)
    },
  },
}
</script>

<style lang='scss' scoped>

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
      .zt-bottom__item{
        padding: 0 20px;
      }
    }
    .selectB{
      padding: 0 20px;
      color: #CDA46C;
    }
  }
}
.zt-content{
  display: flex;
  flex-wrap: wrap;
  .zt-content__item{
    width: 230px;
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
