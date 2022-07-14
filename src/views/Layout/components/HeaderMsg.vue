<template>
  <div class="container h-12 flex">
    <div class="h-12 flex">
      <div class="mr-2 zt-config">
        <i class="iconfont icon-tongzhi"></i>公告:
      </div>
      <!-- <el-tooltip class="item" effect="light" :content="configT[0]" placement="top-start"> -->
      <div ref="pconfit" class="h-12 flex flex-col justify-center text-yellow-600 leading-8 w-255 zt-config__fig">
        <div ref="configw" class="zt-fig" :style="{ '--mL': mL }">
          {{ configT[0] }}
        </div>
      </div>
      <!-- </el-tooltip> -->
    </div>
    <div class="flex-1 flex items-center px-32">
      <el-input
        v-model="inputVal"
        placeholder="商品名称/款号/面料"
        class="one"
        prefix-icon="el-icon-search"
        @change="cgVal"
      >
        <el-button slot="append" class="search" @click="cgVal(inputVal)">
          搜索
        </el-button>
      </el-input>
    </div>
    <div class="mr-10">
      <!-- <div> -->
      <el-badge :value="listLength" class="item">
        <div class="item-order flex items-center" @click="toCart">
          <i class="el-icon-s-order !text-lg mr-1"></i>
          订货清单
          <!-- <div class="rounded-full text-sm text-stone-50 ml-2 content-center bg-red-500 px-2 h-max">{{ listLength }}</div> -->
        </div>
      </el-badge>
    </div>
  </div>
</template>

<script>
import { getShoppingCart } from '@/api/orderCart'
import { getConfig } from '@/api/product'

export default {
  data() {
    return {
      inputVal: '',
      listLength: 0,
      FormData: {},
      configT: [],
      marginLeft: 0,
      noticeWidth: 0,
      mL: '',
    }
  },
  created() {
    this.getData()
    this.config()
  },
  mounted() {
  },
  methods: {
    async config() {
      const that = this
      const res = await getConfig({})
      that.configT = res.body.announceInfo
      const nm = that.configT[0].length * 16
      that.mL = `${-nm} + 'px'`
      that.$set(that, 'mL', `${-nm}px`)
      // console.log(that.mL)
    },
    cgVal(val) {
      // 优化： 判断当前路由是否是goodsLIst，如果不是才跳转
      if (this.$route.path === '/styleCenter/goodsList') {
        this.$emit('searchVal', val)
      } else {
        this.$router.push('/styleCenter/goodsList')
        this.$emit('searchVal', val)
      }
    },
    toCart() {
      this.$router.push('/styleCenter/shopCart')
      const list = this.$store.state.orderStorage
      if (list)
        this.listLength = list.length
    },
    async getData() {
      const res = await getShoppingCart({})
      this.FormData = res.body.resultList
      this.listLength = this.FormData.styleList.length
      this.$emit('getlength', this.listLength)
    },
  },
}
</script>

<style lang='scss' scoped>
// $marginl: var(--mL);
.one ::v-deep input {
    border-radius: 60px 0 0 60px;
    padding-left: 37px !important;
}
.one ::v-deep .el-icon-search {
  margin-left: 6px;
}
.one ::v-deep .el-input__prefix {
    transform: scale(1.5);
}
.one ::v-deep .el-input-group__append {
  border-radius: 0 60px 60px 0;
  border-color: #CDA46C !important;
  background-color: #CDA46C !important;
}
.one ::v-deep .el-input__inner {
  border-color: #CDA46C !important;
}
.one ::v-deep .search  span{
  color: white;
}
.order-num{
  display: inline-block;
  padding: 5px 7px;
  border-radius: 50%;
  background-color: #CDA46C;
}
.item-order{
  border: 1px solid #ECE8E5;
  padding: 6px 40px;
  color: #CDA46C;
  font-size: 16px;
  border-radius: 30px;
}
.item-order:hover{
  cursor: pointer;
  /* color: #666; */
  border-color: #CDA46C;
}
.icon-tongzhi{
  color: #cca46c;
  font-weight: 800;
  margin-right: 10px;
}
.zt-config{
  display: flex;
  align-items: center;
  color: #CDA46C;
}
.zt-config__fig{
  display: flex;
  white-space: nowrap;
  overflow: hidden;
   /* text-overflow: ellipsis; */
}
.zt-config__fig:hover{
  cursor: pointer;
}
.zt-fig{
  // animation-name: config;
  // animation-duration: 30s;
  // animation-timing-function: linear;
  // animation-iteration-count: infinite;
  // animation-direction: normal;
  -webkit-animation: 30s config linear infinite normal;
  animation: 30s config linear infinite normal;
}
.zt-fig::-webkit-scrollbar {
  display: none;
}
@keyframes config{
  0%{
    margin-left: 0px;
    /* transform: translateX(0px); */
  }
  100%{
    margin-left: var(--mL);
    // margin-left: -1000px;
    /* transform: translateX(-1000px); */
  }
}
.w-255{
  width: 255px;
}
</style>
