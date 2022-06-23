<template>
  <div id="Mpage" class="zt-page">
    <div class="zt-tabs__top">
      <Tabs :tab-list="tabList1" :ishome="ishome" @checkTab="checkTab1" />
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
          <el-checkbox v-model="radio1" @change="radioText">未下款</el-checkbox>
          <el-checkbox v-model="radio2" @change="radioText">已下款</el-checkbox>
        </div>
      </div>
      <div class="zt-tabs__bottom">
        <div class="zt-bottom__label">排序:</div>
        <div class="zt-bottom__tab">
          <div
            :class="selectB===0?'selectB':'zt-bottom__item'"
            @click="selectItem(0)"
          >
            默认
          </div>
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
              v-model="input1"
              class="zt-Binp"
              size="small"
              placeholder="￥"
            />
            -
            <el-input
              v-model="input2"
              class="zt-Binp"
              size="small"
              placeholder="￥"
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
    <div class="relative">
      <div class="nav-r" ref="nav-r">
        <div class="orderCart zt-flex" @click="toCart">
          <el-badge :value="styleLength" class="item">
            <div>
              <i class="el-icon-s-order"></i>
              <div>订货清单</div>
            </div>
          </el-badge>
        </div>
        <div class="totop zt-flex" @click="backTop">
          <i class="el-icon-arrow-up"></i>
          <div>返回顶部</div>
        </div>
      </div>
      <el-empty v-show="showEmp" description="暂无相关数据" />
      <div v-show="!showEmp" v-loading="fullscreenLoading" ref="content" class="zt-content">
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
            <i class="iconfont icon-shipin"></i>
          </div>
          <div class="zt-item__line">{{ item.styleName }}</div>
          <div class="zt-item__line flex">
            <div class="zt-price__l">{{ item.styleNo }}</div>
            <div class="zt-price__r">
              ￥
              <div class="zt-item__price">{{ item.tradePrice }}</div>
            </div>
          </div>
          <!-- <el-divider /> -->
          <!-- <div class="zt-item__line top-line">已售50000件</div> -->
        </div>
      </div>
    </div>
    <LoadMore @load="load" ref="loadMore" first-load v-show="!showEmp && !fullscreenLoading">
      <template #default="scope">
        <el-divider v-if="scope.next">加载更多</el-divider>
        <el-divider v-if="scope.loading"><i class="el-icon-loading text-xl"></i></el-divider>
        <el-divider v-if="scope.done">已经到底了</el-divider>
        <el-divider v-if="scope.fail">加载失败，请重试</el-divider>
      </template>
    </LoadMore>
  </div>
</template>

<script>
import { getProductList } from '@/api/product'
import { getGoodsSizeInfo, getGoodsSizeClass } from '@/api/goods'
import Tabs from '@/components/tabs/tabs'
import LoadMore from '@/components/business/LoadMore'

export default {
  name: 'GoodsList',
  components: {
    Tabs,
    LoadMore,
  },
  props: {
    inputVal: String,
    styleLength: [String, Number],
  },
  data() {
    return {
      input1: '',
      input2: '',
      tabList1: [],
      dataList: [],
      labelText1: '筛选',
      labelText2: '排序',
      ishome: true,
      selectB: 0,
      styleCategory: '',
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
      // isUpdate: true,
      // isTop: false,
    }
  },
  computed: {},
  watch: {
  },
  created() {
    this.classData()
    this.classData2()
  },
  methods: {
    load($state) {
      if (this.formData.pageNum === 1) {
        this.fullscreenLoading = true
      }
      this.formData.styleSearch = this.inputVal || ''
      getProductList({
        ...this.formData,
      }).then(res => {
        const result = res.body.resultList
        if (this.formData.pageNum === 1) {
          this.dataList = result
          this.showEmp = !this.dataList.length
        } else {
          this.dataList.push(...result)
        }

        this.dataList.length >= res.body.totalCount ? $state.done() : $state.next()
        this.formData.pageNum++
      }).catch(() => {
        $state.fail()
      }).finally(() => {
        this.fullscreenLoading = false
      })
    },
    reLoad() {
      this.formData.pageNum = 1
      this.$refs.loadMore.reset().load()
      // this.$refs.loadMore.load()
    },
    // 二级分类
    async classData() {
      const res = await getGoodsSizeInfo({
        brandId: sessionStorage.getItem('brandId'),
        userId: sessionStorage.getItem('userId'),
        type: 'STYLE_LENGTH',
      })
      this.tabList = res.body.result
      const all = {
        dicttimeDisplayName: '全部',
        dictitemCode: '',
      }
      this.tabList.unshift(all)
    },
    // 获取顶部分类列表
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
      console.log(this.tabList1)
    },
    // 点击二级tab
    checkTab(index) {
      let con = ''
      if (index !== 0) {
        con = this.tabList[index].dicttimeDisplayName
      } else {
        con = ''
      }
      this.$nextTick(() => {
        this.showEmp = false
        this.formData.styleLength = con
        this.reLoad()
      })
    },
    // 点击顶部 tab
    checkTab1(index) {
      let con = ''
      if (index !== 0) {
        con = this.tabList1[index].categoryName
      } else {
        con = ''
      }
      this.$nextTick(() => {
        this.showEmp = false
        this.formData.styleCategory = con
        this.reLoad()
      })
    },
    selectItem(id) {
      this.selectB = id
      if (id === 0) {
        this.$nextTick(() => {
          this.formData.shelfTimeSort = ''
          this.formData.tradePriceSort = ''
          this.reLoad()
        })
      } else if (id === 1 && !this.shouDjiantou) {
        this.$nextTick(() => {
          this.formData.shelfTimeSort = '1'
          this.formData.tradePriceSort = ''
          this.reLoad()
        })
      } else if (id === 1 && this.shouDjiantou) {
        this.$nextTick(() => {
          this.formData.shelfTimeSort = '0'
          this.formData.tradePriceSort = ''
          this.reLoad()
        })
      } else if (id === 3 && this.priceTF) {
        this.$nextTick(() => {
          this.formData.tradePriceSort = '1'
          this.formData.shelfTimeSort = ''
          this.reLoad()
        })
      } else if (id === 3 && !this.priceTF) {
        this.$nextTick(() => {
          this.formData.tradePriceSort = '0'
          this.formData.shelfTimeSort = ''
          this.reLoad()
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
          this.reLoad()
        } else {
          this.formData.startTradePrice = this.input2
          this.formData.endTradePrice = this.input1
          this.reLoad()
        }
      } else {
        this.formData.startTradePrice = ''
        this.formData.endTradePrice = ''
        this.reLoad()
      }
    },
    todetails(id) {
      this.$router.push(`/styleCenter/goodsDetails?id=${id}&orderType=${this.formData.orderType}`)
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
    // 最近一年
    radioText() {
      if (this.radio1 === this.radio2) {
        this.formData.orderType = '1'
        this.reLoad()
      } else if (this.radio1) {
        this.formData.orderType = '2'
        this.reLoad()
      } else if (this.radio2) {
        this.formData.orderType = '3'
        this.reLoad()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.zt-page {
  height: 100%;
}

::v-deep .el-loading-spinner {
  left: 50%;
}

.zt-tabs__top {
  font-size: 16px;
  box-sizing: border-box;
  width: 100%;
  background-color: #ECE8E5;
}

.zt-tabs {
  font-size: 16px;
  width: 100%;
  color: #666666;

  .zt-tabs__center {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;

    .ct-tabs {
      width: auto;
      margin-right: 50px;
    }
  }

  .zt-tabs__center:hover {
    cursor: pointer;
  }

  .zt-tabs__bottom {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 10px 0;

    .zt-bottom__label {
      margin-right: 20px;
    }

    .zt-bottom__tab {
      display: flex;
      align-items: center;

      .zt-bottom__item {
        padding: 0 20px;
      }

      .zt-bottom__item:hover {
        cursor: pointer;
      }
    }

    .zt-bottom__price {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: 10px;
      border: 1px solid #CDA46C;
      border-radius: 30px;

      .zt-Binp {
        width: 120px;
        margin: 0 15px;
      }

      ::v-deep .el-input__inner {
        width: 120px;
        border-color: #CDA46C;
        border-radius: 20px;
      }

      .zt-price__sub {
        width: 70px;
        padding: 4px 0;
        text-align: center;
        color: #fff;
        border-radius: 20px;
        background-color: #CDA46C;
      }

      .zt-price__sub {
        cursor: pointer;
      }
    }

    .selectB {
      padding: 0 20px;
      color: #CDA46C;
    }

    .selectB:hover {
      cursor: pointer;
    }
  }

  ::v-deep .el-divider--horizontal {
    margin: 15px 0;
  }

  .zt-radio {
    display: flex;
    align-items: center;

    .zt-radio__label {
      margin-right: 20px;
    }
  }

  ::v-deep .el-radio {
    font-size: 16px;
  }

  ::v-deep .el-radio__label {
    font-size: 16px;
  }

  ::v-deep .is-checked + .el-radio__label {
    color: #CDA46C;
  }

  ::v-deep .is-checked .el-radio__inner {
    border-color: #CDA46C;
    background: #CDA46C;
  }

  ::v-deep .el-checkbox {
    font-size: 16px;
  }

  ::v-deep .el-checkbox__label {
    font-size: 16px;
  }

  ::v-deep .is-checked + .el-checkbox__label {
    color: #CDA46C;
  }

  ::v-deep .is-checked .el-checkbox__inner {
    border-color: #CDA46C;
    background: #CDA46C;
  }
}

.zt-content {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  min-height: 50vh;
  .zt-content__item:hover {
    cursor: pointer;
  }

  .zt-content__item {
    font-size: 14px;
    position: relative;
    width: 232px;
    height: 100%;
    margin: 0 0 10px 15px;
    color: #333333;
    border-radius: 5px;
    border: 1px solid #ECE8E5;

    .zt-good__image {
      width: 230px;
      height: 300px;
      border-bottom: 1px solid #F2F2F2;
    }

    .zt-video__b {
      position: absolute;
      top: 10px;
      right: 10px;
      box-sizing: border-box;
      border-radius: 5px;

      .icon-shipin {
        font-size: 28px;
        color: #FF9606;
        border-radius: 5px;
        background-color: #fff;
      }
    }

    .zt-item__line {
      // display: flex;
      overflow: hidden;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 8px 14px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .zt-price__l {
      color: #FF0000;
    }

    .zt-price__r {
      display: flex;
      align-items: baseline;
      color: #FF0000;
    }

    .zt-item__price {
      font-size: 24px;
      color: #FF0000;
    }
  }
}

.nav-r {
  position: sticky;
  top: 100px;
  width: 70px;
  height: 0;
  float: right;
  transform: translateX(140%);
}

.zt-flex {
  font-size: 14px;
  box-sizing: border-box;
  margin-bottom: 5px;
  padding: 5px;
  text-align: center;
  white-space: nowrap;
  color: #fff;
  border-radius: 10px;
  background: linear-gradient(to bottom, #FFB902, #FF9606);
}

.zt-flex:hover {
  cursor: pointer;
}

.el-icon-arrow-up,
.el-icon-chat-line-round,
.el-icon-s-order,
.el-icon-document-add {
  font-size: 30px;
}

.top-line {
  color: #999999;
  border-top: 1px solid #F2F2F2;
}
</style>
