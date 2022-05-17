<template>
  <div class="zt-page__cart">
    <el-page-header @back="goBack" content="订货清单" />
    <el-empty v-if="showemp" description="暂无数据" />
    <div v-if="!showemp">
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
                  @click="todetails(item.styleId)"
                />
              <!-- </div> -->
              </el-col>
              <el-col :span="10">
                <div class="zt-cart__name">
                  {{ item.styleName }}
                  <p>{{ item.styleNo }}</p>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="zt-cart__color">颜色分类：{{ itemN.styleColor }}</div>
              </el-col>
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
                <div class="zt-size__size"><el-input-number @change="handleChange(index,indexN,indexM)" size="mini" :min="1" v-model="itemM.sizeNumber" /></div>
                <div class="zt-size__size">小计：￥{{ itemN.stylePrice * itemM.sizeNumber }}</div>
                <div class="zt-size__size" @click="deleteSize(index,indexN,indexM)">删除</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="zt-footer" ref="pronbit">
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
            <!-- <p class="zt-hui">本次共选：商品样式(2) 商品尺寸(7)</p> -->
          </div>
          <div class="zt-footer__button" @click="toOrder">
            立即订购
          </div>
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
      showemp: false,
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    // window.addEventListener('scroll', this.handleScrollx, true)
  },
  methods: {
    // handleScrollx() {
    //   console.log('距离顶部高度', this.$refs.pronbit.getBoundingClientRect().bottom)
    // },
    async getData() {
      const that = this
      const res = await getShoppingCart({})
      that.formData = res.body.resultList
      if (res.head.status === 0) {
        if (that.formData.styleList && that.formData.styleList.length === 0) {
          that.showemp = true
          that.$forceUpdate
        } else {
          that.showemp = false
          that.$forceUpdate
        }
      }
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
      // console.log(that.formData.styleList)
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
        // that.priceAll = that.formData.styleTotalPrice
        that.cgpriceAll()
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
      // if (this.checkedAll) {
      this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        // 遍历拿到删除项的商品id styleId 和商品颜色 styleColor
        // 全选 则拿到所有商品的id和颜色
        const list = []
        for (let i = 0; i < this.formData.styleList.length; i++) {
          for (let j = 0; j < this.formData.styleList[i].style.length; j++) {
            if (this.formData.styleList[i].style[j].checked) {
              const styleL = {
                styleId: this.formData.styleList[i].styleId,
                styleColor: this.formData.styleList[i].style[j].id,
              }
              list.unshift(styleL)
            }
          }
        }
        // console.log(list)
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
          this.checkedAll = false
          this.priceAll = 0
          this.$parent.cgcart()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
    },
    goBack() {
      this.$router.go(-1)
    },
    // 数量
    async handleChange(index, indexN) {
      const that = this
      if (that.formData.styleList && that.formData.styleList[index].style[indexN].checked) {
        that.cgpriceAll()
      }
    },
    // 一级选择框 改变
    cggoodsCheck(id) {
      const that = this
      // 改变对应商品 的状态
      if (that.formData.styleList[id].goodsCheck) {
        that.formData.styleList[id].style.forEach(e => {
          that.$set(e, 'checked', true)
        })
      } else {
        that.formData.styleList[id].style.forEach(e => {
          that.$set(e, 'checked', false)
        })
      }
      // 改变父级状态
      const data = that.formData.styleList.filter(e => {
        return e.goodsCheck === false
      })
      if (data.length === 0) {
        that.checkedAll = true
      } else {
        that.checkedAll = false
      }
      that.cgpriceAll()
    },
    async cgpriceAll() {
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
          if (i.checked) {
            i.styleSize.forEach(n => {
              dataL.styleSize.unshift(n)
            })
          }
          list.unshift(dataL)
        })
        // if (dataL.styleSize && dataL.styleSize.length !== 0) {
        //   list.unshift(dataL)
        // } else {
        //   []
        // }
      })
      that.priceList = list
      console.log(list)
      console.log(that.priceList)
      const res = await CalculatePrice({
        styleList: list,
      })
      if (res.head.status === 0) {
        that.priceAll = res.body.styleTotalPrice
      }
      // that.formData.styleList.forEach(e => {
      //   e.style.forEach(i => {
      //     if (i.checked === true) {
      //       that.priceAll += i.styleNumber * i.stylePrice
      //     }
      //   })
      // })
      // }
    },
    //  颜色 check   二级选择框
    itemChecked(id) {
      const that = this
      let num = 0
      // if (that.formData.styleList[id].style[idn].checked) {
      //   that.priceAll += that.formData.styleList[id].style[idn].styleNumber * that.formData.styleList[id].style[idn].stylePrice
      //   console.log(that.priceAll)
      // } else {
      //   that.priceAll -= that.formData.styleList[id].style[idn].styleNumber * that.formData.styleList[id].style[idn].stylePrice
      //   console.log(that.priceAll)
      // }
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
      that.cgpriceAll()
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
          console.log(that.formData.styleList)
          that.formData.styleList[id].style.splice(idn, 1)
          that.$forceUpdate
        }
        if (that.formData.styleList[id].style && that.formData.styleList[id].style.length === 0) {
          console.log(that.formData.styleList)
          that.formData.styleList.splice(id, 1)
          that.$forceUpdate
        }
        console.log(that.formData.styleList)
        const list = []
        if (that.formData.styleList && that.formData.styleList.length !== 0) {
          let dataL = {}
          that.formData.styleList.forEach(e => {
            e.style.forEach(i => {
              // console.log(i)
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
              list.unshift(dataL)
              console.log(list)
            })
            // list.unshift(dataL)
            console.log(list)
            that.priceList = list
            // if (dataL.styleSize && dataL.styleSize.length !== 0) {
            //   list.unshift(dataL)
            // } else {
            //   []
            // }
          })
          that.priceList = list
          that.cgpriceAll()
        } else {
          that.priceList = []
          that.priceAll = 0
        }
        console.log(list)
        const res = await changeShoppingCart({
          styleList: list,
        })
        if (res.head.status === 0) {
          that.$message({
            type: 'success',
            message: '删除成功!',
          })
          that.$parent.cgcart()
          that.checkedAll = false
          that.getData()
        } else {
          that.$message({
            type: 'warning',
            message: res.head.msg,
          })
        }
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
    },
    toOrder() {
      const that = this
      that.formData2 = JSON.parse(JSON.stringify(that.formData))
      const data2 = JSON.parse(JSON.stringify(that.formData2))
      data2.styleList = []
      data2.styleList.length = 0
      // 遍历所有的颜色Array  将所有的颜色集合 {选中} 的颜色都放在data1中
      const data1 = []
      that.formData2.styleList.forEach((item, index) => {
        data1[index] = item
        data1[index].style = item.style.filter(i => {
          return i.checked === true
        })
      })
      // 过滤  data1中的 颜色集合   只拿style中 不为空的  为空代表 该商品一个颜色都没选择
      let data3 = {}
      data3 = data1.filter(item => {
        return item.style.length !== 0
      })
      // console.log(data3)
      data2.styleList = data3
      if (that.priceAll !== 0) {
        // 如果有一个选中
        that.$router.push('/styleCenter/orderGoods')
      } else {
        this.$message({
          message: '请选择需要购买的商品数量',
          type: 'warning',
        })
      }
      that.$store.commit('order/addOrderStorage', data2)
    },
    // 推荐区  图片点击事件
    todetails(id) {
      this.$router.push(`/styleCenter/goodsDetails?id=${id}`)
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
::v-deep .el-page-header__content{
  font-size: 16px;
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
  // position: fixed;
  // bottom: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px;
  background-color: #f6f5f3;
  z-index: 1;
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
    align-items: center;
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
