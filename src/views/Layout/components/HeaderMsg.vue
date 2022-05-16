<template>
  <div class="container h-12 flex">
    <div class="h-12 flex">
      <div class="mr-2 zt-config"><i class="iconfont icon-tongzhi"></i></div>
      <el-tooltip class="item" effect="light" :content="configT[0]" placement="top-start">
        <!-- underline -->
        <div class="h-12 flex flex-col justify-center text-yellow-600 leading-8 w-255 zt-config__fig">
          <!-- <el-carousel
            indicator-position="none"
            arrow="never"
            :interval="5000"
            height="50px"
          >
            <el-carousel-item v-for="item in 2" :key="item">
              <div class="zt-fig">公告：{{ configT[0] }}</div>
            </el-carousel-item>
          </el-carousel> -->
          <!-- <div class="" :style="'margin-left:' + marginLeft + 'px'" ref="configw">公告：{{ configT[0] }}</div> -->
          <div class="zt-fig" ref="configw">公告：{{ configT[0] }}</div>
        </div>
      </el-tooltip>
    </div>
    <div class="flex-1 flex items-center px-32">
      <el-input
        placeholder="商品名称/款号/面料"
        v-model="inputVal"
        class="one"
        prefix-icon="el-icon-search"
        @change="cgVal"
      >
        <el-button class="search" slot="append" @click="cgVal(inputVal)">搜索</el-button>
      </el-input>
    </div>
    <div class="w-60 flex items-center">
      <el-badge :value="listLength" class="item">
        <!-- <el-button icon="el-icon-s-order" @click="toCart" plain round>订货清单</el-button> -->
        <div class="item-order" @click="toCart"><i class="el-icon-s-order"></i>订货清单</div>
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
    }
  },
  created() {
    this.getData()
    this.config()
  },
  mounted() {
    this.con()
  },
  methods: {
    async config() {
      const res = await getConfig({})
      this.configT = res.body.announceInfo
      this.$nextTick(() => {
        console.log(this.configT[0].length)
      })
      // console.log(this.configT.length)
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
      if (list) {
        this.listLength = list.length
        this.$forceUpdate
      }
    },
    async getData() {
      const that = this
      const res = await getShoppingCart({})
      that.FormData = res.body.resultList
      that.listLength = that.FormData.styleList.length
    },
    con() {
      // setInterval(() => {
      //   this.marginLeft -= 1
      // }, 100)
      // console.log(this.$refs.configw)
      console.log(this.configT.length)
    },
  },
}
</script>

<style>
.one input {
    border-radius: 60px;
    padding-left: 37px !important;
}
.one .el-icon-search {
  margin-left: 6px;
}
.one .el-input__prefix {
    transform: scale(1.5);
}
.one .el-input-group__append {
  border-radius: 0 60px 60px 0;
  border-color: #CDA46C !important;
  background-color: #CDA46C !important;
}
.one .el-input__inner {
  border-color: #CDA46C !important;
}
.one .search  span{
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
}
.zt-config{
  display: flex;
  align-items: center;
}
.zt-config__fig{
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.zt-config__fig:hover{
  cursor: pointer;
}
.zt-fig{
  animation-name: config;
  animation-duration: 30s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: normal;
}
@keyframes config{
  0%{
    margin-left: 0px;
    /* transform: translateX(0px); */
  }
  /* 25%{
    margin-left: -500px;
  } */
  /* 50%{
    /* margin-left: -1000px;
    transform: translateX(-1000px);
  } */
  /* 75%{
    margin-left: -500px;
  } */
  100%{
    margin-left: -1000px;
    /* transform: translateX(-1000px); */
  }
}
.w-255{
  width: 255px;
}
</style>
