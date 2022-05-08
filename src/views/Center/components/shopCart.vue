<template>
  <div class="zt-page__cart">
    <el-page-header @back="goBack" content="订货清单" />
    <div class="zt-order__title">订货清单</div>
    <div class="zt-content">
      <div class="zt-content__item" v-for="(item, index) in formData.styleList" :key="index">
        <!-- 一级选择框 -->
        <div class="zt-cart__title">
          <el-checkbox v-model="item.goodsCheck" @change="cggoodsCheck(index)" />
          <div class="zt-title__title">{{ item.styleName }}</div>
        </div>
        <div class="zt-cart__line" v-for="(itemN, indexN) in item.style" :key="indexN">
          <el-row :gutter="20">
            <!-- 二级选择框 -->
            <el-col :span="2">
              <el-checkbox v-model="itemN.checked" :span="2" @change="itemChecked(index, indexN)" />
            </el-col>
            <el-col :span="3">
            <!-- <div class="zt-cart__image"> -->
              <el-image
                style="width: 100px; height: 100px"
                :src="itemN.imgUrl"
                fit="contain"
              />
            <!-- </div> -->
            </el-col>
            <el-col :span="10">
              <div class="zt-cart__name">
                {{ item.styleName }}
                <p>{{ item.styleNo }}</p>
              </div>
            </el-col>
            <el-col :span="6"><div class="zt-cart__color">颜色分类：{{ itemN.styleColor }}</div></el-col>
            <!-- <el-col :span="5"><div class="zt-cart__color"></div></el-col> -->
            <!-- <el-col :span="4">
              <div class="zt-cart__color">总计：￥{{ itemN.stylePrice * itemN.styleNumber }}</div>
            </el-col> -->
            <el-col :span="3">
              <!-- <el-button type="primary">收起</el-button> -->
              <el-button type="primary" @click="itemN.openList = !itemN.openList">
                {{ itemN.openList?'收起':'展开' }}
                <i v-if="itemN.openList" class="el-icon-caret-bottom el-icon--right"></i>
                <i v-else class="el-icon-caret-top el-icon--right"></i>
              </el-button>
            </el-col>
            <!-- <el-col :span="2"><div class="zt-cart__set" @click="deleteOrder(index,indexN)">删除</div></el-col> -->
          </el-row>
          <!-- <div class="zt-cart__size"> -->
          <div class="zt-cart__size" v-if="itemN.openList">
            <div class="zt-size__item" v-for="(itemM, indexM) in itemN.styleSize" :key="indexM">
              <div class="zt-size__size">所选尺码：{{ itemM.sizeName }}</div>
              <div class="zt-size__size">单价：￥{{ itemN.stylePrice }}</div>
              <div class="zt-size__size"><el-input-number @change="handleChange(index,indexN,indexM)" size="mini" :min="1" v-model="itemM.sizeNumber" /></div>
              <div class="zt-size__size">小计：￥{{ itemN.stylePrice * itemM.sizeNumber }}</div>
              <div class="zt-size__size" @click="deleteSize(index,indexN,indexM)">删除</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="zt-footer">
      <div class="zt-footer__left">
        <el-checkbox
          v-model="checkedAll"
          @change="toggleSelection"
        >全选</el-checkbox>
        <div class="zt-left__btn" @click="deleteAll"><i class="el-icon-delete"></i>批量删除</div>
      </div>
      <div class="zt-footer__right">
        <div class="zt-footer__price">
          应付总额: <span class="zt-red">￥{{ priceAll }}</span>
          <p class="zt-hui">本次共选：商品样式(2) 商品尺寸(7)</p>
        </div>
        <div class="zt-footer__button" @click="toOrder">
          立即订购
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getShoppingCart,
  deleteShoppingCart,
  changeShoppingCart,
  CalculatePrice,
} from '@/api/orderCart'

export default {
  name: 'ShopCart',
  data() {
    return {
      formData: {},
      formData2: {},
      checkedAll: false,
      priceAll: 0,
      checked: false,
      checkOrders: [],
      priceList: [],
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const that = this
      const res = await getShoppingCart({})
      that.formData = res.body.resultList
      that.formData.styleList.forEach(e => {
        e.styleNumber = Number(e.styleNumber)
        that.$set(e, 'goodsCheck', false)
        e.style.forEach(i => {
          that.$set(i, 'openList', true)
          that.$set(i, 'checked', false)
          i.styleNumber = Number(i.styleNumber)
          i.styleSize.forEach(j => {
            j.sizeNumber = Number(j.sizeNumber)
          })
        })
      })
      that.formData2 = JSON.parse(JSON.stringify(that.formData))
    },
    // 下面  的 全选
    toggleSelection(val) {
      const that = this
      if (val) {
        that.formData.styleList.forEach(e => {
          e.goodsCheck = true
          e.style.forEach(i => {
            i.checked = true
          })
        })
        that.priceAll = that.formData.styleTotalPrice
      } else {
        that.formData.styleList.forEach(e => {
          e.goodsCheck = false
          e.style.forEach(i => {
            i.checked = false
          })
        })
        that.priceAll = 0
      }
    },
    deleteAll() {
      if (this.checkedAll) {
        this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async () => {
          // 遍历拿到删除项的商品id styleId 和商品颜色 styleColor
          // 全选 则拿到所有商品的id和颜色
          const list = []
          for (let i = 0; i < this.formData.styleList.length; i++) {
            console.log(this.formData.styleList[i].styleId)
            // styleL.styleId = this.formData.styleList[i].styleId
            for (let j = 0; j < this.formData.styleList[i].style.length; j++) {
              const styleL = {
                styleId: this.formData.styleList[i].styleId,
                styleColor: this.formData.styleList[i].style[j].id,
              }
              list.unshift(styleL)
              // styleL.styleColor =
            }
          }
          const res = await deleteShoppingCart({
            shoppingCartId: this.formData.id,
            styleList: list,
          })
          if (res.head.status === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
            this.getData()
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
      }
    },
    goBack() {
      this.$router.go(-1)
    },
    handleChange() {
      const that = this
      that.chPrice()
    },
    // 一级选择框 改变
    cggoodsCheck(id) {
      const that = this
      // 改变对应商品 的状态，以及计算总价
      if (that.formData.styleList[id].goodsCheck) {
        that.formData.styleList[id].style.forEach(e => {
          that.$set(e, 'checked', true)
        })
      } else {
        that.formData.styleList[id].style.forEach(e => {
          that.$set(e, 'checked', false)
        })
      }
      let nm = 0
      that.formData.styleList.forEach(e => {
        if (e.goodsCheck) {
          return nm++
        }
      })
      if (nm === that.formData.styleList.length) {
        that.$nextTick(() => {
          that.checkedAll = true
        })
      } else {
        that.$nextTick(() => {
          that.checkedAll = false
        })
      }
      that.cgpriceAll()
    },
    async chPrice() {
      const that = this
      const list = []
      let dataL = {}
      that.formData.styleList.forEach(e => {
        e.style.forEach(i => {
          dataL = {
            styleId: i.styleId,
            styleNo: e.styleNo,
            styleColor: i.id,
            styleSize: [],
          }
          i.styleSize.forEach(n => {
            dataL.styleSize.unshift(n)
            console.log(dataL)
          })
        })
        if (dataL.styleSize && dataL.styleSize.length !== 0) {
          list.unshift(dataL)
        } else {
          []
        }
      })
      const res = await CalculatePrice({
        styleList: list,
      })
      console.log(res)
      if (res.head.status === 0) {
        that.priceAll = res.body.styleList.styleTotalPrice
      }
      that.priceList = list
      const data = await changeShoppingCart({
        styleList: list,
      })
      if (res.head.status === 0) {
        that.$message({
          type: 'success',
          message: '修改成功!',
        })
        that.getData()
      } else {
        that.$message({
          type: 'error',
          message: '修改失败!',
        })
      }
      that.getData()
    },
    cgpriceAll() {
      const that = this
      if (that.checkedAll === true) {
        that.priceAll = that.formData.styleTotalPrice
      } else {
        that.formData.styleList.forEach(e => {
          e.style.forEach(i => {
            if (i.checked === true) {
              that.priceAll += i.styleNumber * i.stylePrice
            }
          })
        })
      }
    },
    //  颜色 check   二级选择框
    itemChecked(id, idn) {
      const that = this
      let num = 0
      if (that.formData.styleList[id].style[idn].checked) {
        that.priceAll += that.formData.styleList[id].style[idn].styleNumber * that.formData.styleList[id].style[idn].stylePrice
        console.log(that.priceAll)
      } else {
        that.priceAll -= that.formData.styleList[id].style[idn].styleNumber * that.formData.styleList[id].style[idn].stylePrice
        console.log(that.priceAll)
      }
      // 获取 当前商品 下的 颜色是不是都选中了
      that.formData.styleList[id].style.forEach(e => {
        if (e.checked) {
          return num++
        }
      })
      if (that.formData.styleList[id].style && num === that.formData.styleList[id].style.length) {
        that.$set(that.formData.styleList[id], 'goodsCheck', true)
      } else {
        that.$set(that.formData.styleList[id], 'goodsCheck', false)
      }
      let n = 0
      that.formData.styleList.forEach(e => {
        if (e.goodsCheck) {
          return n++
        }
      })
      if (that.formData.styleList && n === that.formData.styleList.length) {
        that.checkedAll = true
      } else {
        that.checkedAll = false
      }
    },
    // 删除 尺码
    deleteSize(id, idn, idm) {
      const that = this
      this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        that.formData.styleList[id].style[idn].styleSize.splice(idm, 1)
        if (that.formData.styleList[id].style[idn].styleSize && that.formData.styleList[id].style[idn].styleSize.length === 0) {
          that.formData.styleList[id].style.splice(idn, 1)
          that.$forceUpdate
        }
        if (that.formData.styleList[id].style && that.formData.styleList[id].style.length === 0) {
          that.formData.styleList.splice(id, 1)
          that.$forceUpdate
        }
        const list = []
        let dataL = {}
        that.formData.styleList.forEach(e => {
          e.style.forEach(i => {
            dataL = {
              styleId: i.styleId,
              styleNo: e.styleNo,
              styleColor: i.id,
              styleSize: [],
            }
            i.styleSize.forEach(n => {
              dataL.styleSize.unshift(n)
              console.log(dataL)
            })
          })
          if (dataL.styleSize && dataL.styleSize.length !== 0) {
            list.unshift(dataL)
          } else {
            []
          }
        })
        console.log(list)
        that.priceList = list
        const res = await changeShoppingCart({
          styleList: list,
        })
        console.log(res)
        if (res.head.status === 0) {
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          this.getData()
        }
        this.$message({
          type: 'error',
          message: '删除失败!',
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
    },
    toOrder() {
      const that = this
      that.formData.styleList.forEach((e, ide) => {
        e.style.forEach((i, idi) => {
          console.log(that.formData2.styleList[ide])
          if (i.checked === false && that.formData2.styleList) {
            that.formData2.styleList[ide].style.splice(idi, 1)
            if (that.formData2.styleList[ide].style && that.formData2.styleList[ide].style.length === 0) {
              that.formData2.styleList.splice(ide, 1)
            }
          }
        })
      })
      if (that.formData2.styleList && that.formData2.styleList.length !== 0) {
        // 如果有一个选中
        that.$router.push('/styleCenter/orderGoods')
      } else {
        this.$message({
          message: '请选择下单商品',
          type: 'warning',
        })
      }
      console.log(that.formData2)
      that.$store.commit('order/addOrderStorage', that.formData2)
    //   this.$store.commit('order/addOrderStorage', JSON.stringify(this.orderData))
    },
  },
}
</script>

<style lang='scss' scoped>
.zt-page__cart{
  padding: 20px 0;
  box-sizing: border-box;
}
.zt-order__title{
  padding: 20px;
  color: #c9a76e;
  font-weight: 800;
  box-sizing: border-box;
}
.zt-content{
  background-color: #f5f5f5;
  // border-radius: 20px;
  padding: 20px 10px;
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
// .el-collapse-item__header{
//   background-color: none !important;
//   height: auto !important;
// }
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
    // width: 300px;
    // padding: 0 10px;
    p{
      color: #909193;
      font-size: 14px;
    }
  }
  .zt-cart__color{
    // width: 150px;
    // padding: 0 20px;
  }
  .zt-cart__price{
    // width: 100px;
    // padding: 0 20px;
  }
  .zt-cart__num{
    // width: 100px;
    // padding: 0 20px;
  }
  .zt-cart__allPrice{
    // width: 100px;
    // padding: 0 20px;
    color: #c9a76e;
  }
  .zt-cart__set{
    // width: 100px;
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
  padding: 20px;
  background-color: #f6f5f3;
  .zt-footer__left{
    display: flex;
    align-items: center;
    // padding: 20px;
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
  .zt-footer__right{
    display: flex;
    text-align: right;
    font-size: 14px;
    .zt-red{
      font-size: 20px;
      font-weight: 800;
      color: #FF0000;
    }
    .zt-hui{
      color: #666;
    }
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
</style>
