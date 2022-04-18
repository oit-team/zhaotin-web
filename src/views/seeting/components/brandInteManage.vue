<template>
  <div class="pageCommonStyle" id="brandInteManage">
    <div class="leftTreeCon">
      <!-- 操作按钮 -->
      <div class="btnBox">
        <el-tooltip class="item" effect="dark" content="新增区域" placement="top">
          <el-button style="border-color: #FF8C7C;background: #FF8C7C;color:#fff;" class="delBtnOnly" icon="el-icon-plus" @click="addAreaOrShopFun" circle />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="搜索" placement="top">
          <el-button type="primary" @click="changeOperate(1)" icon="el-icon-search" circle />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="数据统计" placement="top">
          <el-button class="authBtnOnly" style="border-color: #FCCB02;background: #FCCB02;color:#fff;" @click="changeOperate(2)" icon="el-icon-s-data" circle />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="导入店铺" placement="top">
          <el-button style="border-color: #4FD5AC;background: #4FD5AC;color:#fff;" class="addBtnOnly" icon="el-icon-download" circle />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="导出店铺" placement="top">
          <el-button style="border-color: #ADA3EE;background: #ADA3EE;color:#fff;" class="downLoadBtnOnly" icon="el-icon-upload2" circle />
        </el-tooltip>
      </div>
      <!-- 搜索框 -->
      <div class="searchIpt" v-if="showPanel&&operateLabel==1">
        <el-input
          placeholder="关键字过滤"
          v-model="filterText"
        />
      </div>
      <!-- 数据统计 -->
      <!-- <div class="statisticsBox" v-if="showPanel&&operateLabel==2">
        <div class="item">
          <div class="titleBox">
            <span class="titltTip"></span><span>区域</span><span class="countNums">({{ orgCount }})</span>
            <el-tooltip class="item" effect="dark" content="区域总数" placement="top">
              <i style="font-size:14px;" class="el-icon-question"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="item">
          <div class="titleBox">
            <span class="titltTip"></span><span>店铺</span><span class="countNums">({{ shopCountNum }})</span>
            <el-tooltip class="item" effect="dark" content="SABC为店铺等级，其后数字为对应等级店铺数量" placement="top">
              <i style="font-size:14px;" class="el-icon-question"></i>
            </el-tooltip>
          </div>
          <div class="numMain">
            <span class="numsBox" v-for="(item,index) in shopCount" :key="index">
              <span class="numItemBox" v-if="item.gradeId">
                <span>{{ item.gradeId }}</span><div class="numBox">({{ item.shopsNum }})</div> </span>
              <span class="numItemBox" v-else><span>其它</span><div class="numBox">({{ item.shopsNum }})</div></span>
            </span>
          </div>
        </div>
        <div class="item">
          <div class="titleBox">
            <span class="titltTip"></span><span>用户</span><span class="countNums">({{ userCountNum }})</span>
            <el-tooltip class="item" effect="dark" content="APP为app端用户，HOME为管家端用户，A+H为同时拥有APP和管家端权限的用户" placement="top">
              <i style="font-size:14px;" class="el-icon-question"></i>
            </el-tooltip>
          </div>
          <div class="numMain">
            <span class="numsBox" v-for="(item,index) in userCount" :key="index">
              <span class="numItemBox" v-if="item.accountType==0"> <span class="userTip">APP</span> <div class="numBox">({{ item.usersNum }})</div> </span>
              <span class="numItemBox" v-if="item.accountType==1"> <span class="userTip">HOME</span> <div class="numBox">({{ item.usersNum }})</div> </span>
              <span class="numItemBox" v-if="item.accountType==3"> <span class="userTip">A+H</span> <div class="numBox">({{ item.usersNum }})</div> </span>
            </span>
          </div>
        </div>
      </div> -->
      <!-- 树形控件 -->
      <div class="orgTreeBox" ref="orgTree">
        <el-tree
          v-if="orgList && orgList.length>0"
          :data="orgList"
          icon-class="el-icon-s-shop"
          :highlight-current="true"
          :props="{children: 'childrenList',label: 'osName'}"
          node-key="menuId"
          :current-node-key="curCheckedKey"
          :default-expanded-keys="defaultOpenArr"
          @node-drag-start="handleDragStart"
          @node-drag-enter="handleDragEnter"
          @node-drag-leave="handleDragLeave"
          @node-drag-over="handleDragOver"
          @node-drag-end="handleDragEnd"
          @node-drop="handleDrop"
          draggable
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          @node-click="handleNodeClick"
          @node-contextmenu="nodeRightClick"
          :filter-node-method="filterNode"
          ref="tree"
        >
          <div class="custom-tree-node" slot-scope="{ data }">
            <span>{{ data.osName }}</span>
            <span>({{ data.osName }})</span>
            <span v-if="data.isShop==&quot;2&quot;" style="margin-left:30px;" @click.stop="getTreeOrgList()"><i style="font-size:16px;" class="el-icon-refresh"></i></span>
          </div>
        </el-tree>
        <div v-else>
          <div v-if="!orgListLoading" style="line-height:200px;">加载中...</div>
          <div v-if="orgListLoading" style="line-height:100px;">暂无数据</div>
        </div>
        <!-- props="{children: 'childrenList', label: 'osName'}" -->
        <!-- :render-content="renderContent" -->
      </div>
    </div>
    <!-- 分割线 -->
    <div style="width:0.5px;background-color:#ddd;margin-left:6px;"></div>
    <!-- 组件 -->
    <div class="rightListCon" ref="brandRightCon">
      <!-- <div class="table_height"> <TablePage v-bind="tablePageOption" auto /></div> -->
    </div>
  </div>
</template>

<script>
// import TablePage from '@/components/business/TablePage'
import { getTreeOrgList } from '@/api/brand'

export default {
  name: 'Role',
  components: {
    // TablePage,
  },
  data() {
    return {
      data: {},
      showPanel: false, // 输入框显示隐藏
      operateLabel: 1, // 1 搜索  2 查看统计数据
      orgList: [], // 综合管理左侧树列表
      orgListLoading: false, // 树菜单加载状态
      curCheckedKey: null, // 当前选中的节点
      defaultOpenArr: [], // 默认展开的节点的数组
      filterText: '',
    }
  },

  // computed: {
  //   tablePageOption() {
  //     return {
  //       promise: this.loadData,
  //       // ({
  //       //   // token: JSON.parse(localStorage.getItem('token')),
  //       //   userId: sessionStorage.getItem('userId'),
  //       // }),
  //       actions: [
  //         {
  //           name: '导出数据',
  //           type: 'primary',
  //           click: () => this.$refs.export.open(),
  //         },
  //       ],
  //       table: {
  //         // data: this.data.resultList,
  //       },
  //       pager: {
  //         // total: this.data.count,
  //       },
  //     }
  //   },
  // },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    $route(to, from) {
      // // console.log(">>>>>>>>>",to,from);
      // if(to.fullPath == '/brand/addUser'){
      //   from.meta.keepAlive = true
      // }else{
      //   from.meta.keepAlive = false
      // }
    },
    data(val) {
      // // console.log("this.taskCheckedList===",this.taskCheckedList)
      // // console.log("val====",val)
      if (val && this.taskCheckedList && this.activeTab === 2) {
        // // console.log("11111111111")
        this.$nextTick(() => {
          val.forEach(item => {
            this.taskCheckedList.forEach(self => {
              // // console.log("2222222222")
              if (item.taskId === self.taskId) {
                // // console.log("33333=====",item.taskId)
                this.$refs.taskTable.toggleRowSelection(item, true)
              }
            })
          })
        })
      }
    },
  },
  created() {
    this.getTreeOrgList()
  },
  methods: {
    // 获取客户列表
    async getTreeOrgList() {
      const res = await getTreeOrgList({
        brandId: sessionStorage.brandId,
      })
      this.orgList = res.body.orgList
    },
    // 新增区域或用户
    addAreaOrShopFun() {

    },
    // 搜索方法
    changeOperate() {
      this.showPanel = true
    },
    // 节点开始拖拽时触发的事件
    handleDragStart() {

    },
    // 拖拽进入其他节点时触发的事件
    handleDragEnter() {

    },
    // 拖拽离开某个节点时触发的事件
    handleDragLeave() {

    },
    // 在拖拽节点时触发的事件
    handleDragOver() {

    },
    // 拖拽成功时触发的事件
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      // draggingNode,dropNode  被拖拽节点
      // // console.log('tree drag end: ', dropType);
      // // console.log('tree drag end 被拖拽节点: ',draggingNode,'被放置的节点', dropNode);
      // 判断拖拽节点是否为店铺
      let isShop = null
      let orgStId = null

      if (draggingNode.data.isShop && draggingNode.data.isShop === '1') {
        // // console.log("dropNode.data===========",dropNode.data)
        isShop = '1' // 拖拽点是店铺，orgStId1不需要拼接
        if (dropType !== 'none') {
          // // console.log("拖拽结束，，dropType=====",dropType)
          if (dropType === 'inner') {
            // // console.log("dropNode.data===========",dropNode.data)
            orgStId = dropNode.data.id
          } else if (dropType === 'before' || dropType === 'after') {
            orgStId = dropNode.data.parentId
          }
          // // console.log("orgStId=====",orgStId)
        }
      } else if (draggingNode.data.isShop && draggingNode.data.isShop === '0') {
        isShop = '0' // 被拖拽点不是店铺，orgStId需要拼接
        // // console.log("dropNode.data===========",dropNode.data)
        // // console.log("dropNode.data.path===========",dropNode.data.path)
        if (dropType === 'inner') {
          // // console.log("dropNode.data.path===========",dropNode.data.path)
          const lastStr = dropNode.data.path.substring(dropNode.data.path.length - 1)
          if (lastStr === ',') {
            orgStId = `${dropNode.data.path}${dropNode.data.id}`
          } else {
            orgStId = `${dropNode.data.path},${dropNode.data.id}`
          }
          // // console.log("this is cms orgstid",orgStId)
          // orgStId = dropNode.data.id
        } else if (dropType === 'before' || dropType === 'after') { // dropType == 'before' || dropType == 'after'
          // orgStId = '0'
          // // console.log("父节点",dropNode.data,dropNode.parent.data)
          if (dropNode.data.isShop && dropNode.data.isShop === '1') { // 被放置点是店铺，看父节点
            if (dropNode.parent.data.isShop === '2') { // 品牌
              orgStId = '0'
            }
            if (dropNode.parent.data.isShop === '0') { // 区域
              // orgStId = dropNode.parent.data.path
              orgStId = `${dropNode.parent.data.path},${dropNode.parent.data.id}`
            }
          }
          if (dropNode.data.isShop && dropNode.data.isShop === '0') {
            orgStId = dropNode.data.path
          }
          // orgStId = dropNode.data.path
          // // console.log("before:this is cms orgstid",orgStId)
        }
      }

      let sort = null
      if (dropNode.data.isShop && dropNode.data.isShop !== '2') {
        if (dropType === 'inner') {
          sort = '1'
        } else if (dropType === 'before') {
          sort = dropNode.data.sort
        } else if (dropType === 'after') {
          sort = dropNode.data.sort
        }
      }

      if (dropType !== 'none') {
        const _this = this
        const con = {
          id: draggingNode.data.id, // 区域ID或店铺ID  被拖拽节点id
          dropNodeId: dropNode.data.id, // 被放置节点id
          isShop, // 0=区域;1=店铺query string
          orgStId, // 直接上级ID  // 即店铺所属区域id
          beforeSort: draggingNode.data.sort, // 修改之前的排序值
          sort, // 修改之后的排序值
        }

        // // console.log("迁移节点参数：",con)
        const jsonParam = _this.GLOBAL.g_paramJson(con)
        // _this.$set(draggingNode.data,'sort',sort)
        _this.$axios.post(`${_this.GLOBAL.system_manager_server}/org/updateShopOrOrgById`, jsonParam).then((res) => {
          // // console.log("====确认编辑接口==========",res.data.body);   // 成功时 body为null
          if (res.data.head.status === 0) {
            if (draggingNode.data.isShop && draggingNode.data.isShop === '1') {
              // // console.log("dropNode.data===========",dropNode.data)
              // isShop = '1';  // 拖拽点是店铺，orgStId1不需要拼接
              if (dropType !== 'none') {
                // // console.log("拖拽结束，，dropType=====",dropType)
                if (dropType === 'inner') {
                  _this.$set(draggingNode.data, 'parentId', String(dropNode.data.id))
                  // // console.log("改变后的draggingNode.data===========",draggingNode.data)
                } else if (dropType === 'before' || dropType === 'after') {
                  _this.$set(draggingNode.data, 'parentId', dropNode.data.parentId)
                  // // console.log("改变后的draggingNode.data===========",draggingNode.data)
                }
              }
            } else if (draggingNode.data.isShop && draggingNode.data.isShop === '0') { // 被拖拽点不是店铺，orgStId需要拼接
              // // console.log("dropNode.data===========",dropNode.data)
              if (dropType === 'inner') {
                let path = ''
                path = `${dropNode.data.path},${dropNode.data.id}`
                _this.$set(draggingNode.data, 'parentId', dropNode.data.id)
                _this.$set(draggingNode.data, 'path', path)
                // // console.log("改变后的draggingNode.data===========",draggingNode.data);
              } else if (dropType === 'before' || dropType === 'after') {
                let path = ''
                if (dropNode.data.isShop && dropNode.data.isShop === '1') { // 被放置点是店铺，看父节点
                  if (dropNode.parent.data.isShop === '2') { // 品牌
                    path = '0'
                  }
                  if (dropNode.parent.data.isShop === '0') { // 区域
                    // path = dropNode.parent.data.path
                    path = `${dropNode.parent.data.path},${dropNode.parent.data.id}`
                  }
                  // // console.log("path==",path)
                }
                // // console.log("path==",path)
                if (dropNode.data.isShop && dropNode.data.isShop === '0') {
                  path = dropNode.data.path
                }

                _this.$set(draggingNode.data, 'parentId', dropNode.data.parentId)
                _this.$set(draggingNode.data, 'path', path)
              }
            }
            // // console.log("之前的sort===:",dropNode.data.sort,draggingNode.data.sort)
            const dropTempSort = draggingNode.data.sort
            _this.$set(dropNode.data, 'sort', dropTempSort)
            _this.$set(draggingNode.data, 'sort', sort)
            // // console.log("之后的sort===:",dropNode.data.sort,draggingNode.data.sort)

            _this.$message({
              message: '节点迁移成功',
              type: 'success',
            })
            _this.getTreeOrgList() // 每回迁移成功之后都要重亲请求，否则连续进行节点迁移以后会不生效，因为拿到的节点数据不对，只是页面节点改变，数据未改变
          } else {
            _this.$message({
              message: res.data.head.msg,
              type: 'warning',
            })
          }
        }).catch(err => {
          // console.log(err)
        })
      }
    },
    // 拖拽成功完成时触发的事件
    handleDrop() {

    },
    // 节点拖拽处理函数开始================================
    // 拖拽时判定目标节点能否被放置。
    // type 参数有三种情况：'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后
    allowDrop(draggingNode, dropNode, type) {
      /// / console.log("--------拖拽时判定目标节点能否被放置。--------",draggingNode, dropNode, type)
      if (dropNode.data.isShop === '2') {
        return type !== 'before' && type !== 'after' // 不能拖到节点上下
      } if (dropNode.data.isShop === '1') {
        // return;
        return type !== 'inner' // 不能拖到节点里面去
      }
      return true
    },
    // 判断节点能否被拖拽，只有一个参数
    allowDrag(draggingNode) {
      // // console.log("-------判断节点能否被拖拽-------",draggingNode)
      return draggingNode.data.isShop !== '2' // true 可拖拽 false 不可拖拽 可排除不可被拖拽的情况
    },
    // 节点被点击时的回调
    async handleNodeClick(MouseEvent, object, Node, VueComponent) {
      // this.administration.id = object.data.id
      // this.administration.isShop = object.data.isShop
      // this.nodeInfo = object.data // 先将data存到变量里

      // this.activeTab = 1 // 左键单击节点时让tab初始化到activeTab为1

      // await this.$nextTick()
      // if (this.$refs.multipleTable) {
      //   this.$refs.multipleTable.clearSelection()
      // }
      // // debugger
      // const curCheckedKey = this.$refs.tree.getCurrentKey()
      // // // console.log('当前选中节点curCheckedKey===',curCheckedKey)
      // this.curCheckedKey = curCheckedKey
      // this.checkedUserArr = []

      // this.clickNodeFlag = true
      // // console.log("树节点左键单击-----",object.data)
      // this.nodeId = object.data.id
      // this.orgStId = this.nodeId
      // this.curOsName = object.data.osName
      // this.nodeParentId = object.data.parentId
      // this.path = object.data.path
      // if (object.data.isShop === '1') {
      //   this.isShop = '1'
      // }
      // if (object.data.isShop === '2') {
      //   this.isShop = '2'
      // }
      // if (object.data.isShop === '0') {
      //   this.isShop = '0'
      // }
      // // 如果初始化为用户列表，要重新请求数据
      // if (this.activeTab === 1) {
      //   this.loading = true
      //   this.dynamicParam = [
      //     {
      //       key: 'pageNum', value: this.pageNum, isTrue: true, msg: '请确认pageNum.',
      //     },
      //     {
      //       key: 'pageSize', value: this.pageSize, isTrue: true, msg: '请确认pageSize.',
      //     },
      //     {
      //       key: 'brandId', value: sessionStorage.brandId, isTrue: true, msg: '请确认品牌Id.',
      //     },
      //     {
      //       key: 'orgStId', value: this.orgStId, isTrue: true, msg: '请先选择区域或者店铺.',
      //     },
      //     {
      //       key: 'type', value: this.isShop, isTrue: true, msg: '请先选择区域或者店铺.',
      //     },
      //   ]
      //   this.serverName = this.GLOBAL.system_manager_server
      //   this.requestUrl = '/user/getUsers'
      //   // sessionStorage.headTitString = this.brandTitArr[0]
      //   this.headTitArr = JSON.parse(sessionStorage.headTitString)
      //   this.$refs.child.getRequestUrl(this.serverName, this.requestUrl)

      //   // 点击左侧节点时列表页headTitArr更新了，但是搜索组件没有实时接收更改后的数据，只能通过父组件向子组件传值进行更改子组件的数据了
      //   this.headTitArr.forEach(el => {
      //     // el.searchValKey = '';
      //     this.$set(el, 'searchValKey', '')
      //     if (el.fieldType === '值列') {
      //       // // console.log(el.fieldAttr ,typeof(el.fieldAttr))
      //       if (el.fieldAttr && typeof (el.fieldAttr) === 'string') {
      //         el.fieldAttr = JSON.parse(el.fieldAttr)
      //       }
      //       // // console.log("================",el.fieldAttr)
      //     }
      //   })

      //   this.$refs.child.parentHeadArr(this.headTitArr)
      //   // // console.log("------this.nodeId------",this.nodeId,this.isShop,object.data.isShop);
      //   this.dynamicParam.forEach(el => {
      //     if (el.key === 'orgStId') {
      //       el.value = this.nodeId
      //     }
      //     if (el.key === 'type') {
      //       el.value = this.isShop
      //     }
      //     if (el.key === 'pageNum') {
      //       el.value = 1
      //     }
      //   })
      //   this.$refs.child.parentMsgs(this.dynamicParam)
      // }
    },
    // 当某一节点被鼠标右键点击时会触发该事件
    nodeRightClick(MouseEvent, object, Node, VueComponent) {
      // // console.log("节点右击------",MouseEvent, object, Node, VueComponent);
      // console.log("树节点右键单击======",Node.data)   // 单击节点的信息
      if (Node.data.isShop === '1') { // 店铺
        this.isShop = '1'
      }
      if (Node.data.isShop === '2') { // 品牌节点
        this.isShop = '2'
      }
      if (Node.data.isShop === '0') {
        this.isShop = '0' // 区域
      }
      if (this.isShop === '0' || this.isShop === '1') {
        this.handleClickFlag = true
      }
      this.nodeInfo = Node.data // 先将data存到变量里
    },
    // 树节点搜索过滤
    filterNode(value, data) {
      // // console.log("--------------",value,data)
      if (!value) return true
      return data.osName.indexOf(value) !== -1
    },
  },

}
</script>

<style lang="less" scoped>
@deep:~">>>";
#brandInteManage {
  display: flex;
  justify-content: space-between;
  height: 100%;
  padding-left: 10px;
}
// #brandInteManage >>> .el-tooltip {
//   padding: 7px 7px!important;
// }
// #brandInteManage >>> .el-tooltip .el-button--small {
//   padding: 9px 15px;
// }
// #brandInteManage >>> .el-collapse {
//   border-top: none;
//   border-bottom: none;
// }
// #brandInteManage >>> .el-collapse-item__header {
//   height: 40px;
//   line-height: 40px;
//   border: none;
// }
// #brandInteManage >>> .el-collapse-item__wrap {
//   border-bottom: none;
// }
// #brandInteManage >>> .el-collapse-item__content {
//   padding-bottom: 0px;
// }
// #brandInteManage >>> .el-drawer__body {
//   overflow-y: auto;
// }
#brandInteManage .leftTreeCon {
  width: 260px;
  display: flex;
  flex-direction: column;
}
#brandInteManage .leftTreeCon .btnBox {
  margin: 6px 0px 12px;
}
#brandInteManage .leftTreeCon .statisticsBox {
  width: 100%;
  margin: 0px 0px 10px 0px;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 0px 6px;
  box-sizing: border-box;
}
#brandInteManage .leftTreeCon .statisticsBox .item {
  padding: 4px 4px 12px 4px;
  text-align: left;
}
#brandInteManage .leftTreeCon .statisticsBox .item .titleBox {
  display: flex;
  align-items: center;
}
#brandInteManage .leftTreeCon .statisticsBox .item .titleBox .titltTip {
  display: inline-block;
  width: 5px;
  height: 14px;
  margin-right: 6px;
  background-color: #1978FE;
}
#brandInteManage .leftTreeCon .statisticsBox .item .titleBox .countNums {
  color: #1978FE;
}
#brandInteManage .leftTreeCon .statisticsBox .item .numMain {
  margin: 10px 0px 0px 0px;
}
#brandInteManage .leftTreeCon .statisticsBox .item .numMain .numItemBox {
  font-size: 12px;
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 4px;
  width: 44px;
  height: 44px;
  border: 1px solid #ccc;
  border-radius: 10px;
  text-align: center;
  line-height: 20px;
}
#brandInteManage .leftTreeCon .statisticsBox .item .numMain .numItemBox .userTip {
  font-size: 10px;
}
#brandInteManage .leftTreeCon .statisticsBox .item .numMain .numItemBox .numBox {
  color: #1978FE;
}
#brandInteManage .leftTreeCon .searchIpt {
  width: 94%;
  height: 40px;
  margin: 6px auto;
  box-sizing: border-box;
}
#brandInteManage .leftTreeCon .orgTreeBox {
  width: 100%;
  height: 76vh;
  overflow: auto;
  box-sizing: border-box;
}
// #brandInteManage .leftTreeCon .orgTreeBox >>> .el-tree {
//   min-width: 100%;
//   padding-right: 6px;
//   display: inline-block;
//   margin-bottom: 6px;
// }
// #brandInteManage .leftTreeCon .orgTreeBox >>> .el-tree .el-tree-node__content {
//   height: 38px;
// }
// #brandInteManage .leftTreeCon .orgTreeBox >>> .el-tree-node:focus > .el-tree-node__content {
//   color: #1978FE;
// }
// #brandInteManage .leftTreeCon .orgTreeBox >>> .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
//   background-color: #C5DDFF;
//   color: #1978FE;
// }
// #brandInteManage .leftTreeCon .orgTreeBox >>> .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content:hover {
//   background-color: #F5F7FA;
// }

#brandInteManage .rightListCon {
  display: flex;
  overflow: hidden;
  flex: 1;
  flex-direction: column;
  margin-left: 10px;
}
#brandInteManage .rightListCon .userTabBox {
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 6px;
}
#brandInteManage .rightListCon .userTabBox .tabItem {
  border-bottom: 2px solid transparent;
  margin-right: 20px;
  height: 34px;
  line-height: 34px;
  font-size: 14px!important;
  cursor: pointer;
}
#brandInteManage .rightListCon .userTabBox .active {
  color: #409EFF;
  border-bottom: 2px solid #409EFF;
}
#brandInteManage .rightListCon .userListBox {
  position: relative;
  overflow: auto;
  flex: 1;
}
#brandInteManage .rightListCon .userListBox .operateBtn {
  margin-bottom: 10px;
  display: flex;
}
#brandInteManage .rightListCon .userListBox .operateBtn #authBtn {
  padding: 9px 15px!important;
}
#brandInteManage .rightListCon .examListBox {
  display: flex;
  overflow: auto;
  flex: 1;
  flex-direction: column;
}
#brandInteManage .rightListCon .examListBox .operateBtn {
  margin-bottom: 10px;
  display: flex;
}
#brandInteManage .rightListCon .examListBox .operateBtn #authBtn {
  padding: 9px 15px!important;
}
// #brandInteManage >>> .el-dialog--center .el-dialog__body {
//   display: flex;
//   justify-content: space-around;
// }
// #brandInteManage >>> .el-drawer__body .el-select {
//   width: 100%;
// }
// #brandInteManage >>> .el-date-editor.el-input,
// #brandInteManage .el-date-editor.el-input__inner {
//   width: 100%;
// }
// #brandInteManage >>> .el-form-item__label {
//   text-align: left;
// }
// #brandInteManage >>> .demo-drawer__content .el-tooltip {
//   padding: 0px 10px!important;
// }
#brandInteManage .roleTips {
  text-align: left;
  padding-left: 12px;
  line-height: 50px;
  color: #e60012;
}

</style>
