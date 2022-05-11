<template>
  <div class="ct-tabs">
    <div class="zt-tabs__label" v-if="labelText">{{ labelText }}:</div>
    <!-- <div> -->
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
    <div v-else class="zt-tabs__center2">
      <div
        v-for="(item, index) in tabList"
        :key="index"
        :class="selectItem===index?'zt-tabs__homeSelect':'zt-tabs__homeItem'"
        @click="checkItem(index)"
      >
        {{ item.styleType }}({{ item.categoryNumber }})
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
    console.log(this.tabList)
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
  justify-content: space-around;
}
.zt-tabs__item{
  padding: 0 20px;
}
.zt-tabs__item:hover{
  cursor:pointer;
}
.zt-tabs__homeItem:hover{
  cursor:pointer;
}
.zt-tabs__homeItem{
  // display: flex;
  // align-items: center;
  color: #666666;
  // height: 100%;
  // padding: 0 35px;
}
.zt-tabs__label{
  margin-right: 20px;
}
.zt-tabs-select{
  padding: 0 20px;
  color: #CDA46C;
}
.zt-tabs__homeSelect{
  width: 120px;
  text-align: center;
  background-color: #333;
  color: #CDA46C;
  font-weight: 800;
  border-radius: 30px;
  padding: 14px 20px;
  box-sizing: border-box;
}
</style>
