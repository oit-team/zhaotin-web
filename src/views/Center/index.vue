<template>
  <div>
    <HeaderNav class="mb-4" />
    <HeaderMsg ref="msg" @searchVal="searchVal" @getlength="getstyleLength" />
    <div class="container main">
      <router-view ref="child" :input-val="VAL" :style-length="styleLength" />
    </div>
  </div>
</template>

<script>
import HeaderMsg from '../Layout/components/HeaderMsg'
import HeaderNav from '@/views/Layout/components/HeaderNav'

export default {
  components: {
    HeaderNav,
    HeaderMsg,
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
  methods: {
    searchVal(val) {
      this.VAL = val || ''
      this.$nextTick(() => {
        this.$refs.child.reLoad()
      })
    },
    cgcart() {
      this.$refs.msg.getData()
    },
    getstyleLength(val) {
      this.styleLength = val
    },
  },
}
</script>

<style lang="less" scoped>
</style>
