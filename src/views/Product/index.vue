<template>
  <div>
    <HeaderNav />
    <!-- 搜索 -->
    <div class="main ">
      <div class="container border mt-4 p-2">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="商品款号">
            <el-input v-model="formInline.user" placeholder="商品款号" />
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="formInline.user" placeholder="商品名称" />
          </el-form-item>
          <el-form-item label="商品状态">
            <el-input v-model="formInline.user" placeholder="商品状态" />
          </el-form-item>
          <el-form-item label="商品颜色">
            <el-input v-model="formInline.user" placeholder="商品颜色" />
          </el-form-item>
          <el-form-item label="商品类别">
            <el-input v-model="formInline.user" placeholder="商品类别" />
          </el-form-item>
          <el-form-item label="波段/系列">
            <el-select v-model="formInline.region" placeholder="波段/系列">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>
          </el-form-item><br />
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="primary" @click="reset">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 列表 -->
      <div class="container border mt-2 p-2">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          row-style="text-align:center"
        >
          <el-table-column
            fixed
            prop="date"
            label="商品款号"
            sortable
            fit
            width="150"
          />
          <el-table-column
            prop="name"
            label="商品名称"
            sortable
            width="120"
          />
          <el-table-column
            prop="province"
            label="商品状态"
            sortable
            width="120"
          />
          <el-table-column
            prop="city"
            label="商品图片"
            sortable
            width="220"
          />
          <el-table-column
            prop="address"
            label="商品颜色"
            sortable
            width="120"
          />
          <el-table-column
            prop="zip"
            label="商品类别"
            sortable
            width="120"
          />
          <el-table-column
            prop="zip"
            label="季节/波段"
            sortable
            width="120"
          />
          <el-table-column
            prop="zip"
            label="所属系列"
            sortable
            width="120"
          />
          <el-table-column
            fixed="right"
            label="操作"
            width="100"
          >
            <template slot-scope="">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import HeaderNav from '@/views/Layout/components/HeaderNav'
import { reqGetProductList } from '@/api/product'

export default {

  components: {
    HeaderNav,
  },

  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333,
      }],
      formInline: {
        user: '',
        region: '',
      },
      con: {
        styleNo: '',
        pageNum: '1',
        pageSize: '2',

      },
    }
  },
  created() {
    const res = reqGetProductList(this.con)
    console.log(res)
  },
  methods: {
    // handleClick(row) {
    //   console.log(row)
    // },
    onSubmit() {
    },
    reset() {

    },
  },
}
</script>

<style>
.main {
  min-height: 600px;
}
</style>
