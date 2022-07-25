<template>
  <div class="pageCommonStyle" id='addCategory'>
    <el-page-header @back="goBack" :content="editFlag ? '新增类别' : '修改类别'"></el-page-header>
    <el-divider></el-divider>
    <el-form style="margin-top:20px;" :model="cateGoryForm" :rules="rules" ref="cateGoryForm" label-width="90px" class="demo-cateGoryForm">
      <el-form-item label="父类别" prop="fatherTypeId" >
        <el-select v-model.trim="cateGoryForm.fatherTypeId" style="width:60%;" placeholder="请选择父类别名称">
            <el-option
              v-for="item in parentList"
              :key="item.id"
              :label="item.dictitemDisplayName"
              :value="item.id">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类别名称" prop="dictitemDisplayName" >
        <el-input v-model.trim="cateGoryForm.dictitemDisplayName" style="width:60%;"  placeholder="请输入类别名称"></el-input >
      </el-form-item>
      <el-form-item label="类别描述" prop="remark">
        <el-input v-model="cateGoryForm.remark" style="width:60%;"  placeholder="请输入类别描述"></el-input>
      </el-form-item>
      <el-form-item label="类别排序" prop="dictitemOrderkey">
        <el-input v-model.trim="cateGoryForm.dictitemOrderkey" style="width:60%;"  placeholder="请输入类别排序"></el-input>
      </el-form-item>
<!--       <el-form-item v-if="cateGoryVisibilty" label="类别图片">
          <span class="text-base text-red-500">*该图片仅作展示，如需修改类别图片重新上传即可</span>
          <div class="w-24 h-24 mb-12">
            <el-image :src="imgUrl" fit="cover" />
          </div>
       </el-form-item> -->
       <el-form-item label="点击上传类别图片">
        <vc-upload v-bind="uploadOptionCateGory" ref="uploadImage">
          <i class="el-icon-plus"></i>
        </vc-upload>
       </el-form-item>
      <div class="tip">
        <p>*排序请勿重复,已存在排序号如下:</p>
        <span v-for="(item,index) in sortList" :key='index'>{{item}},</span>
      </div>
      <el-form-item>
        <el-button size="small" icon="el-icon-check" type="primary" @click="submitForm('cateGoryForm')">保存</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="resetForm('cateGoryForm')">重置</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import VcUpload from '@/views/common/Upload'
import {addStyleTypeInfo,sortList,updateCateGory,sort,getSizeSortList,getParentCategoryList} from '@/api/category'
export default {
  name:'addCategory',
  components:{VcUpload},
  data(){
    const validOrder = (rule, value, callback) => {
      if (/^(?:[1-9]\d*|0)$/.test(value) == false) {
        callback(new Error("请输入正整数"));
      } else {
        callback();
      }
    }
    return {
      cateGoryVisibilty:false,
      imgUrl:'',
      imgList: [], //上传图片的列表
      fileList: [],
      editFlag:false,
      dictitemCode:null,
      cateGoryForm: {
        fatherTypeId:"",
        dictitemDisplayName: "",
        remark: "",
        dictitemOrderkey: null,
        typeId:''
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
      parentList:[]
    }
  },
  created(){
    if(this.$route.query.item){
      this.editFlag = false;
      this.cateGoryVisibilty = true
      this.cateGoryForm = this.$route.query.item.row;
      this.imgUrl = this.$route.query.item.row.imgUrl
      this.imgList = [{url:this.imgUrl}]
      this.fileList = [{url:this.imgUrl}]
      this.dictitemCode = this.$route.query.item.row.dictitemCode
    }else{
      this.editFlag = true;
    }
  },
  mounted(){
    this.querySortList();
    this.queryParentList();
    
  },
  computed:{
    // 上传图片
    uploadOptionCateGory() {
      return {
        showFileList: true,
        multiple: true,
        typeOption: {
          'image/*': {
            data: {
              fileType: 0,
            },
          },
        },
        fileList: this.fileList,
        listType: 'picture-card',
        maxSize: 1024 * 20,
        limit: 1,
        chunkSize: 1024 * 5,
        check: true,
        accept: 'image/*',
        onSuccess: (file, fileList) => {
          // this.imgUrl = this.uploadList.response.data.fileUrl
          this.imgList = this.$refs.uploadImage.uploadFiles
          // console.log(this.imgList)
        },
      }
    },
  },
  methods:{
    goBack(){
      this.$router.go(-1);   // 查看直接返回
    },
    // 查询所有的父类别目录
    queryParentList(){
      const con = {
        "fatherTypeId":''
      }
      getParentCategoryList(con).then((res) => {
          if(res.head.status === 0) {
           this.parentList = res.body.resultList
           
          }
      })
    },
    // 查询所有的类别排序字段
    querySortList(){
      const con = {
        userId: sessionStorage.userId,
        dictCode: "ACTEGORY",
        dictitemCode:'ACTEGORY',
        brandId: sessionStorage.brandId
      }
      getSizeSortList(con).then((res) => {
          if(res.head.status === 0) {
            console.log(res)
           this.sortList = res.body.resultList
          }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {  
        if (valid) {
          console.log(this.cateGoryForm)
          // 先查询所输入排序是否已经存在
          let con = {
            userId: sessionStorage.userId,
            dictCode: "ACTEGORY",
            dictitemCode: this.dictitemCode,
            dictitemOrderkey: this.cateGoryForm.dictitemOrderkey,
            brandId: sessionStorage.brandId,
            typeId: this.cateGoryForm.id
          }
          sort(con).then((res) => {
            if(res.head.status === 0){
                this.saveFunction();
            }else{
              this.$message({
                message: res.head.msg,
                type: 'warning'
              });
            }
          }).catch(err=>{
          });
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    saveFunction(){
      let imgUrlArr = []
      this.imgList.forEach((item,i) => {
        if (item.response) {
          imgUrlArr.push(item.response.data.fileUrl)
        } else {
          imgUrlArr.push(item.url)
        }
      })
      const path = [0, this.cateGoryForm.fatherTypeId].filter(item => item !== '').toString()
      console.log(this.cateGoryForm)
      debugger
      const con = {
           dictCode: "ACTEGORY",
           ...this.cateGoryForm,
           path,
           createId: sessionStorage.userId,
           imgUrl:imgUrlArr.toString(),
           typeId:this.cateGoryForm.id
          }
      if(!this.editFlag){  // 编辑
      // console.log(this.$route.query.item.row.imgUrl);
      
       updateCateGory(con).then((res) => {
           if(res.head.status === 0) {
                this.$message({
                    message: "修改商品类别成功",
                    type: "success",
                  })
           }
       })
      }else{  // 新增
        addStyleTypeInfo(con).then((res) => {
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