<template>
  <div>
    <div class="zt-order__title">订货清单</div>
    <!-- <div class="zt-content" v-for="(item, index) in formData.addOrder" :key="index">
      <div class="zt-cart__line">
        <div class="zt-cart__image">
          <el-image
            style="width: 100px; height: 100px"
            :src="item.imageUrl"
            fit="contain"
          />
        </div>
        <div class="zt-cart__name">{{ item.goodsName }}</div>
        <div class="zt-cart__color">{{ item.color }}</div>
        <div class="zt-cart__price">￥{{ item.goodscostPrice }}</div>
        <div class="zt-cart__num">{{ item.goodsNum }}</div>
        <div class="zt-cart__allPrice">￥{{ item.totailPrice }} </div>
        <div class="zt-cart__set">删除</div>
      </div>
    </div> -->
    <div>
      <el-table
        :data="formData.addOrder"
        style="width: 100%"
        ref="multipleTable"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          label="信息"
          width="180">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src=" scope.row.imageUrl"
              fit="contain"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="商品名称"
        >
          <!-- width="180"> -->
          <template slot-scope="scope">
            <p>{{ scope.row.goodsName }}</p>
            <p>{{ scope.row.goodsCode }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="颜色尺寸"
          width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.color }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="单价"
          width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.goodscostPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="数量"
          width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.goodsNum }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="小计"
          width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.totailPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.goodsName }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="zt-footer">
      <div class="zt-footer__left">
        <el-checkbox v-model="checked" @change="toggleSelection">已选</el-checkbox>
        <div class="zt-left__btn"><i class="el-icon-delete"></i>批量删除</div>
      </div>
      <div class="zt-footer__right">
        <div class="zt-footer__price">
          应付总额: <span class="zt-red">$20000</span>
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
      checkAll: false,
      checkedCities: [],
      isIndeterminate: false,
      checked: false,
    }
  },
  created() {
    // this.formData = this.$store.state.order.brforeAddOrder
    this.formData = JSON.parse(sessionStorage.getItem('orderData'))
    console.log(this.formData)
  },
  methods: {
    toggleSelection(val) {
      console.log(val)
      this.$refs.multipleTable.toggleAllSelection()
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
  border-radius: 20px;
}
.zt-cart__line{
  display: flex;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  .zt-cart__image{
    width: 100px;
  }
  .zt-cart__name{
    width: 300px;
    padding: 0 10px;
  }
  .zt-cart__color{
    width: 150px;
    padding: 0 20px;
  }
  .zt-cart__price{
    width: 100px;
    padding: 0 20px;
  }
  .zt-cart__num{
    width: 80px;
    padding: 0 20px;
  }
  .zt-cart__allPrice{
    width: 100px;
    padding: 0 20px;
    color: #c9a76e;
  }
  .zt-cart__set{
    width: 100px;
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
