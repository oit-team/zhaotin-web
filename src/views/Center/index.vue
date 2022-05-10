<template>
  <div>
    <HeaderNav class="mb-4" />
    <HeaderMsg @searchVal="searchVal" ref="msg" />
    <div class="container main">
      <router-view :input-val="VAL" :style-length="styleLength" ref="child" />
    </div>
  </div>
</template>

<script>
import HeaderNav from '@/views/Layout/components/HeaderNav'
// import { getGoodsSizeInfo } from '@/api/goods'
import HeaderMsg from '../Layout/components/HeaderMsg'
import Tabs from '../../components/tabs/tabs'

export default {
  components: {
    HeaderNav,
    HeaderMsg,
    Tabs,
  },
  data() {
    return {
      tabList: [],
      ishome: true,
      bran: sessionStorage.getItem('brandId'),
      Uid: sessionStorage.getItem('userId'),
      styleLength: '',
      VAL: '',
    }
  },
  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
        // ({
        //   // token: JSON.parse(localStorage.getItem('token')),
        //   userId: sessionStorage.getItem('userId'),
        // }),
        // actions: [
        //   {
        //     name: '导出数据',
        //     type: 'primary',
        //     click: () => this.$refs.export.open(),
        //   },
        // ],
        table: {
          // data: this.data.resultList,
        },
        pager: {
          // total: this.data.totalCount,
        },
      }
    },
  },
  created() {
  },
  methods: {
    searchVal(val) {
      console.log(val)
      const that = this
      that.VAL = val || ''
      that.$nextTick(() => {
        that.$refs.child.loadData()
        that.$forceUpdate()
      })
    },
    cgcart() {
      this.$refs.msg.getData()
    },
  },
}
</script>

<style lang="less" scoped>
</style>
