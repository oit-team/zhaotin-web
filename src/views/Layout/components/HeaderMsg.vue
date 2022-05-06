<template>
  <div class="container h-24 flex">
    <div class="h-24 flex">
      <div class="inline-block mt-5 mr-2">标</div>
      <div class="h-24 flex flex-col justify-center text-yellow-600 leading-8 underline">
        <div class="">公告：因疫情应，部分地区延迟配送</div>
        <div>消息：本期新品将于2022年4月1日发售</div>
      </div>
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
      <!-- <el-input
        placeholder=""
        prefix-icon="el-icon-s-order"
        class="one"
      /> -->
      <!-- <el-button round icon="el-icon-s-order">
        订货清单
        <span class="order-num">0</span>
      </el-button> -->
      <el-badge :value="listLength" class="item">
        <el-button icon="el-icon-s-order" @click="toCart" plain round>订货清单</el-button>
      </el-badge>
    </div>
  </div>
</template>

<script>
import { getShoppingCart } from '@/api/orderCart'

export default {
  data() {
    return {
      inputVal: '',
      listLength: 0,
      FormData: {},
    }
  },
  created() {
    this.getData()
  },
  methods: {
    show() {
      // console.log(1)
    },
    cgVal(val) {
      // 优化： 判断当前路由是否是goodsLIst，如果不是才跳转
      this.$router.push('/styleCenter/goodsList')
      this.$emit('searchVal', val)
    },
    toCart() {
      this.$router.push('/styleCenter/shopCart')
      const list = this.$store.state.orderStorage
      if (list) {
        this.listLength = list.length
        this.$forceUpdate
      }
      console.log(this.listLength)
    },
    async getData() {
      const that = this
      const res = await getShoppingCart({})
      that.FormData = res.body.resultList
      that.listLength = that.FormData.styleList.length
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
  border-color: #eab308 !important;
  background-color: #eab308 !important;
}
.one .el-input__inner {
  border-color: #eab308 !important;
}
.one .search  span{
  color: white;
}
.order-num{
  display: inline-block;
  padding: 5px 7px;
  border-radius: 50%;
  background-color: #cca46c;
}
</style>
