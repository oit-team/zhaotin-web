<template>
  <div class="pageCommonStyle" id='cateRelatedInfo'>
    <el-page-header @back="goBack" :content="categoryName+'--关联信息'"></el-page-header>
    <el-divider></el-divider>
    <div class='relatedInfoCon'>
      <!-- 关联部位信息 -->
      <div class="leftBox">
        <h3>部位配置</h3>
        <div class='inputList'>
          <!-- 这种写法从1开始,0为empty -->
          <div class='inputItem' v-for='(item,i) in partList' :key='i'>
            <el-autocomplete
              popper-class="my-autocomplete"
              v-model="state[i]"
              :fetch-suggestions="querySearch"
              placeholder="请选择/输入部位"
              @select="handleSelect">
              <i
                class="el-icon-circle-close el-input__icon"
                slot="suffix"
                @click="handleIconClick(i)">
              </i>
              <template slot-scope="{ item }">
                <div class="name">{{ item.value }}</div>
              </template>
            </el-autocomplete>
            
          </div>
        </div>
        <div class='addParts' @click='addParts'>+</div>
      </div>
      <div class="rightBox">
        <h3>可关联尺码</h3>
        <div v-if='sizeList.length>0' class='sizeList'>
          <div class="sizeItem" v-for="(item,index) in sizeList" :key='index' >
            <div class='sizeName'>
              <span v-if='item.sizeName'>{{item.sizeName}}</span><span v-if='item.aliasName'>({{item.aliasName}})</span>
            </div>
            <i class="el-icon-edit" @click='editSize(item)'></i><i class="el-icon-delete" @click="deleteSize(item)"></i>
          </div>
          <div class='addSize' @click="addSize" >+</div>

        </div>
        <div class='addSize' @click="addSize" v-else>+</div>

        <el-divider></el-divider>
        <h3>尺码配置</h3>
        <el-tree
          :data="sizeList"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
          :default-checked-keys="defaultCheckedKeys"
          :props="defaultProps">
          <div class="custom-tree-node" slot-scope="{ data }">
            <span v-if='data.sizeName'>{{ data.sizeName }}</span>
            <span v-if='data.aliasName'>({{ data.aliasName }})</span>
          </div>
        </el-tree>

      </div>
    </div>
    <div class='btnBox'>
      <el-button type="primary" size='small' @click='saveCateRelatedInfo'>保存</el-button>
    </div>

    <el-drawer
      title="新增尺寸"
      :visible.sync="sizeFlag"
      :wrapperClosable='false'
      direction="rtl"
      size="40%"
      >
      <div class="demo-drawer__content">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="尺码名称" :label-width="formLabelWidth" prop="sizeName">
            <el-input v-model="ruleForm.sizeName" autocomplete="off"  placeholder="请输入尺码名称"></el-input>
          </el-form-item>
          <el-form-item label="尺码别名" :label-width="formLabelWidth" prop="aliasName">
            <el-input v-model="ruleForm.aliasName" autocomplete="off" maxlength="32" placeholder="请输入尺码别名"></el-input>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button size="small" @click="cancelSize('ruleForm')">取 消</el-button>
          <el-button size="small" type="primary" @click="confirmSize('ruleForm')">确 认</el-button>
        </div>

      </div>
    </el-drawer>
    
  </div>
</template>

<script>
export default {
  name:'cateRelatedInfo',
  components:{},
  data(){
    return {
      categoryName:'',
      baseInfo:null,
      dataList: [
        { "value": "领围"},
        { "value": "肩宽"},
        { "value": "胸围"},
        { "value": "腰围"},
        { "value": "臀围"},
        { "value": "大腿围"},
        { "value": "裙长"},
        { "value": "裤长"},
        { "value": "袖长"},
        { "value": "肩袖长"},
        { "value": "袖口"},
        { "value": "衣长"},
        { "value": "摆围"},
      ],
      state: [],    // 输入框获取的值
      partList:[],

      sizeList:[],
      sizeFlag:false,
      sizeId:null,
      defaultProps: {
        label: 'sizeName'
      },
      ruleForm:{
        sizeName:'',
        aliasName:''
      },
      rules:{
        sizeName:[
          { required: true, message: '请输入尺码名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },
      formLabelWidth: '76px',
      defaultCheckedKeys:[],
      cateId:null,
      // defaultCheckedKeys:[21, 19, 20, 17],

    }
  },
  created(){
    // console.log("query",this.$route.query.item)
    this.categoryName = this.$route.query.item.dictitemDisplayName;
    // console.log("this.categoryName",this.categoryName)
    // 编辑反显时需要这样做
    for(let i=0;i<this.state.length;i++){
      this.partList.push(`${i+1}`)
    }
    // console.log("根据state的值转化来的输入框数组：",this.partList)
  },
  mounted(){
    this.getSizeList();
    this.getGoodsSizeInfo();
  },
  methods:{
    goBack(){
      this.$router.go(-1);   // 查看直接返回
    },
    // 获取相关联类别信息
    getGoodsSizeInfo(){
      let _this = this;
      let con = {
        brandId: sessionStorage.brandId,
        catergre:_this.$route.query.item.dictitemDisplayName,
        styleId:null,
      }
      let jsonParam = _this.GLOBAL.g_paramJson(con);
      _this.$axios.post(_this.GLOBAL.goods_manager_server + "/size/clothingSizeInfo", jsonParam).then((res) => {
        // console.log("获取商品尺码：",res.data.body);
        _this.editSizeFlag = false;
        if(res.data.head.status == 0){
          if(res.data.body){
            _this.baseInfo = res.data.body;
            // res.data.body.resultMap;  
            // res.data.body.sizeInfoVO.upTitle;
            _this.state = [];
            _this.partList = [];
            _this.cateId = _this.baseInfo.sizeInfoVO.styleId;
            for(let i=0;i<_this.baseInfo.sizeInfoVO.upTitle.length;i++){
              if(_this.baseInfo.sizeInfoVO.upTitle[i].value){
                _this.state.push(_this.baseInfo.sizeInfoVO.upTitle[i].value)
              }
            }
            // console.log("this.state:",_this.state,_this.state.length );
            for(let i=0;i<this.state.length;i++){
              this.partList.push(`${i+1}`)
            }
            // console.log("this.partList:",this.partList);

            _this.defaultCheckedKeys = [];
            for(let i=0;i<_this.baseInfo.resultMap.length;i++){
              _this.defaultCheckedKeys.push(_this.baseInfo.resultMap[i].SIZEID)
            }
            // console.log("_this.defaultCheckedKeys:",_this.defaultCheckedKeys)
  
          }
        }else if(res.data.head.status == -3){
            _this.cateId = null;
            _this.state = [];
            _this.partList = [];
            _this.defaultCheckedKeys = [];
            // _this.$message({
            //   message: '该类别暂未设置关联部位和尺码，请设置',
            //   type: 'warning'
            // });
        } else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning'
          });
        }
      }).catch(err=>{
        console.log(err)
      });
    },
    // 以下为部位搜索框相关函数
    querySearch(queryString, cb) {
      var dataList = this.dataList;
      var results = queryString ? dataList.filter(this.createFilter(queryString)) : dataList;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      // console.log(item);
    },
    handleIconClick(i) {
      // console.log(i);
      this.state.splice(i,1);
      // console.log("删除之前的partList",this.partList)
      this.partList.pop();
      // console.log("删除之后的partList",this.partList)

      // console.log("删除之后的state:",this.state)
    },
    // 新增部位
    addParts(){      
      let partLen = this.partList.length
      // console.log("部位数组长度partLen:",partLen)
      
      if(this.partList.length>=20){
        this.$message({
          type:'warning',
          message:'添加部位不要超过20个'
        })
      }else{
        let len = this.state.length
        // console.log("部位数组长度len:",len)
        this.partList.push(`${len}`);
        // console.log("this.partList",this.partList)
      }

    },
    // 保存类别相关联的信息
    saveCateRelatedInfo(){
      // console.log("this.stata",this.state);
      let obj = {};
      let newArr =  Array.from(new Set(this.state))
      // console.log("this.stata",newArr);
      this.state = newArr;
      for(let i=0;i<newArr.length;i++){
        let key = `KEY${i+1}`;
        // console.log("key:",key)
        obj[key] = newArr[i]
      }
      // console.log("部位对象为：",obj);

      let checkedKeys = this.$refs.tree.getCheckedKeys();     // 选中的节点所组成的数组
      // console.log("选中的节点为：",checkedKeys);
      // console.log("title:",obj)
      if(JSON.stringify(obj) == '{}'){
        this.$message({
          type:'warning',
          message:'请添加部位配置'
        })
        return
      }
      if(checkedKeys.length==0){
        this.$message({
          type:'warning',
          message:'请勾选尺码配置'
        })
        return
      }
      let _this = this;
      if(_this.cateId){  // 编辑
        let con = {
          id:_this.cateId,
          brandId:sessionStorage.brandId,
          catergre:_this.$route.query.item.dictitemDisplayName,
          userId:sessionStorage.userId,
          title:JSON.stringify(obj),
          sizeId:checkedKeys,
        }
        
        
        // console.log("保存类别相关配置con:",con)
        let jsonParam = _this.GLOBAL.g_paramJson(con);
        _this.$axios.post(_this.GLOBAL.goods_manager_server + "/size/updateSizeConfInfo", jsonParam).then((res) => {
          // console.log("保存类别相关配置成功-----",res.data.body);
          if(res.data.head.status == 0){
            _this.$message({
              type:"success",
              message:`编辑${_this.$route.query.item.dictitemDisplayName}关联信息成功`
            })
          }else{
            _this.$message({
              message: res.data.head.msg,
              type: 'warning'
            });
          }
        }).catch(err=>{
          console.log(err)
        });
      }else{  // 新增
        let cateArr = [];
        cateArr.push(this.$route.query.item.dictitemDisplayName);
        let con = {
          brandId:sessionStorage.brandId,
          catergre:cateArr,
          userId:sessionStorage.userId,
          title:JSON.stringify(obj),
          sizeId:checkedKeys,
        }
        
        // console.log("保存类别相关配置con:",con)
        let jsonParam = _this.GLOBAL.g_paramJson(con);
        _this.$axios.post(_this.GLOBAL.goods_manager_server + "/size/insertSizeConfInfo", jsonParam).then((res) => {
          // console.log("保存类别相关配置成功-----",res.data.body);
          if(res.data.head.status == 0){
            _this.$message({
              type:"success",
              message:`编辑${_this.$route.query.item.dictitemDisplayName}关联信息成功`
            })
          }else{
            _this.$message({
              message: res.data.head.msg,
              type: 'warning'
            });
          }
        }).catch(err=>{
          console.log(err)
        });
      } 
      // console.log(obj)
    },
    // 获取sizeList
    getSizeList(){
      let _this = this;
      let con = {
        brandId:sessionStorage.brandId   
      }
      let jsonParam = _this.GLOBAL.g_paramJson(con);
      _this.$axios.post(_this.GLOBAL.goods_manager_server + "/size/getSizeInfoAll", jsonParam).then((res) => {
        // console.log("获取到的尺码信息-----",res.data.body);
        if(res.data.head.status == 0){
          _this.sizeList = res.data.body.resultList;

        }else{
          _this.$message({
            message: res.data.head.msg,
            type: 'warning'
          });
        }
      }).catch(err=>{
        console.log(err)
      });
    },
    editSize(item){
      // console.log("编辑尺码，",item);
      this.sizeFlag = true;
      this.sizeId = item.id;
      this.ruleForm.sizeName = item.sizeName;
      this.ruleForm.aliasName = item.aliasName;
    },
    // 新增size
    addSize(){
      // console.log("addSize");
      this.sizeFlag = true;
      this.sizeId = null;
    },
    confirmSize(formName){
      // console.log("确认新增或编辑尺寸");
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.sizeId){  // 编辑
            let _this = this;
            let con = {
              "id":_this.sizeId,
              "sizeName":_this.ruleForm.sizeName,
              "aliasName":_this.ruleForm.aliasName,
              "userId": sessionStorage.userId,
              "brandId": sessionStorage.brandId,
            }
            let jsonParam = _this.GLOBAL.g_paramJson(con);
            _this.$axios.post(_this.GLOBAL.goods_manager_server + "/size/updateSizeInfo", jsonParam).then((res) => {
              if(res.data.head.status == 0){
                // console.log("编辑尺码成功-----",res.data.body);
                _this.$message({
                  message: '编辑尺码成功',
                  type: 'success'
                });
                _this.sizeFlag = false;
                // _this.$refs[formName].resetFields();
                _this.ruleForm.sizeName = '';
                _this.ruleForm.aliasName = '';
                _this.getSizeList();
              }else{
                _this.$message({
                  message: res.data.head.msg,
                  type: 'warning'
                });
              }
            }).catch(err=>{
              console.log(err)
            });
          }else{
            let _this = this;
            let con = {
              "userId": sessionStorage.userId,
              "brandId": sessionStorage.brandId,
              "sizeName":_this.ruleForm.sizeName,
              "aliasName":_this.ruleForm.aliasName,
            }
            let jsonParam = _this.GLOBAL.g_paramJson(con);
            _this.$axios.post(_this.GLOBAL.goods_manager_server + "/size/insertSizeInfo", jsonParam).then((res) => {
              if(res.data.head.status == 0){
                // console.log("新增尺码成功-----",res.data.body);
                _this.$message({
                  message: '新增尺码成功',
                  type: 'success'
                });
                _this.sizeFlag = false;
                // _this.$refs[formName].resetFields();
                _this.ruleForm.sizeName = '';
                _this.ruleForm.aliasName = '';
                _this.getSizeList();
              }else{
                _this.$message({
                  message: res.data.head.msg,
                  type: 'warning'
                });
              }
            }).catch(err=>{
              console.log(err)
            });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    cancelSize(formName){
      // console.log("取消新增或编辑尺寸");
      this.sizeFlag = false;
      // this.$refs[formName].resetFields();
      this.ruleForm.sizeName = '';
      this.ruleForm.aliasName = '';
    },
    deleteSize(item){
      // console.log("删除尺码：",item);
      this.$confirm('确认删除该尺码吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let con = {
          "id":item.id,
          // "catergre":"裙裤",
          "brandId": sessionStorage.brandId,
        }
        let jsonParam = _this.GLOBAL.g_paramJson(con);
        _this.$axios.post(_this.GLOBAL.goods_manager_server + "/size/delSizeInfo", jsonParam).then((res) => {
          if(res.data.head.status == 0){
            // console.log("删除尺码成功-----",res.data.body);
            _this.$message({
              message: '删除尺码成功',
              type: 'success'
            });
            _this.getSizeList();
          }else{
            _this.$message({
              message: res.data.head.msg,
              type: 'warning'
            });
          }
        }).catch(err=>{
          console.log(err)
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
      let _this = this;
      
    }

  }
}

</script>

<style scoped lang='less'>
@deep:~'>>>';
#cateRelatedInfo{
  min-height: 82vh;
  text-align: left;
  .relatedInfoCon{
    width:100%;
    display: flex;
    justify-content: space-between;
    h3{
      line-height: 32px;
    }
    .leftBox{
      width:48%;
      border-right:1px solid #ccc;
      .inputList{
        display: flex;
        flex-wrap: wrap;
        .inputItem{
          margin:0 10px 10px 0px;
        }
      }
      .addParts{
        width:50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        border:1px solid #DCDFE6;
        font-size: 30px;
        color: #DCDFE6;
      }
      .addParts:hover{
        cursor:pointer;
      }
      
    }
    .rightBox{
      width:48%;
      // border:1px solid green;
      .sizeList{
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;

        .sizeItem{
          padding:0px 2px;
          width:180px;
          height: 50px;
          border:1px solid #ccc;
          text-align: center;
          margin:0px 8px 8px 0px;
          display: flex;
          align-items: center;
          .sizeName{
            width:140px;
            margin-right:10px;
          }
          .el-icon-edit{
            margin-right:10px;
          }
          .el-icon-delete{
            margin-right:10px;
          }
        }
      }
      .addSize{
        width:50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 32px;
        border:1px solid #ccc;
        color:#999;
      }
      .addSize:hover{
        cursor:pointer;
      }
    }
  }
  .btnBox{
    text-align: center;
    margin:20px 0px;
  }

  

}
</style>