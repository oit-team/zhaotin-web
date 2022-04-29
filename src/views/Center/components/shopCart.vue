<template>
  <div>
    <el-page-header @back="goBack" content="订购清单" />
    <div class="zt-order__title">订货清单</div>
    <div class="zt-content">
      <div class="zt-content__item" v-for="(item, index) in formData" :key="index">
        <div class="zt-cart__title">
          <el-checkbox v-model="item.goodsCheck" @change="cggoodsCheck(index)" />
          <div class="zt-title__title">{{ item.goodsName }}</div>
        </div>
        <div class="zt-cart__line" v-for="(itemN, indexN) in item.goodsList" :key="indexN">
          <el-row :gutter="20">
            <el-col :span="1">
              <el-checkbox v-model="itemN.checked" :span="2" @change="itemChecked(indexN)" />
            </el-col>
            <!-- <el-col :span="3"> -->
            <div class="zt-cart__image">
              <el-image
                style="width: 100px; height: 100px"
                :src="itemN.imageUrl"
                fit="contain"
              />
            </div>
            <!-- </el-col> -->
            <el-col :span="5"><div class="zt-cart__name">
              {{ item.goodsName }}
              <p>{{ item.goodsCode }}</p>
            </div></el-col>
            <el-col :span="10"><div class="zt-cart__color">颜色分类：{{ itemN.color }}</div></el-col>
            <!-- <el-col :span="5"><div class="zt-cart__color"></div></el-col> -->
            <el-col :span="3">
              <el-button type="primary" @click="itemN.openSize = !itemN.openSize">点击展开</el-button>
            </el-col>
            <el-col :span="2"><div class="zt-cart__set" @click="deleteOrder(index,indexN)">删除</div></el-col>
          </el-row>
          <div class="zt-cart__size" v-if="item.openSize">
            <div class="zt-size__item" v-for="(itemM, indexM) in itemN.sizeList" :key="indexM">
              <div class="zt-size__size">所选尺码：{{ itemM.goodsSizeName }}</div>
              <div class="zt-size__size">单价：￥{{ itemM.goodsPrice }}</div>
              <div class="zt-size__size"><el-input-number size="mini" min="1" v-model.number="itemM.goodsNum" /></div>
              <div class="zt-size__size">￥{{ itemM.totailPrice }}</div>
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
        >已选</el-checkbox>
        <div class="zt-left__btn"><i class="el-icon-delete"></i>批量删除</div>
      </div>
      <div class="zt-footer__right">
        <div class="zt-footer__price">
          应付总额: <span class="zt-red">￥{{ priceAll }}</span>
          <p class="zt-hui">本次共选：商品样式(2) 商品尺寸(7)</p>
        </div>
        <div class="zt-footer__button">
          立即订购
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShopCart',
  data() {
    return {
      formData: [],
      formData2: [],
      checkedAll: false,
      priceAll: 0,
      checkedCities: [],
      checked: false,
      checkOrders: [],
    }
  },
  created() {
    // this.formData = this.$store.state.order.brforeAddOrder
    this.formData2 = JSON.parse(sessionStorage.getItem('orderData'))
    this.formData = this.$store.state.order.orderStorage
    this.formData.forEach(e => {
      e.openSize = false
    })
    let nm = 0
    this.formData.forEach(e => {
      if (e.goodsCheck) {
        return nm++
      }
    })
    if (nm === this.formData.length) {
      this.checkedAll = true
      this.$forceUpdate
    }
  },
  methods: {
    toggleSelection(val) {
      const that = this
      console.log(that.checkedAll)
      if (val) {
        that.formData.forEach(e => {
          e.goodsCheck = true
          e.goodsList.forEach(i => {
            i.checked = true
            that.priceAll += i.totailPrice
          })
        })
      } else {
        that.formData.forEach(e => {
          e.goodsCheck = false
          e.goodsList.forEach(i => {
            i.checked = false
          })
        })
        that.priceAll = 0
      }
    },
    goBack() {
      this.$router.go(-1)
    },
    cggoodsCheck(id) {
      const that = this
      // 改变对应商品 的状态，以及计算总价
      if (that.formData[id].goodsCheck) {
        that.formData[id].goodsList.forEach(e => {
          that.priceAll += e.totailPrice
          e.checked = true
        })
      } else {
        that.formData[id].goodsList.forEach(e => {
          that.priceAll -= e.totailPrice
          e.checked = false
        })
      }
      let nm = 0
      that.formData.forEach(e => {
        if (e.goodsCheck) {
          return nm++
        }
      })
      console.log(that.formData.length === nm)
      if (nm === that.formData.length) {
        that.$nextTick(() => {
          that.checkedAll = true
        })
      } else {
        that.$nextTick(() => {
          that.checkedAll = false
        })
      }
    },
    //  颜色 check
    itemChecked(val) {
      console.log(val)
    },
    // 删除颜色
    deleteOrder(id, idn) {
      console.log(id, idn)
      this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.formData[id].goodsList.splice(idn, 1)
        if (this.formData[id].goodsList.length === 0) {
          this.formData.splice(id, 1)
        }
        this.$message({
          type: 'success',
          message: '删除成功!',
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
      // 改变vuex
      console.log(this.formData[id])
    },
    // 删除尺码
    deleteSize(id, idn, idm) {
      this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.formData[id].goodsList[idn].sizeList.splice(idm, 1)
        if (this.formData[id].goodsList[idn].sizeList.length === 0) {
          this.formData[id].goodsList.splice(idn, 1)
        } else if (this.formData[id].goodsList.length === 0) {
          this.formData.splice(id, 1)
        }
        this.$message({
          type: 'success',
          message: '删除成功!',
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
    },
  },
}
</script>

<style lang='scss' scoped>
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
  padding: 20px 0;
  border-top: 1px solid #ccc;
  box-sizing: border-box;
}
.zt-cart__line{
  padding: 10px 30px;
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
    padding: 0 10px;
  }
  .zt-cart__color{
    // width: 150px;
    padding: 0 20px;
  }
  .zt-cart__price{
    // width: 100px;
    padding: 0 20px;
  }
  .zt-cart__num{
    // width: 100px;
    padding: 0 20px;
  }
  .zt-cart__allPrice{
    // width: 100px;
    padding: 0 20px;
    color: #c9a76e;
  }
  .zt-cart__set{
    // width: 100px;
    padding: 0 20px;
  }
}
.zt-footer{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #f6f5f3;
  .zt-footer__left{
    display: flex;
    align-items: center;
    padding: 20px;
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
  }
}
</style>
