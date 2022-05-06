<template>
  <div>
    <div class="main container">
      <!-- <div>商品中心</div> -->
      <div class="h-96"><el-cascader
    v-model="value"
    :options="options"></el-cascader></div>
      <!-- 出口 -->
      <router-view />
    </div>
  </div>
</template>

<script>
// import TablePage from '@/components/business/TablePage'
import { getProductList } from '@/api/product'

export default {
  name: 'Style',
  components: {
    // TablePage,
  },
  data() {
    return {
      data: {},
       value: [],
       options:[
         {
          value: 'zhinan',
          label: '指南',
          children:[{
            value: 'shejiyuanze',
            label: '设计原则',
          }]
         }
       ]
    }
  },

  methods: {

  },

}
</script>

<style>

</style>
