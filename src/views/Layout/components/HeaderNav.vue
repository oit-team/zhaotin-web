<template>
  <nav class="h-16 bg-black">
    <div class="container">
      <div class="flex">
        <div class="h-16 w-44"><img class="h-full" src="../../../assets/icon/顶部导航/logo2.svg" alt="" /></div>
        <ul
          class="flex-1 px-16 flex items-center text-gray-50 divide-x divide-white-500 justify-center"
        >
          <el-popover
            :disabled="!item.childrenMenu"
            placement="bottom"
            width="200"
            trigger="hover"
            v-for="item in list"
            :key="item.menuName"
            class="px-5"
            popper-class="cus"
          >
            <div v-if="item.childrenMenu">
              <ul v-for="(items,index) in item.childrenMenu" :key="index">
                <li class="text-center"><div :class="$route.fullPath === items.menuUrl ? 'box-color': '' " @click="skipSecond(items)">{{ items.menuName }}</div></li>
              </ul>
            </div>
            <template #reference>
              <div @click="skip(item)" :class="$route.fullPath === item.menuUrl ? 'box-color': '' ">{{ item.menuName }}</div>
            </template>
          </el-popover>
        </ul>
        <div class="tracking-wider flex items-center text-gray-50">
          <el-popover
            :disabled="!userinfo"
            placement="bottom"
            width="50"
            trigger="hover"
            class="px-5"
            content="测试"
            popper-class="userheader"
          >
            <div v-if="userinfo">
              <ul class="diivide-y-4 divide-dotted">
                <li class="text-center" @click="quit">退出登录</li>
                <li class="text-center"><a href="">修改密码</a></li>
              </ul>
            </div>
            <template #reference>
              <div v-if="userinfo">
                {{ userinfo.username }}<img
                  class="inline-block le
              ading-10 ml-2"
                  src="../../../assets/icon/顶部导航/箭头下.svg"
                  alt=""
                />
              </div>
              <div
                class="inline-block leading-10 ml-2"
                v-else
                @click="$router.push('/login')"
              >
                请点击登录
              </div>
            </template>
          </el-popover>
          <div class="space-x-4 ml-2">
            <img class="inline-block leading-10" src="../../../assets/icon/顶部导航/消息.svg" alt="" />
            <img class="inline-block leading-10" src="../../../assets/icon/顶部导航/客服.svg" alt="" />
            <img class="inline-block leading-10" src="../../../assets/icon/顶部导航/设置.svg" alt="" />
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
      list: [],
      showTips: true,
      userinfo: JSON.parse(sessionStorage.getItem('userinfo')),
    }
  },

  created() {
    this.getTreeMenuList()
  },

  methods: {
    async getTreeMenuList() {
      const res = await getTreeMenuList({
        userId: JSON.parse(sessionStorage.getItem('userinfo')).logId,
        brandId: JSON.parse(sessionStorage.getItem('userinfo')).brandId,
      })
      this.list = res.body.resultList
      // this.list.forEach(item => {
      //   if (item.menuName === '系统设置') {
      //     return item.childrenMenu
      //   }
      // })
    },
    skip(item) {
      this.$router.push(item.menuUrl)
    },
    skipSecond(items) {
      sessionStorage.setItem('headTitString', items.fieldDes)
      if (sessionStorage.getItem('headTitString')) {
        this.$router.push(items.menuUrl)
      }
      // console.log(items)
    },
    quit() {
      localStorage.removeItem('token')
      sessionStorage.removeItem('userinfo')
      this.$router.push('/login')
    },
  },
}

</script>
<style>
.cus {
  transform: translateY(9px);
}
.box-color {
  color: #eab308;
}
.userheader {
  width: auto;
  transform: translateY(9px);
}
.secondColor {
  color:  #eab308;
}
</style>
