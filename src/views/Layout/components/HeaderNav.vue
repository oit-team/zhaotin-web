<template>
  <nav class="h-16 bg-black">
    <div class="container">
      <div class="flex">
        <div class="h-16 w-44 bg-yellow-500"></div>
        <ul
          class="flex-1 px-16 flex items-center text-gray-50 divide-x divide-white-500 justify-center"
        >
          <el-popover
            placement="bottom"
            width="200"
            trigger="hover"
            v-for="item in list"
            :key="item"
            class="px-5"
            popper-class="cus"
          >
            <div>
              <ul class="w-44 divide-y text-center px-2 leading-10">
                <li><a href="">信息预设 1</a></li>
                <li><a href="">信息预设 2</a></li>
                <li><a href="">菜单一</a></li>
                <li><a href="">菜单二</a></li>
              </ul>
            </div>
            <template #reference>
              <div><router-link to="/Product" class="text-white-500">{{ item }}</router-link></div>
            </template>
          </el-popover>
        </ul>
        <div class="tracking-wider flex items-center text-gray-50">
          <div class="leading-10 mr-2">周先生</div>
          <div class="space-x-4">
            <div class="inline-block leading-10">周</div>
            <div class="inline-block leading-10">周</div>
            <div class="inline-block leading-10">周</div>
            <div class="inline-block leading-10">周</div>
          </div>
        </div>
      </div>
      <!-- <router-link to="/HomeView" class="text-red-500">Home</router-link> |
      <router-link to="/about" class="text-red-500">About</router-link> -->
    </div>
  </nav>
</template>

<script>
import { getTreeMenuList } from '@/api/product'

export default {
  name: 'HeaderNav',
  components: {
  },

  data() {
    return {
      list: ['商品中心', '商品管理', '基础配置', '统计报表'],
    }
  },

  created() {
    this.getTreeMenuList()
  },

  methods: {
    async getTreeMenuList() {
      const res = await getTreeMenuList({
        userId: JSON.parse(sessionStorage.getItem('userinfo')).id,
      })
      // console.log(res)
    },
    // async getTreeMenuList() {
    //   // console.log(JSON.parse(sessionStorage.getItem('userinfo')).id)
    // },
  },
}

</script>
<style>
.cus {
  transform: translateY(10px);
}
</style>
