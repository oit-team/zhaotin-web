<template>
  <div class="container h-24 flex">
    <div class="h-24 flex">
      <div class="inline-block mt-5 mr-2">标</div>
      <div class="h-24 flex flex-col justify-center text-yellow-600 leading-8 underline">
        <div class="">公告：因疫情应，部分地区延迟配送</div>
        <div>消息：本期新品将于2022年4月1日发售</div>
      </div>
    </div>
    <div class="flex-1 flex items-center px-32">
      <el-input
        placeholder=""
        v-model="inputVal"
        class="one"
        prefix-icon="el-icon-search"
        @change="cgVal"
      >
        <el-button class="search" slot="append" @click="cgVal(inputVal)">搜索</el-button>
      </el-input>
    </div>
    <div class="w-60 flex items-center">
      <el-input
        placeholder=""
        prefix-icon="el-icon-search"
        class="one"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputVal: '',
    }
  },
  methods: {
    show() {
      // console.log(1)
    },
    cgVal(val) {
      this.$emit('searchVal', val)
    },
  },
}
</script>

<style>
.one input {
    border-radius: 60px;
    padding-left: 37px !important;
}
.one .el-icon-search {
  margin-left: 6px;
}
.one .el-input__prefix {
    transform: scale(1.5);
}
.one .el-input-group__append {
  border-radius: 0 60px 60px 0;
  border-color: #eab308 !important;
  background-color: #eab308 !important;
}
.one .el-input__inner {
  border-color: #eab308 !important;
}
.one .search  span{
  color: white;
}
</style>
