<template>
  <div>
    <HeaderNav class="mb-4" />
    <HeaderMsg @searchVal="searchVal" />
    <div class="zt-tabs__top">
      <div class="container">
        <Tabs
          :tab-list="tabList"
          :ishome="ishome"
          @checkTab="checkTab"
        />
      </div>
    </div>
    <div class="container main">
      <router-view :input-val="VAL" :style-length="styleLength" ref="child" />
    </div>
  </div>
</template>

<script>
import HeaderNav from '@/views/Layout/components/HeaderNav'
import { getGoodsSizeInfo } from '@/api/goods'
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
      VAL: '',
      styleLength: '',
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
    this.classData()
  },
  methods: {
    // 顶部分类
    async classData() {
      const res = await getGoodsSizeInfo({
        brandId: this.bran,
        userId: this.Uid,
        type: 'STYLE_LENGTH',
      })
      this.tabList = res.body.result
      const all = {
        dicttimeDisplayName: '综合推荐',
        dictitemCode: '',
      }
      this.tabList.unshift(all)
      // const styleL = this.tabList[0].dicttimeDisplayName
      // this.styleLength = styleL
    },
    checkTab(index) {
      const that = this
      let styleL = ''
      if (index !== 0) {
        styleL = that.tabList[index].dicttimeDisplayName
      }
      that.styleLength = styleL
      that.$nextTick(() => {
        that.$refs.child.loadData()
        that.$forceUpdate()
      })
    },
    searchVal(val) {
      const that = this
      that.VAL = val.trim()
      that.$nextTick(() => {
        that.$refs.child.loadData()
        that.$forceUpdate()
      })
    },
  },
}
</script>

<style lang="less" scoped>
.zt-tabs__top{
  width: 100%;
  font-size: 18px;
  background-color: #ECE8E5;
  box-sizing: border-box;
}
</style>
