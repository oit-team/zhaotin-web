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
              <div><router-link to="/Product" class="">商品中心</router-link></div>
            </template>
          </el-popover>
          <el-popover
            placement="bottom"
            width="200"
            trigger="hover"
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
              <div><router-link to="/Order" class="">我的订单</router-link></div>
            </template>
          </el-popover>
          <el-popover
            placement="bottom"
            width="200"
            trigger="hover"
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
              <div><router-link to="/Manage" class="">商品管理</router-link></div>
            </template>
          </el-popover>
          <el-popover
            placement="bottom"
            width="200"
            trigger="hover"
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
              <div><router-link to="/Seeting" class="">系统设置</router-link></div>
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

export default {
  name: 'HeaderNav',
  components: {
  },

  data() {
    return {

    }
  },
}

</script>
<style>
.cus {
  transform: translateY(10px);
}
.active {
  color:#eab308;
}
</style>
