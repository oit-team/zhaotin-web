<template>
  <div>
    <HeaderNav class="mb-4" />
    <div class="main container">
      <!-- 头部 -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <el-page-header
            @back="$router.back()"
            content="订单详情"
          />
          <div>
            <el-button class="!text-amber-500" v-if="isUpdate && $route.query.item.row.orderState !== 2" type="text" @click="sett">{{ isSet?'完成':'修改' }}</el-button>
            <el-divider v-if="isUpdate && $route.query.item.row.orderState !== 2" direction="vertical" />
            <el-button class="!text-rose-500" v-if="isUpdate && $route.query.item.row.orderState !== 2" type="text" @click="deleteOrder">取消订单</el-button>
            <el-divider v-if="isUpdate && $route.query.item.row.orderState !== 2" direction="vertical" />
            <el-button type="text" @click="getNote">修改记录</el-button>
          </div>
        </div>
        <div class="flex justify-between px-14 zt-head">
          <div class="font-extrabold">单号：{{ orderNo }}</div>
          <div class="font-extrabold">下单时间: {{ orderTime }}</div>
          <div class="font-extrabold">订单类型: {{ orderTypeName }}</div>
          <div class="font-extrabold">件数: {{ Numb }}件</div>
          <div class="font-extrabold" v-show="!isSet">总金额: <span class="zt-red">￥{{ priceAll }}</span></div>
          <div class="font-extrabold flex" v-show="isSet">
            总金额:
            <el-input v-model="priceAll" class="ml-2" size="mini" placeholder="￥" />
          </div>
        </div>
        <!-- ----- -->
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
                    @click="todetails(item, item.styleId)"
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
                    <i v-show="itemN.openList" class="el-icon-caret-bottom el-icon--right"></i>
                    <i v-show="!itemN.openList" class="el-icon-caret-top el-icon--right"></i>
                  </el-button>
                </el-col>
              </el-row>
              <div class="zt-cart__size" v-if="itemN.openList">
                <div class="zt-size__item" v-for="(itemM, indexM) in itemN.styleSize" :key="indexM">
                  <div class="zt-size__size">所选尺码：{{ itemM.sizeName }}</div>
                  <div class="zt-size__size">单价：￥{{ itemN.stylePrice }}</div>
                  <div class="zt-size__size" v-show="!isSet">x {{ itemM.sizeNumber }}</div>
                  <div class="zt-size__size" v-show="isSet">
                    <el-input-number size="small" v-model="itemM.sizeNumber" @change="handleChange(index)" :min="1" />
                  </div>
                  <div class="zt-size__size">小计：￥{{ itemN.stylePrice * itemM.sizeNumber }}</div>
                  <div class="zt-size__size" v-show="isSet" @click="deleteSize(index,indexN,indexM)">删除</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="zt-footer">
          <div class="zt-footer__left">
            <p>下单原因：<span>{{ dataInfo.orderReason || '无' }}</span></p>
            <p>备注：<span>{{ dataInfo.orderNote || '无' }}</span></p>
          </div>
          <div class="zt-footer__right">
            <p>收货人：<span>{{ dataInfo.consignee || '无' }}</span>{{ ' ' }}{{ dataInfo.consigneePhone || '' }}</p>
            <p>寄送地址：<span>{{ dataInfo.consigneeAddress || '无' }}</span></p>
          </div>
        </div>
      </div>

      <!-- 出口 -->
      <router-view />
    </div>
    <el-drawer
      title="提交修改"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
      :wrapper-closable="false"
      ref="drawerSet"
    >
      <div class="demo-drawer__content">
        <el-form :model="bValidateForm" class="flex-1" ref="bValidateForm" label-width="60px">
          <el-form-item
            label="原因"
            prop="cause"
            :rules="[{
              required: true, message: '请输入修改原因'
            }]"
          >
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入修改原因"
              v-model="bValidateForm.cause"
            />
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer flex">
          <el-button @click="cancelForm" class="flex-1">取 消</el-button>
          <el-button type="primary" @click="confirmSet" class="flex-1" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>
    <el-drawer
      title="订单修改日志"
      :visible.sync="drawerNote"
      :direction="direction"
      ref="drawerNote"
      wrapper-closable
    >
      <div v-if="updateRecord.length === 0">
        <el-empty description="暂无修改" />
      </div>
      <div v-else>
        <div v-for="item in updateRecord" class="mb-4 text-sm" :key="item.recordId">
          <div class="flex justify-between">
            <p>操作人：{{ item.operationName || '无' }}</p><p>{{ item.operationTime }}</p>
          </div>
          <div v-if="item.operationType !== 1">
            <p class="my-2"><span class="text-red-600">修改前数据：</span>{{ item.beforeModificationData }}</p>
            <p class="my-2"><span class="text-blue-500">修改后数据：</span>{{ item.afterModificationData }}</p>
          </div>
          <div v-else>
            <p class="my-2 text-red-600">取消订单</p>
          </div>
          <p>修改原因：{{ item.orderDescribe }}</p>
          <el-divider class="!my-2" />
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import HeaderNav from '@/views/Layout/components/HeaderNav'
import { getOrderById, updateOrder, getOrderUpdateRecord } from '@/api/order'
import {
  CalculatePrice,
} from '@/api/orderCart'

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
      Numb: 0,
      priceAll: 0,
      dataInfo: {},
      isSet: false,
      priceList: [],
      drawer: false,
      direction: 'rtl',
      drawerNote: false,
      textarea: '', // 修改订单原因
      bValidateForm: {
        cause: '',
      },
      loading: false,
      updateRecord: [], // 修改记录
      isUpdate: false,
    }
  },
  created() {
    if (this.$route.query.stype && this.$route.query.stype === 'update' && this.$route.query.item.row.orderState !== '2') {
      this.isUpdate = true
    }
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
          that.dataInfo = res.body.resultList
          that.orderNo = res.body.resultList.orderNo
          that.orderTypeName = res.body.resultList.orderTypeName
          that.orderTime = res.body.resultList.orderTime
          that.orderInfoList = res.body.resultList.orderStyleList
          that.priceAll = res.body.resultList.totalOrderAmount
          that.orderInfoList.forEach(e => {
            e.style.forEach(i => {
              that.$set(i, 'openList', true)
              i.styleSize.forEach(item => {
                that.Numb += Number(item.sizeNumber + 0)
              })
            })
          })
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
    // 图片点击事件
    todetails(item, id) {
      if (item.status === 0) {
        this.$message.warning('该商品未上架')
        return false
      }
      this.$router.push(`/styleCenter/goodsDetails?id=${id}`)
    },
    // 取消订单
    deleteOrder() {
      this.$confirm('是否取消该订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const con = {
          orderId: this.orderId,
          orderNo: this.orderNo,
          isCancel: '1',
        }
        updateOrder(con).then(() => {
          this.$message.success('取消订单成功')
          setTimeout(() => {
            this.$router.back()
          }, 1000)
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    // 计算总价
    async cgpriceAll() {
      const that = this
      const list = []
      let dataL = {}
      that.orderInfoList.forEach(e => {
        e.style.forEach(i => {
          dataL = {
            styleId: i.styleId,
            styleNo: e.styleNo,
            styleColor: i.id,
            styleSize: [],
          }
          i.styleSize.forEach(n => {
            dataL.styleSize.unshift(n)
          })
          list.unshift(dataL)
        })
      })
      that.priceList = list
      const res = await CalculatePrice({
        styleList: list,
      })
      if (res.head.status === 0) {
        that.priceAll = res.body.styleTotalPrice
      }
    },
    // 数量改变
    async handleChange() {
      this.Numb = 0
      this.orderInfoList.forEach(e => {
        e.style.forEach(i => {
          i.styleSize.forEach(item => {
            this.Numb += Number(item.sizeNumber + 0)
          })
        })
      })
      this.cgpriceAll()
    },
    // 点击修改
    sett() {
      if (this.isSet) {
        this.drawer = true
      } else {
        this.isSet = true
      }
    },
    // 抽屉 -- 取消
    cancelForm() {
      this.loading = false
      this.drawer = false
    },
    // 修改  提交按钮
    confirmSet() {
      this.$refs.drawerSet.closeDrawer()
    },
    // 关闭--抽屉  --之前
    handleClose(done) {
      this.$refs.bValidateForm.validate((valid) => {
        if (valid) {
          this.$confirm('是否提交当前修改？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            const con = {
              orderId: this.orderId,
              totalOrderAmount: this.priceAll,
              isCancel: '0',
              orderDescribe: this.bValidateForm.cause,
              orderNo: this.orderNo,
              styleList: this.priceList,
            }
            updateOrder(con).then(() => {
              this.$message.success('修改成功')
              setTimeout(() => {
                done()
                this.isSet = false
              }, 1000)
            }).catch(() => {
            })
          }).catch(() => {
            done()
          })
        } else {
          return false
        }
      })
    },
    // 获取修改日志
    getNote() {
      const con = {
        orderNo: this.orderNo,
      }
      getOrderUpdateRecord(con).then((res) => {
        this.updateRecord = JSON.parse(JSON.stringify(res.body.resultList))
      })
      this.drawerNote = true
    },
    // 删除 尺码
    deleteSize(id, idn, idm) {
      const that = this
      this.$confirm('是否删除该尺码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        that.orderInfoList[id].style[idn].styleSize.splice(idm, 1)
        const list = []
        let dataL = {}
        that.orderInfoList.forEach(e => {
          e.style.forEach(i => {
            dataL = {
              styleId: i.styleId,
              styleNo: e.styleNo,
              styleColor: i.id,
              styleSize: [],
            }
            i.styleSize.forEach(n => {
              dataL.styleSize.unshift(n)
            })
            list.unshift(dataL)
          })
          that.priceList = list
        })
        that.priceList = list
        that.cgpriceAll()
      }).catch(() => {
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
  /deep/.font-extrabold {
    font-weight: 400;
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
    font-size: 16px;
  }
  /deep/.el-page-header__title {
    font-size: 16px;
    margin: 28px 0;
    line-height: 22px;
  }
  /deep/.el-card__body{
    padding-bottom: 0;
  }
  ::v-deep .el-drawer__body{
    padding: 20px;
  }
  /deep/.el-page-header__content {
    display: flex;
    align-items: center;
    font-size: 16px;
    margin: 28px 0;
    line-height: 22px;
  }
  .zt-head ::v-deep .el-input--mini{
    width: auto;
  }
.zt-content{
  background-color: #f5f5f5;
  // border-radius: 20px;
  padding: 20px 10px;
  margin-top: 15px;
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
.zt-footer{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 16px;
  padding: 0 20px;
  background-color: #f6f5f3;
  .zt-footer__left{
    // display: flex;
    align-items: center;
    padding: 10px 0;
    line-height: 30px;
    box-sizing: border-box;
    .zt-left__btn{
      border: 1px solid #c9a76e;
      color: #c9a76e;
      text-align: center;
      padding: 5px 30px;
      margin: 0 20px;
      border-radius: 30px;
      box-sizing: border-box;
      .el-icon-delete{
        color: #c9a76e;
      }
    }
    .zt-left__btn:hover{
      cursor: pointer;
    }
  }
  .zt-red{
    font-size: 20px;
    font-weight: 800;
    color: #FF0000;
  }
  .zt-hui{
    color: #666;
  }
  .zt-footer__right{
    // display: flex;
    align-items: center;
    padding: 10px 0;
    line-height: 30px;
    box-sizing: border-box;
    .zt-footer__button{
      padding: 15px 50px;
      background-color: #cda46c;
      margin-left: 20px;
      border-radius: 30px;
      font-size: 18px;
      color: #fff;
      box-sizing: border-box;
    }
    .zt-footer__button:hover{
      cursor: pointer;
    }
  }
}
.demo-drawer__content{
  display: flex;
  flex-direction: column;
  height: 100%;
}
.zt-red{
  color: #FF0000;
}
</style>
