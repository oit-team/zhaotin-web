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
        <!-- <el-table
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
        </el-table> -->
        <div class="zt-content">
          <div class="zt-content__item" v-for="(item, index) in orderInfoList" :key="index">
            <div class="zt-cart__title">
              <div class="zt-title__title">{{ item.styleName }}</div>
            </div>
            <div class="zt-cart__line" v-for="(itemN, indexN) in item.style" :key="indexN">
              <el-row :gutter="20">
                <el-col :span="3">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="itemN.imgUrl"
                    fit="contain"
                  />
                </el-col>
                <el-col :span="10">
                  <div class="zt-cart__name">
                    {{ item.styleName }}
                    <p>{{ item.styleNo }}</p>
                  </div>
                </el-col>
                <el-col :span="6"><div class="zt-cart__color">颜色分类：{{ itemN.styleColor }}</div></el-col>
                <el-col :span="3">
                  <el-button type="primary" @click="itemN.openList = !itemN.openList">
                    {{ itemN.openList?'收起':'展开' }}
                    <i v-if="itemN.openList" class="el-icon-caret-bottom el-icon--right"></i>
                    <i v-else class="el-icon-caret-top el-icon--right"></i>
                  </el-button>
                </el-col>
              </el-row>
              <div class="zt-cart__size" v-if="itemN.openList">
                <div class="zt-size__item" v-for="(itemM, indexM) in itemN.styleSize" :key="indexM">
                  <div class="zt-size__size">所选尺码：{{ itemM.sizeName }}</div>
                  <div class="zt-size__size">单价：￥{{ itemN.stylePrice }}</div>
                  <div class="zt-size__size"><el-input-number size="mini" :min="1" v-model="itemM.sizeNumber" /></div>
                  <div class="zt-size__size">小计：￥{{ itemN.stylePrice * itemM.sizeNumber }}</div>
                  <div class="zt-size__size" @click="deleteSize(index,indexN,indexM)">删除</div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
      const that = this
      const con = {
        orderId: that.orderId,
      }
      await getOrderById(con).then((res) => {
        if (res.head.status === 0) {
          that.orderNo = res.body.resultList.orderNo
          that.orderTypeName = res.body.resultList.orderTypeName
          that.orderTime = res.body.resultList.orderTime
          that.orderInfoList = res.body.resultList.orderStyleList
          console.log(that.orderInfoList)
          that.orderInfoList.forEach(e => {
            e.style.forEach(i => {
              that.$set(i, 'openList', true)
            })
          })
          console.log(that.orderInfoList)
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
.zt-content{
  background-color: #f5f5f5;
  // border-radius: 20px;
  padding: 20px 10px;
  margin-top: 40px;
  box-sizing: border-box;
}
.zt-content__item{
  padding: 10px;
  box-sizing: border-box;
  .zt-cart__title{
    display: flex;
    align-items: center;
    .zt-title__title{
      margin: 0 10px;
    }
  }
}
.zt-cart__size{
  width: 100%;
  margin: 10px 0;
}
.zt-size__item{
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 15px 0;
  border-top: 1px solid #ccc;
  box-sizing: border-box;
}
.zt-size__item:hover{
  cursor: pointer;
}
.zt-cart__line{
  padding: 10px 30px;
  padding-bottom: 0;
  width: 100%;
  background: #fff;
  margin: 10px 0;
  box-sizing: border-box;
  .el-row{
    display: flex;
    align-items: center;
  }
  .zt-cart__image{
    width: 100px;
    height: 100px;
    border-radius: 5px;
    border: 1px solid #c9a76e;
  }
  .zt-cart__name{
    p{
      color: #909193;
      font-size: 14px;
    }
  }
  .zt-cart__allPrice{
    color: #c9a76e;
  }
  .zt-cart__set{
    padding: 0 20px;
  }
  .zt-cart__set:hover{
    cursor: default;
  }
}
</style>
