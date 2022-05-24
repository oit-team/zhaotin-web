<template>
  <div class="pageCommonStyle" id="brandInteManage">
    <div class="leftTreeCon">
      <!-- 操作按钮 -->
      <div class="btnBox flex">
        <el-tooltip
          class="item"
          effect="dark"
          content="新增区域"
          placement="top"
        >
          <el-button
            style="border-color: #ff8c7c; background: #ff8c7c; color: #fff"
            class="delBtnOnly"
            icon="el-icon-plus"
            size="mini"
            @click="addAreaOrShopFun"
            circle
          />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="搜索" placement="top">
          <el-button
            type="primary"
            size="mini"
            @click="changeOperate(1)"
            icon="el-icon-search"
            circle
          />
        </el-tooltip>
        <!-- <el-tooltip class="item" effect="dark" content="数据统计" placement="top">
          <el-button class="authBtnOnly" style="border-color: #FCCB02;background: #FCCB02;color:#fff;" @click="changeOperate(2)" icon="el-icon-s-data" circle />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="导入区域" placement="top">
          <el-button style="border-color: #4FD5AC;background: #4FD5AC;color:#fff;" class="addBtnOnly" icon="el-icon-download" circle />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="导出区域" placement="top">
          <el-button style="border-color: #ADA3EE;background: #ADA3EE;color:#fff;" class="downLoadBtnOnly" icon="el-icon-upload2" circle />
        </el-tooltip> -->
      </div>
      <!-- 搜索框 -->
      <div class="searchIpt" v-if="showPanel && operateLabel == 1">
        <el-input
          placeholder="关键字过滤"
          v-model="filterText"
          ref="searchInput"
        />
      </div>
      <!-- 树形控件 -->
      <div class="orgTreeBox" ref="orgTree">
        <el-tree
          :default-expand-all="true"
          v-if="orgList && orgList.length > 0"
          :data="orgList"
          icon-class="el-icon-s-shop"
          :highlight-current="true"
          :props="{ children: 'childrenList', label: 'osName' }"
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
        />
        <div v-else>
          <div v-if="!orgListLoading" style="line-height: 200px">加载中...</div>
          <div v-if="orgListLoading" style="line-height: 100px">暂无数据</div>
        </div>
      </div>
    </div>
    <!-- 分割线 -->
    <div style="width: 0.5px; background-color: #ddd; margin-left: 6px"></div>
    <!-- 组件 -->
    <div class="rightListCon" ref="brandRightCon">
      <div class="table-height">
        <TablePage v-bind="tablePageOption" auto ref="table">
          <template slot="content:accountTypeMsg" slot-scope="{ row }">
            {{ ACCOUNT_TYPE_MSG_TEXT[row.accountType] }}
          </template>
           <template slot="content:hireDate" slot-scope="{ row }">
            {{ row.hireDate === null ? '未选择入职时间' : row.hireDate.substr(0,10) }}
          </template>
        </TablePage>
      </div>
    </div>
    <!-- 新增区域 -->
    <el-drawer :title="editFlag ? '新增' : '编辑'" :visible.sync="areadrawer">
      <!-- 新增表单 -->
      <!-- <el-form
        :model="areaForm"
        :rules="areaRules"
        ref="areaForm"
        v-if="editFlag"
      >
        <el-form-item label="区域名称" prop="deptName">
          <el-input v-model="areaForm.deptName" placeholder="请输入区域名称" />
        </el-form-item>
        <el-form-item label="责任人" prop="dutyId">
          <el-select filterable v-model="areaForm.dutyId" placeholder="请选择区域负责人" @change="changeAreaManger">
            <el-option
              v-for="item in chargeList"
              :key="item.id"
              :label="item.nickName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <div class="text-center">
          <el-button size="small" type="primary" @click="addArea('areaForm')">确认</el-button>
          <el-button size="small" @click="close">取消</el-button>
        </div>
      </el-form> -->
      <!-- 编辑表单 -->
      <el-form :model="areaForm" :rules="areaRules" ref="areaForm">
        <el-form-item
          :label-width="formLabelWidth"
          label="区域名称"
          prop="deptName"
        >
          <el-input v-model="areaForm.deptName" placeholder="请输入区域名称" />
        </el-form-item>
        <el-form-item
          v-if="!editFlag"
          :label-width="formLabelWidth"
          label="区域编码"
          prop="deptCode"
        >
          <el-input v-model="areaForm.deptCode" placeholder="区请输入域编码" />
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="责任人"
          prop="dutyId"
        >
          <el-select
            filterable
            v-model="areaForm.dutyId"
            placeholder="请选择区域负责人"
            @change="changeAreaManger"
          >
            <el-option
              v-for="item in chargeList"
              :key="item.id"
              :label="item.nickName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <div class="text-center">
          <el-button size="small" type="primary" @click="addedit('areaForm')"
            >确认</el-button
          >
          <el-button size="small" @click="closeEdit">取消</el-button>
        </div>
      </el-form>
    </el-drawer>

    <!-- 区域修改删除弹框 -->
    <el-dialog
      title="操作"
      :visible.sync="handleClickFlag"
      center
      width="270px"
      class="align-center"
    >
      <!-- <el-button size="small" @click="clickAdd">新 增</el-button> -->
      <el-button type="primary" size="small" @click="openDailog"
        >编辑</el-button
      >
      <el-button type="info" size="small" @click="delArea">删除</el-button>
    </el-dialog>

    <!-- 批量授权 -->
    <el-drawer
      title="角色授权"
      :visible.sync="batchPowerFlag"
      :wrapper-closable="false"
      direction="rtl"
      size="40%"
    >
      <div class="p-8">
        <el-table
          ref="roleMultipleTable"
          :data="powerList"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="roleSelection"
          @select="changeSelectRole"
          @select-all="selectAllRole"
        >
          <el-table-column
            prop="id"
            align="center"
            type="selection"
            width="50"
          />
          <el-table-column
            prop="roleName"
            label="角色名"
            show-overflow-tooltip
          />
          <el-table-column
            prop="roleRemark"
            label="角色描述"
            show-overflow-tooltip
          />
          <el-table-column
            prop="roleCode"
            label="角色编码"
            show-overflow-tooltip
          />
        </el-table>
        <div class="roleTips">
          <i
            class="el-icon-magic-stick"
            style="font-size: 16px; margin-right: 6px"
          ></i
          >选择单用户时，可查看该用户已授权的角色。
        </div>

        <div class="text-center mt-0">
          <el-button size="small" type="primary" @click="confirmBatch()"
            >确认</el-button
          >
          <el-button size="small" @click="cancelBatch()">取消</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 导出客户 -->
    <!-- <el-drawer
      title="请选择需要导出的字段"
      :visible.sync="exportModelFlag"
      :before-close="handleExportClose"
      direction="rtl"
      size="30%"
      ref="export"
    >
      <div class="text-center">
        <el-checkbox-group v-model="checkList" :checked="true" @change="changeChecked">
          <div
            style="text-align:left;margin:6px 0px;"
            v-for="(item,index) in exportInfoList"
            :key="index"
            class="text-center"
          >
            <el-checkbox
              :label="item.columnDesc"
              true-label
            >
              {{ item.columnDesc }}
            </el-checkbox>
          </div>
        </el-checkbox-group>
        <div style="margin-top: 20px">
          <el-button size="small" @click="cancelExport">取 消</el-button>
          <el-button size="small" type="primary" @click="confirmExportUser">确 认</el-button>
        </div>
      </div>
    </el-drawer> -->
  </div>
</template>

<script>
import TablePage from "@/components/business/TablePage";
import { getTreeOrgList } from "@/api/brand";
import {
  getCustomer,
  delUserById,
  getExportCustomer,
  getExportinfo,
  changeCustomer,
} from "@/api/customer";
import { reqRole, addUserAndRole } from "@/api/user";
import { insertOrg, delOrgById, updateShopOrOrgById } from "@/api/org";

const ACCOUNT_TYPE_MSG_TEXT = {
  0: "APP用户",
  1: "管家用户",
  2: "APP及管家用户",
};

export default {
  name: "Role",
  components: {
    TablePage,
  },
  data() {
    return {
      formLabelWidth: "100px",
      ACCOUNT_TYPE_MSG_TEXT,
      params: {},
      // 角色授权
      batchPowerFlag: false,
      powerList: [], // 角色列表
      userIds: [], // 选中的用户列表
      roleId: [], // 选中的授权角色id
      checkedRoleArr: [], // 被选中角色列表

      // 导出用户
      exportModelFlag: false, // 导出客户显示隐藏
      checkList: [], // 导出字段选中项
      exportInfoList: [], // 导出模板字段列表，由用户勾选，传参给导出接口
      tempCheckList: [], // 默认全部选中，先把选项临时存储起来，方便赋值操作

      data: {},
      showPanel: false, // 输入框显示隐藏
      handleClickFlag: false, // 弹框显示隐藏
      areadrawer: false, // draweer显示隐藏
      operateLabel: 1, // 1 搜索  2 查看统计数据

      orgStId: "", // 区域ID
      orgList: [], // 综合管理左侧树列表
      orgListLoading: false, // 树菜单加载状态
      curCheckedKey: null, // 当前选中的节点
      defaultOpenArr: [], // 默认展开的节点的数组
      nodeInfo: null, // 单击节点的信息
      path: 0, // 父级部门路径
      filterText: "",
      editFlag: true, // 新增/编辑
      chargeList: [], // 区域负责人列表
      orgId: null, // 区域Id
      msg:null,
      areaForm: {
        deptName: "", // 区域名称
        dutyId: "", // 负责人
        deptCode: "", // 区域编码
      },
      areaRules: {
        deptName: [
          { required: true, message: "请输入区域名称", trigger: "blur" },
          { max: 12, message: "长度在 12 个字以内", trigger: "blur" },
        ],
        deptCode: [
          { required: true, message: "请输入区域代码", trigger: "blur" },
        ],
      },
    };
  },

  computed: {
    tablePageOption() {
      return {
        promise: this.loadData,
        actions: [
          {
            name: "新增用户",
            type: "success",
            icon: "el-icon-plus",
            click: () =>
              this.$router.push({
                path: "/system/addUser",
                query: { orgStId: this.orgStId },
              }),
          },
          {
            name: "角色授权",
            type: "warning",
            icon: "el-icon-user",
            click: this.showPower,
          },
          // {
          //   name: '导入用户',
          //   type: 'primary',
          //   icon: 'el-icon-download',
          //   click: () => this.$refs.export.open(),
          // },
          // {
          //   name: '导出用户',
          //   type: 'primary',
          //   icon: 'el-icon-upload2',
          //   click: this.exportCustomer,
          // },
        ],
        table: {
          data: this.data.resultList,
          actions: {
            width: 180,
            buttons: [
              {
                tip: "编辑",
                type: "primary",
                icon: "el-icon-edit",
                click: (scope) =>
                  this.$router.push({
                    path: "/system/addUser",
                    query: { item: scope },
                  }),
              },
              {
                tip: "删除",
                type: "danger",
                icon: "el-icon-delete",
                click: this.deleteUser,
              },
              {
                tip: ({ row }) => ["禁用", "启用"][row.status],
                type: ({ row }) => ["success"][row.status] || "info",
                icon: ({ row }) =>
                ["el-icon-open"][row.status] || "el-icon-turn-off",
                click: this.ban,
              },
            ],
          },
          // 开启多选
          selection: true,
          loading: false,
        },
        pager: {
          total: this.data.count,
        },
      };
    },
  },
  watch: {
    // 区域树搜索
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getTreeOrgList();
  },
  methods: {
    // 获取用户列表
    async loadData(params) {
      this.params = params;
      const con = {
        code: "2",
        brandId: sessionStorage.brandId,
        idDuty: "0",
        ...params,
      };
      await getCustomer(con).then((res) => {
        this.data = res.body;
        this.chargeList = res.body.resultList;
      });
    },
    // 更换区域负责人
    changeAreaManger(val) {
      this.areaForm.dutyId = val;
    },
    // 取消新增区域
    close() {
      this.areadrawer = false;
    },
    // 打开编辑区域框
    openDailog() {
      this.areadrawer = true;
      this.editFlag = false;
      if (this.nodeInfo) {
        this.areaForm.deptName = this.nodeInfo.osName;
        this.areaForm.deptCode = this.nodeInfo.nodeCode;
        if (this.nodeInfo.dutyId) {
          this.areaForm.dutyId = Number(this.nodeInfo.dutyId);
        } else {
          this.areaForm.dutyId = null;
        }
      } else {
        this.areaForm.dutyId = null;
      }
    },
    // 确认区域
    addedit() {
      // 新增
      if (this.editFlag) {
        this.$refs.areaForm.validate((valid) => {
          if (valid) {
            let path = null;
            if (this.orgStId) {
              path = `${this.nodeInfo.path},${this.nodeInfo.id}`;
            } else {
              path = "0";
            }
            const con = {
              brandId: sessionStorage.brandId,
              deptName: this.areaForm.deptName,
              dutyId: this.areaForm.dutyId,
              path,
              deptImg: "../../../assets/loginLeft.png",
              userId: sessionStorage.userId,
              deptCode: this.areaForm.areaCode,
            };
            insertOrg(con).then(() => {
              this.getTreeOrgList();
              this.areadrawer = false;
              this.nodeInfo.path = 0
              this.orgStId = ''
            });
          }
        });
      } else {
        let path = null;
        if (this.nodeInfo) {
          path = `${this.nodeInfo.path}`
        } else {
          path = "0";
        }
        const con = {
          id: this.nodeInfo.id,
          isShop: "0",
          orgStId: path,
          deptName: this.areaForm.deptName,
          deptCode: this.nodeInfo.nodeCode,
          dutyId: this.areaForm.dutyId,
        };
        updateShopOrOrgById(con).then((res) => {
          if (res.head.status === 0) {
            this.$message({
              message: "编辑区域成功",
              type: "success",
            });
            this.getTreeOrgList();
            this.areadrawer = false;
            this.handleClickFlag = false;
          } else {
            this.$message({
              message: res.head.msg,
              type: "warning",
            });
          }
        });
      }
    },
    // 取消编辑区域
    closeEdit() {
      this.areadrawer = false;
    },
    // 关闭编辑弹框
    closeDailog() {
      this.handleClickFlag = false;
      this.editFlag = true;
    },
    // 删除区域
    delArea() {
     if(this.msg.childrenList) {
       return  this.$message({
          message: '区域下存在子节点，不能删除',
          type: 'warning'
        });
     } else {
        this.$confirm("确认删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const con = {
          isShop: "0",
          orgId: this.orgId,
        };
        delOrgById(con).then(() => {
          this.getTreeOrgList();
          this.handleClickFlag = false;
        });
      });
     }
    },
    // 获取区域列表
    async getTreeOrgList() {
      const res = await getTreeOrgList({
        brandId: sessionStorage.brandId,
      });
      this.orgList = [{
        osName:'全部',
        menuId:'allMenu',
        brandId:'allMenu',
        id:'',
        sort:'',
        childrenList:res.body.orgList
      }]
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey('allMenu'); 
      });
      // this.orgList = res.body.orgList;
    },
    // 新增区域
    async addAreaOrShopFun() {
      this.areadrawer = true;
      this.editFlag = true;
      this.areaForm.deptName = "";
      this.areaForm.deptCode = "";
      this.areaForm.dutyId = "";
    },
    // 搜索方法
    changeOperate(val) {
      this.showPanel = !this.showPanel;
      // console.log(val)
    },
    // 节点被点击时的回调
    async handleNodeClick(MouseEvent, object, Node, VueComponent) {
      // this.administration.id = object.data.id
      // this.administration.isShop = object.data.isShop
      // object里有被点击区域的区域信息
      this.orgStId = MouseEvent.id; // 区域id
      this.nodeInfo = object.data; // 将被点击的区域信息存起来
      const con = {
        brandId: sessionStorage.brandId,
        orgStId: MouseEvent.id,
        pageNum: "1",
        pageSize: "10",
        code: "2",
      };
      getCustomer(con).then((res) => {
        this.data = res.body;
        this.chargeList = res.body.resultList;
      });
    },
    // 节点开始拖拽时触发的事件
    handleDragStart() {},
    // 拖拽进入其他节点时触发的事件
    handleDragEnter() {},
    // 拖拽离开某个节点时触发的事件
    handleDragLeave() {},
    // 在拖拽节点时触发的事件
    handleDragOver() {},
    // 拖拽成功时触发的事件
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      let sort = null;
      if (dropNode.data.isShop && dropNode.data.isShop !== "2") {
        if (dropType === "inner") {
          sort = "1";
        } else if (dropType === "before") {
          sort = dropNode.data.sort;
        } else if (dropType === "after") {
          sort = dropNode.data.sort;
        }
      }
    },
    // 拖拽成功完成时触发的事件
    handleDrop() {},
    // 节点拖拽处理函数开始================================
    // 拖拽时判定目标节点能否被放置。
    // type 参数有三种情况：'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后
    allowDrop(draggingNode, dropNode, type) {
      /// / console.log("--------拖拽时判定目标节点能否被放置。--------",draggingNode, dropNode, type)
      if (dropNode.data.isShop === "2") {
        return type !== "before" && type !== "after"; // 不能拖到节点上下
      }
      if (dropNode.data.isShop === "1") {
        // return;
        return type !== "inner"; // 不能拖到节点里面去
      }
      return true;
    },
    // 判断节点能否被拖拽，只有一个参数
    allowDrag(draggingNode) {
      // // console.log("-------判断节点能否被拖拽-------",draggingNode)
      return draggingNode.data.isShop !== "2"; // true 可拖拽 false 不可拖拽 可排除不可被拖拽的情况
    },
    // 当某一节点被鼠标右键点击时会触发该事件
    nodeRightClick(MouseEvent, object, Node, VueComponent) {
      this.msg = object
      this.orgId = Node.data.id;
      this.handleClickFlag = true;
      this.nodeInfo = Node.data; // 先将data存到变量里
    },
    // 树节点搜索过滤
    filterNode(value, data) {
      // // console.log("--------------",value,data)
      if (!value) return true;
      return data.osName.indexOf(value) !== -1;
    },
    // 删除用户
    deleteUser(item) {
      this.$confirm("确认删除该用户吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const con = {
            userId: item.row.id,
            code: "2",
            loginId: item.row.loginId,
          };
          delUserById(con).then(() => {
            getCustomer({
              brandId: sessionStorage.brandId,
              orgStId: this.orgStId,
              pageNum: "1",
              pageSize: "10",
              code: "2",
            }).then((res) => {
              this.data = res.body;
              this.chargeList = res.body.resultList;
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 导出客户字段
    exportCustomer() {
      this.exportModelFlag = true;
      const con = {
        type: "customerList",
        code: "customer",
      };
      getExportinfo(con).then((res) => {
        if (res.head.status === 0) {
          this.exportInfoList = res.body.exportTitle;
          // 实现点击导出默认全选效果
          for (let i = 0; i < this.exportInfoList.length; i++) {
            // console.log(this.exportInfoList[i]);
            this.tempCheckList.push(this.exportInfoList[i].columnDesc);
          }
          this.checkList = this.tempCheckList;
        }
      });
    },
    // 导出关闭提示
    handleExportClose() {
      this.$confirm("确认关闭？").then(() => {
        this.exportModelFlag = false;
        this.$refs.export.clearFiles();
      });
    },
    // 获取选中项的值
    changeChecked(val) {
      this.checkList = val;
    },
    // 取消导出
    cancelExport() {
      this.exportModelFlag = false;
      this.checkList = this.tempCheckList;
    },
    // 确认导出
    confirmExportUser() {
      this.rowList = {};
      if (this.checkList.length > 0) {
        for (let i = 0; i < this.checkList.length; i++) {
          for (let j = 0; j < this.exportInfoList.length; j++) {
            if (this.checkList[i] === this.exportInfoList[j].columnDesc) {
              this.rowList[this.exportInfoList[j].columnName] =
                this.exportInfoList[j].columnDesc;
            }
          }
        }
      }
      if (this.rowList) {
        this.exportModelFlag = false;
        const con = {
          code: "1",
          // pageNum: '1',
          // pageSize: '999',
          ...this.params,
          rowList: this.rowList,
        };
        getExportCustomer(con, { responseType: "arraybuffer" }).then((res) => {
          const blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8",
          }); // application/vnd.openxmlformats-officedocument.wordprocessingml.document这里表示doc类型
          const contentDisposition = res.headers["content-disposition"]; // 从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
          const patt = new RegExp("Filename=([^;]+\\.[^\\.;]+);*");
          const result = patt.exec(contentDisposition);
          const filename = result[1];
          const downloadElement = document.createElement("a");
          const href = window.URL.createObjectURL(blob); // 创建下载的链接
          downloadElement.style.display = "none";
          downloadElement.href = href;
          downloadElement.download = `${filename}-用户列表-${filename}`; // 下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        });
      } else {
        this.$message({
          type: "warning",
          message: "请先选择导出数据相关字段",
        });
      }
    },
    // 授权
    showPower() {
      if (this.$refs.table.selected.length === 0) {
        this.$message({
          message: "请先选择要批量授权的用户",
          type: "warning",
        });
      } else if (this.$refs.table.selected.length === 1) {
        console.log(this.$refs.table.selected);
        this.batchPowerFlag = true;
        const con = {
          id: this.$refs.table.selected[0].loginId,
          pageNum: this.params.pageNum,
          pageSize: this.params.pageSize,
          brandId: sessionStorage.brandId,
        };
        this.getRoleList(con);
      } else {
        this.batchPowerFlag = true;
        const con = {
          id: this.$refs.table.selected[0].loginId,
          pageNum: this.params.pageNum,
          pageSize: this.params.pageSize,
          brandId: sessionStorage.brandId,
        };
        this.getRoleList(con);
      }
    },
    getRoleList(con) {
      reqRole(con).then((res) => {
        this.powerList = res.body.resultList;
        this.$refs.table.selected.forEach((item) => {
          this.userIds.push(item.loginId);
        });
        const result = res.body.isAssociatedRole;
        console.log(result);
        if (result) {
          this.checkedRoleArr = result;
          let checkedArr = [];
          for (let i = 0; i < this.checkedRoleArr.length; i++) {
            for (let j = 0; j < this.powerList.length; j++) {
              if (this.checkedRoleArr[i] == this.powerList[j].roleId) {
                checkedArr.push(this.powerList[j]);
              }
            }
          }
          setTimeout(() => {
            this.toggleSelection(checkedArr);
          }, 100);
        }
      });
    },
    // 角色选项有变化时
    roleSelection(val) {
      console.log(val);
    },
    // 当页勾选以及取消
    changeSelectRole(selection, row) {
      let fitemIndex = this.roleId.findIndex((item) => {
        return item == row.roleId;
      });
      if (fitemIndex < 0) {
        this.roleId.push(row.roleId);
      } else {
        this.roleId.splice(fitemIndex, 1);
      }
    },
    // 表格全选内容
    selectAllRole(val) {
      if (val.length) {
        val.forEach((item) => {
          this.roleId.push(item.roleId);
        });
      } else {
      }
    },
    // 取消授权
    cancelBatch() {
      this.batchPowerFlag = false;
      this.roleId = [];
      this.$refs.roleMultipleTable.clearSelection();
    },
    // 确认授权
    confirmBatch() {
      addUserAndRole({
        roleIds: this.roleId.toString(),
        userIds: this.userIds.toString(),
      }).then((res) => {
        if (res.head.status === 0) {
          this.$message({
            message: "用户授权成功",
            type: "success",
          });
          this.batchPowerFlag = false;
        } else {
          this.$message({
            message: res.head.msg,
            type: "warning",
          });
        }
      });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.roleMultipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.roleMultipleTable.clearSelection();
      }
    },
    // 禁用
    ban(item) {
      const con = {
        id: item.row.id,
        status: item.row.status === "1" ? "0" : "1",
        loginId: item.row.loginId,
        code: "2",
      };
      changeCustomer(con).then(() => {
        this.$refs.table.loadData();
      });
    },
  },
};
</script>

<style lang="less" scoped>
@deep:~ ">>>";
#brandInteManage {
  display: flex;
  justify-content: space-between;
  height: 100%;
  padding-left: 10px;
}
#brandInteManage .leftTreeCon {
  margin: 0 10px;
  padding: 0 6px;
  display: flex;
  flex-direction: column;
  width: 210px;
  border:1px solid #e5e7eb;
}
#brandInteManage .leftTreeCon .btnBox {
  margin: 12px 0px 8px;
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
  background-color: #1978fe;
}
#brandInteManage .leftTreeCon .statisticsBox .item .titleBox .countNums {
  color: #1978fe;
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
/deep/ .el-tree-node__content{
  padding: 6px 0;
  height: auto;
}
/deep/ .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
  background: #c5ddff;
  color: #1978fe;
}
#brandInteManage
  .leftTreeCon
  .statisticsBox
  .item
  .numMain
  .numItemBox
  .userTip {
  font-size: 10px;
}
#brandInteManage
  .leftTreeCon
  .statisticsBox
  .item
  .numMain
  .numItemBox
  .numBox {
  color: #1978fe;
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
  font-size: 14px !important;
  cursor: pointer;
}
#brandInteManage .rightListCon .userTabBox .active {
  color: #409eff;
  border-bottom: 2px solid #409eff;
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
  padding: 9px 15px !important;
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
  padding: 9px 15px !important;
}
#brandInteManage .roleTips {
  text-align: left;
  padding-left: 12px;
  line-height: 50px;
  color: #e60012;
}
/deep/ .el-drawer__header > :first-child {
  text-align: center;
}
/deep/ .el-dialog--center .el-dialog__body {
  text-align: center;
}
.table_height {
  height: 700px;
}
/deep/.el-table {
  margin-left: 0;
}
/deep/.el-drawer__open .el-drawer.rtl {
  padding: 0 20px;
}
/deep/.el-select {
  width: 100%;
}
.table-height {
  height: 100%;
}
</style>
