<template>
  <div>
    <HeaderNav class="mb-4" />
    <div class="main container">
      <el-table
        :data="orderInfoList"
        style="width: 100%"
        class="font-extrabold text-xl"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="flex container flex-wrap ml-4">
              <el-form v-for="item in props.row.style" :key="item.id" label-position="left" inline class="font-extrabold text-3xl flex items-center justify-center">
                <el-form-item>
                  <div class="w-36 h-44 border border-solid border-gray-300 flex items-center"><img :src="item.imgUrl" alt="" /></div>
                </el-form-item>
                <div class="flex flex-col mt-8">
                  <el-form-item>
                    <span>商品颜色: {{ item.styleColor }}</span>
                  </el-form-item>
                  <el-form-item class="" v-for="items in item.styleSize" :key="items">
                    <span>尺码*数量: {{ items.sizeName }} * {{ items.sizeNumber }}</span>
                  </el-form-item>
                  <el-form-item class="" v-for="items in item.styleSize" :key="items">
                    <span>尺码*数量: {{ items.sizeName }} * {{ items.sizeNumber }}</span>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="商品名称"
          prop="styleName"
        />
        <el-table-column
          label="商品单价"
          prop="stylePrice"
        />
        <el-table-column
          label="商品总价"
          prop="styleTotal"
        />
        <el-table-column
          label="商品总数"
          prop="styleNumber"
        />
      </el-table>
      <!-- 出口 -->
      <router-view />
    </div>
  </div>
</template>

<script>
import HeaderNav from '@/views/Layout/components/HeaderNav'
import { getOrderById } from '@/api/order'

export default {
  components: {
    HeaderNav,
  },
  data() {
    return {
      orderId: '', // 订单编号
      orderInfoList: [],
      orderMsg: [], // 基本信息
    }
  },
  created() {
    if (this.$route.query.item) {
      this.orderId = this.$route.query.item.row.orderId
      this.orderInfo()
    }
  },
  methods: {
    // 获取订单详情数据
    async orderInfo() {
      const con = {
        orderId: this.orderId,
      }
      await getOrderById(con).then((res) => {
        if (res.head.status === 0) {
          this.orderInfoList = res.body.resultList.orderStyleList
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
  /deep/.el-table .el-table__cell  {
    padding: 25px 0;
  }
  /deep/.el-table th.el-table__cell > .cell {
    font-size: 16px;
  }
  /deep/.el-table .cell {
    font-size: 15px;
  }
  /deep/.el-form--inline .el-form-item {
    width: 138px;
  }
  /deep/.font-extrabold {
    width: 310px;
  }
  /deep/.el-table td.el-table__cell div {
    margin-left: 10px;
    // display: flex;
    // height: auto;
  }
</style>
