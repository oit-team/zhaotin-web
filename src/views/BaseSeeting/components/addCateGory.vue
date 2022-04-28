<template>
  <div class="pageCommonStyle" id='addCategory'>
    <el-page-header @back="goBack" :content="editFlag ? '新增类别' : '修改类别'"></el-page-header>
    <el-divider></el-divider>
    <el-form style="margin-top:20px;" :model="cateGoryForm" :rules="rules" ref="cateGoryForm" label-width="90px" class="demo-cateGoryForm">
      <el-form-item label="类别名称" prop="dictitemDisplayName" >
        <el-input v-model.trim="cateGoryForm.dictitemDisplayName" style="width:60%;"  placeholder="请输入类别名称"></el-input >
      </el-form-item>
      <el-form-item label="类别描述" prop="remark">
        <el-input v-model="cateGoryForm.remark" style="width:60%;"  placeholder="请输入类别描述"></el-input>
      </el-form-item>
      <el-form-item label="类别排序" prop="dictitemOrderkey">
        <el-input v-model.trim="cateGoryForm.dictitemOrderkey" style="width:60%;"  placeholder="请输入类别排序"></el-input>
      </el-form-item>
      <div class="tip">
        <p>*排序请勿重复,已存在排序号如下:</p>
        <span v-for="(item,index) in sortList" :key='index'>{{item.dictitemOrderkey}},</span>
      </div>
      <el-form-item>
        <el-button size="small" icon="el-icon-check" type="primary" @click="submitForm('cateGoryForm')">保存</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="resetForm('cateGoryForm')">重置</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import {addCateGory,sortList,updateCateGory,sort} from '@/api/category'
export default {
  name:'addCategory',
  components:{},
  data(){
    const validOrder = (rule, value, callback) => {
      if (/^(?:[1-9]\d*|0)$/.test(value) == false) {
        callback(new Error("请输入正整数"));
      } else {
        callback();
      }
    }
    return {
      editFlag:false,
      dictitemCode:null,
      cateGoryForm: {
        dictitemDisplayName: "",
        remark: "",
        dictitemOrderkey: null,
      },
      rules: {
        dictitemDisplayName: [
          { required: true, message: '请输入类别名称', trigger: 'blur' },
          { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
        ],
        dictitemOrderkey:[
          { required: true, message: '请输入类别排序', trigger: 'blur' },
          { validator: validOrder,trigger: "change"}
        ],
      },
      sortList:[],
    }
  },
  created(){
    // console.log(this.$route.query.item);
    if(this.$route.query.item){
      this.editFlag = false;
      this.cateGoryForm = this.$route.query.item.row;
    //   this.dictitemCode = this.$route.query.item.dictitemCode;
    }else{
      this.editFlag = true;
    }
  },
  mounted(){
    this.querySortList();
    
  },
  methods:{
    goBack(){
      this.$router.go(-1);   // 查看直接返回
    },
    // 查询所有的类别排序字段
    querySortList(){
      const con = {
        userId: sessionStorage.userId,
        dictCode: "ACTEGORY",
        dictitemCode:'ACTEGORY',
        dictitemOrderkey: this.cateGoryForm.dictitemOrderkey,
        brandId: sessionStorage.brandId
      }
        sortList(con).then((res) => {
            console.log(res);
            if(res.head.status === 0) {
             this.sortList = res.body.result
            }
        })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 先查询所输入排序是否已经存在
          let con = {
            userId: sessionStorage.userId,
            dictCode: "ACTEGORY",
            dictitemCode: this.dictitemCode,
            dictitemOrderkey: this.cateGoryForm.dictitemOrderkey,
            brandId: sessionStorage.brandId
          }
          sort(con).then((res) => {
            if(res.head.status === 0){
              if(res.body.result === 0){
                this.saveFunction();
              }else{
                this.$message({
                  type:'warning',
                  message:'该排序已存在,请更换'
                })
              }
            }else{
              this.$message({
                message: res.head.msg,
                type: 'warning'
              });
            }
            console.log(res);
          }).catch(err=>{
            console.log(err)
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    saveFunction(){
        const con = {
             dictCode: "ACTEGORY",
             ...this.cateGoryForm,
             createId: sessionStorage.userId,
            }
      if(!this.editFlag){  // 编辑
       updateCateGory(con).then((res) => {
           if(res.head.status === 0) {
                this.$message({
                    message: "修改商品类别成功",
                    type: "success",
                  })
           }
       })
      }else{  // 新增
        addCateGory(con).then((res) => {
            if(res.head.status === 0) {
                  this.$message({
                    message: "新增商品类别成功",
                    type: "success",
                  })
            }
        })
      }
       this.$router.back();
    }
  }
}

</script>

<style scoped lang='less'>
@deep:~'>>>';
#addCategory{
  margin-left: 250px;
  min-height: 82vh;
  text-align: left;
  .tip{
    padding-left:90px;
    color:#e60012;
  }

}
</style>