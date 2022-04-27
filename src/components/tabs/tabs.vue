<template>
  <div class="ct-tabs">
    <div class="zt-tabs__label" v-if="labelText">{{ labelText }}:</div>
    <div class="zt-tabs__center">
      <div v-for="(item, index) in tabList" :key="index">
        <div
          v-if="!ishome"
          :class="selectItem===index?'zt-tabs-select':'zt-tabs__item'"
          @click="checkItem(index)"
        >
          {{ item.styleType || item.dicttimeDisplayName }}
        </div>
        <div
          v-else
          :class="selectItem===index?'zt-tabs__homeSelect':'zt-tabs__homeItem'"
          @click="checkItem(index)"
        >
          {{ item.dicttimeDisplayName }}
        </div>
      </div>
    </div>
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
  created() {
  },
  methods: {
    checkItem(index) {
      this.selectItem = index
      // if (this.ishome) {
      //   this.$emit('checkTab', index)
      // }
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
.zt-tabs__center{
  display: flex;
}
.zt-tabs__item{
  padding: 0 20px;
}
.zt-tabs__item:hover{
  cursor:default;
}
.zt-tabs__homeItem:hover{
  cursor:default;
}
.zt-tabs__homeItem{
  display: flex;
  align-items: center;
  color: #666666;
  height: 100%;
  padding: 0 35px;
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
