<template>
  <div class="ct-tabs">
    <div class="zt-tabs__label" v-if="labelText">{{ labelText }}:</div>
    <!-- 二级 tab -->
    <div v-if="!ishome" class="zt-tabs__center1">
      <div
        v-for="(item, index) in tabList"
        :key="index"
        :class="selectItem===index?'zt-tabs-select':'zt-tabs__item'"
        @click="checkItem(index)"
      >
        {{ item.dicttimeDisplayName }}
      </div>
    </div>
    <!-- 顶部 tab -->
    <div v-else class="zt-tabs__center2">
      <div
        v-for="(item, index) in tabList"
        :key="index"
        :class="selectItem===index?'zt-tabs__homeSelect':'zt-tabs__homeItem'"
        @click="checkItem(index)"
      >
        {{ item.categoryName }}({{ item.countNum }})
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  name: 'Tabs',
  props: {
    tabList: Array,
    labelText: String,
    ishome: Boolean,
  },
  data() {
    return {
      selectItem: 0,
      showLb: true,
    }
  },
  mounted() {
  },
  methods: {
    checkItem(index) {
      this.selectItem = index
      if (this.ishome) {
        this.$emit('checkTab1', index)
      }
      this.$emit('checkTab', index)
    },
  },
}
</script>

<style lang='scss' scoped>
.ct-tabs{
  display: flex;
  align-items: center;
  width: 100%;
  margin: 10px 0;
  box-sizing: border-box;
}
.zt-tabs__center1{
  display: flex;
  align-items: center;
}
.zt-tabs__center2{
  display: flex;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
  // justify-content: space-around;
}
.zt-tabs__item{
  padding: 15px;
  box-sizing: border-box;
}
.zt-tabs__item:hover{
  cursor:pointer;
}
.zt-tabs__homeItem:hover{
  cursor:pointer;
}
.zt-tabs__homeItem{
  color: #666666;
  padding: 15px;
  white-space: nowrap;
  box-sizing: border-box;
}
.zt-tabs__label{
  margin-right: 20px;
}
.zt-tabs-select{
  padding: 15px;
  color: #CDA46C;
  white-space: nowrap;
  box-sizing: border-box;
}
.zt-tabs__homeSelect{
  text-align: center;
  background-color: #333;
  color: #CDA46C;
  font-weight: 800;
  border-radius: 30px;
  padding: 15px 25px;
  white-space: nowrap;
  box-sizing: border-box;
}
.zt-tabs__homeSelect:hover{
  cursor: pointer;
}
</style>
