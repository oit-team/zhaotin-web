<template>
  <div>
    <HeaderNav class="mb-4" />
    <div class="main container">
      <div class="">
        <el-page-header
          @back="$router.back()"
        />
        <div class="flex justify-between px-14">
          <div class=" font-extrabold text-xl">订单编号：{{ orderNo }}</div>
          <div class="font-extrabold text-xl">下单时间: {{ orderTime }}</div>
          <div class="font-extrabold text-xl">订单类型: {{ orderTypeName }}</div>
        </div>
        <el-table
          :data="orderInfoList"
          style="width: 100%"
          class="font-extrabold text-xl"
          cell-class-name="testclass"
          :cell-style="cellStyle"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <div class="flex container flex-wrap ml-4">
                <div v-for="item in props.row.style" :key="item.id" label-position="left" inline class="flex items-center justify-center">
                  <div>
                    <div class="border border-solid border-gray-300 flex items-center"><img class="w-32 h-44" :src="item.imgUrl" alt="" /></div>
                  </div>
                  <div class="flex flex-col items-center">
                    <div>
                      <span>{{ item.styleColor }}</span>
                    </div>
                    <div class="" v-for="items in item.styleSize" :key="items.index">
                      <span>尺码*数量: {{ items.sizeName }} * {{ items.sizeNumber }}</span>
                    </div>
                    <div class="" v-for="items in item.styleSize" :key="items.index">
                      <span>尺码*数量: {{ items.sizeName }} * {{ items.sizeNumber }}</span>
                    </div>
                  </div>
                </div>
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
      </div>
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
      orderNo: '',
      orderTime: '',
      orderTypeName: '',
      orderInfoList: [],
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
        // console.log(res)
        if (res.head.status === 0) {
          this.orderNo = res.body.resultList.orderNo
          this.orderTypeName = res.body.resultList.orderTypeName
          this.orderTime = res.body.resultList.orderTime
          this.orderInfoList = res.body.resultList.orderStyleList
        }
      })
    },
    cellStyle({ columnIndex }) {
      if ([2, 3].includes(columnIndex)) {
        return {
          color: 'red',
        }
      }
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
    margin-bottom: 5px;
  }
  /deep/.el-form-item  {
    margin-bottom: 0;
  }
  /deep/ .font-extrabold {
    width: auto;
  }
  /deep/.el-page-header__left .el-icon-back {
    font-size: 26px;
  }
  /deep/.el-page-header__title {
    font-size: 22px;
    margin: 28px 0;
   line-height: 22px;
  }
</style>
