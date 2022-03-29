<template>
  <nav class="h-16 bg-black">
    <div class="container">
      <!-- <div class="flex">
        <div class="h-16 w-44 bg-yellow-500"></div>
        <ul
          class="flex-1 px-16 flex items-center text-gray-50 divide-x divide-white-500 justify-center"
        >
          <li @mouseenter="show" v-for="item in list" :key="item" class="px-5 relative dropWrapper">
            <router-link to="">{{ item }}</router-link>
            <HeaderSelect class="dropDown w-40 bg-gray-300 divide-y text-center px-2 leading-10" />
          </li>
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
      </div> -->
      <!-- <router-link to="/" class="text-red-500">Home</router-link> |
      <router-link to="/about" class="text-red-500">About</router-link> -->
    </div>
  </nav>
</template>

<script>
// import HeaderSelect from '../HeaderSelect/index'

export default {
  name: 'HeaderNav',
  components: {
    // HeaderSelect,
  },

  data() {
    return {
      list: ['我的订单', '商品管理', '基础配置', '统计报表'],
    }
  },

  methods: {
    show() {
      // console.log(1)

    },
    close() {
      // console.log(2)
    },
  },
}
</script>
<style scoped>
.dropDown {
  position: absolute;
  top: 44px;
  left: -33px;
  display: none;
}
.dropWrapper:hover .dropDown {
  display: block;
}
</style>
