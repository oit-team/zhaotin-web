<template>
  <div class="w-full py-10 overflow-x-hidden">
    <div class="header flex justify-center mb-5">
      <div class="flex items-center mr-10">
        <div class="text-sm">
          可用积分
        </div>
        <el-divider direction="vertical" />
        <div class="text-xl text-red-700">
          {{ userIntegral || 0 }}
        </div>
      </div>
      <div class="flex items-center">
        <el-input
          v-model="searchInput"
          placeholder="商品名称"
          class="one w-40"
          prefix-icon="el-icon-search"
          @change="cgVal"
        >
          <el-button slot="append" class="search" @click="cgVal(inputVal)">
            搜索
          </el-button>
        </el-input>
      </div>
    </div>
    <div class="tabs flex">
      <Tabs :tab-list="goodsCategory" :show-drop="false" :ishome="ishome" @check-tab="checkTab1" />
    </div>

    <el-divider />

    <!-- 商品  展示  区 -->
    <div v-loading="fullscreenLoading" class="relative">
      <div ref="nav-r" class="nav-r">
        <div class="totop zt-flex" @click="backTop">
          <i class="el-icon-arrow-up"></i>
          <div>返回顶部</div>
        </div>
      </div>
      <el-empty v-show="showEmp" description="暂无相关数据" />
      <div v-show="!showEmp" ref="content" class="zt-content">
        <div
          v-for="(item, index) in dataList"
          :key="index"
          class="zt-content__item"
          @click="todetails(item.goodsId)"
        >
          <el-image
            class="zt-good__image"
            :src="item.image"
            fit="contain"
          />
          <div v-if="item.styleIsVideo" class="zt-video__b">
            <i class="iconfont icon-shipin"></i>
          </div>
          <div class="zt-item__line">
            <p class="truncate">
              {{ item.goodsName }}
            </p>
            <p>{{ item.goodsCode }}</p>
          </div>
          <div class="zt-item__line flex items-end">
            <div class="zt-price__l">
              ￥{{ item.goodsPrice }}
            </div>
            <div class="zt-price__r">
              积分：<div class="zt-item__price">
                {{ item.goodsIntegral }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <LoadMore v-show="!showEmp && !fullscreenLoading" ref="loadMore" first-load @load="load">
      <template #default="scope">
        <el-divider v-if="scope.next">
          加载更多
        </el-divider>
        <el-divider v-if="scope.loading">
          <i class="el-icon-loading text-xl"></i>
        </el-divider>
        <el-divider v-if="scope.done">
          已经到底了
        </el-divider>
        <el-divider v-if="scope.fail">
          加载失败，请重试
        </el-divider>
      </template>
    </LoadMore>
  </div>
</template>

<script>
import Tabs from '@/components/tabs/tabs'
import { getGoodsList, getTypeAndDate } from '@/api/integral'
import LoadMore from '@/components/business/LoadMore'

export default {
  name: 'GoodsList',

  components: {
    Tabs,
    LoadMore,
  },

  data() {
    return {
      searchInput: '',
      ishome: true,
      showEmp: false,
      fullscreenLoading: false,
      goodsCategory: [],
      formData: {
        pageNum: 1,
        pageSize: 20,
        state: 1,
        goodsType: '',
        goodsName: '',
      },
      dataList: [],
      userIntegral: 0,
    }
  },

  created() {
    this.getTab()
  },

  methods: {
    load($state) {
      if (this.formData.pageNum === 1)
        this.fullscreenLoading = true

      getGoodsList(this.formData).then((res) => {
        const result = res.body.goodsList
        if (this.formData.pageNum === 1) {
          this.dataList = result
          this.showEmp = !this.dataList.length
        } else {
          this.dataList.push(...result)
        }
        this.dataList.length >= res.body.totalCount ? $state.done() : $state.next()
        this.userIntegral = res.body.userIntegral
        this.formData.pageNum++
      }).catch((ref) => {
        $state.fail()
      }).finally(() => {
        this.fullscreenLoading = false
      })
    },
    getTab() {
      getTypeAndDate({}).then((res) => {
        this.goodsCategory = res.body.goodsCategory
        const all = {
          categoryName: '全部',
          total: 0,
          orderKey: 0,
        }
        this.goodsCategory.forEach((e) => {
          all.total += e.total - 0
        })
        this.goodsCategory.unshift(all)
      })
    },
    reLoad() {
      this.formData.pageNum = 1
      // this.$refs.loadMore.reset().load()
      this.$refs.loadMore.load()
    },
    cgVal() {
      this.formData.goodsName = this.searchInput
      this.reLoad()
    },
    checkTab1(index) {
      let con = ''
      if (index !== 0)
        con = this.goodsCategory[index].orderKey
      else
        con = ''

      this.$nextTick(() => {
        this.showEmp = false
        this.formData.goodsType = con
        this.reLoad()
      })
    },
    backTop() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop !== 0)
        window.scrollTo('0', '0')
    },
    todetails(id) {
      this.$router.push(`/integral/goodsDetails?id=${id}`)
    },
  },
}
</script>

<style lang='scss' scoped>
.tabs{
  background-color: #ECE8E5;
}

.one ::v-deep input {
    border-radius: 60px 0 0 60px;
    padding-left: 37px !important;
}
.one ::v-deep .el-icon-search {
  margin-left: 6px;
}
.one ::v-deep .el-input__prefix {
    transform: scale(1.5);
}
.one ::v-deep .el-input-group__append {
  border-radius: 0 60px 60px 0;
  border-color: #CDA46C !important;
  background-color: #CDA46C !important;
}
.one ::v-deep .el-input__inner {
  border-color: #CDA46C !important;
}
.one ::v-deep .search  span{
  color: white;
}
::v-deep .el-loading-spinner {
  left: 50%;
}
.zt-content {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  min-height: 50vh;
  .zt-content__item:hover {
    cursor: pointer;
  }

  .zt-content__item {
    font-size: 14px;
    position: relative;
    width: 232px;
    height: 100%;
    margin: 0 0 10px 15px;
    color: #333333;
    border-radius: 5px;
    border: 1px solid #ECE8E5;

    .zt-good__image {
      width: 230px;
      height: 230px;
      border-radius: 5px 5px 0 0;
      border-bottom: 1px solid #F2F2F2;
    }

    .zt-video__b {
      position: absolute;
      top: 10px;
      right: 10px;
      box-sizing: border-box;
      border-radius: 5px;

      .icon-shipin {
        font-size: 28px;
        color: #FF9606;
        border-radius: 5px;
        background-color: #fff;
      }
    }

    .zt-item__line {
      // display: flex;
      overflow: hidden;
      // align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 8px 14px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .zt-price__l {
      color: #FF0000;
    }

    .zt-price__r {
      display: flex;
      align-items: baseline;
      color: #FF0000;
    }

    .zt-item__price {
      font-size: 24px;
      color: #FF0000;
    }
  }
}

.nav-r {
  position: sticky;
  top: 100px;
  width: 70px;
  height: 0;
  float: right;
  transform: translateX(140%);
}
</style>
