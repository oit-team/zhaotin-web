<template>
  <div class="ct-tabs">
    <div v-if="labelText" class="zt-tabs__label">{{ labelText }}:</div>
    <!-- 二级 tab -->
    <div v-if="!ishome" class="zt-tabs__center1">
      <div
        v-for="(item, index) in tabList"
        :key="index"
        :class="selectItem === index ? 'zt-tabs-select' : 'zt-tabs__item'"
        @click="checkItem(index)"
      >
        {{ item.dicttimeDisplayName }}
      </div>
    </div>
    <!-- 顶部 tab -->
    <div v-else class="zt-tabs__center2">
      <template v-if="!showDrop">
        <div
          v-for="(item, index) in tabList"
          :key="index"
          :class="
            selectItem === index ? 'zt-tabs__homeSelect' : 'zt-tabs__homeItem'
          "
        >
          <span class="el-dropdown-link" @click="checkItem(index)">
            {{ item.categoryName || item.dictitemDisplayName }}({{
              item.typeNumber || item.total || 0
            }})
          </span>
        </div>
      </template>
      <template v-else>
        <el-dropdown
          v-for="(item, index) in tabList"
          :key="index"
          trigger="click"
          :class="
            selectItem === index ? 'zt-tabs__homeSelect' : 'zt-tabs__homeItem'
          "
          @command="checkSecondTab"
        >
          <span class="el-dropdown-link" @click="checkItem(index)">
            {{ item.categoryName || item.dictitemDisplayName }}({{
              item.typeNumber || item.total || 0
            }})
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(secondItem, idx) in item.childerType"
              :key="idx"
              :command="secondItem"
            >
              {{ secondItem.dictitemDisplayName }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
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
    showDrop: Boolean,
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
    checkSecondTab(...e) {
      this.$emit('check-second-tab1', e)
    },
    checkItem(index) {
      this.selectItem = index
      if (this.ishome)
        this.$emit('check-tab1', index)

      this.$emit('check-tab', index)
    },

  },
}
</script>

<style lang='scss' scoped>
.ct-tabs {
  display: flex;
  align-items: center;
  width: 100%;
  // margin: 10px 0;
  box-sizing: border-box;
}
.el-dropdown{
  font-size: 16px;
}
.zt-tabs__center1 {
  display: flex;
  align-items: center;
}
.zt-tabs__center2 {
  display: flex;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
  // justify-content: space-around;
}
.zt-tabs__item {
  padding: 15px;
  box-sizing: border-box;
}
.zt-tabs__item:hover {
  cursor: pointer;
}
.zt-tabs__homeItem:hover {
  cursor: pointer;
}
.zt-tabs__homeItem {
  color: #666666;
  padding: 16px;
  white-space: nowrap;
  box-sizing: border-box;
}
.zt-tabs__label {
  margin-right: 20px;
}
.zt-tabs-select {
  padding: 16px;
  color: #cda46c;
  white-space: nowrap;
  box-sizing: border-box;
}
.zt-tabs__homeSelect {
  text-align: center;
  background-color: #333;
  color: #cda46c;
  font-weight: 800;
  border-radius: 30px;
  padding: 15px 25px;
  white-space: nowrap;
  box-sizing: border-box;
}
.zt-tabs__homeSelect:hover {
  cursor: pointer;
}
</style>
