<template>
  <div class="pageCommonStyle" id='addCategory'>
    <el-page-header @back="goBack" :content="editFlag ? '新增词典' : '修改词典'"></el-page-header>
    <el-divider></el-divider>
    <el-form style="margin-top:20px;" :model="cateGoryForm" :rules="rules" ref="cateGoryForm" label-width="90px" class="demo-cateGoryForm">
      <el-form-item label="词典类型" prop="dictCode" >
        <el-select
					:disabled="!editFlag"
					v-model="cateGoryForm.dictCode"
					placeholder="请选择词典类型" 
          @change="querySortList"
				>
          <el-option
            v-for="item in Dlist"
            :key="item.dictName"
            :label="item.dictName"
            :value="item.dictCode"
					>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="词典名称" prop="dictitemDisplayName" >
        <el-input v-model.trim="cateGoryForm.dictitemDisplayName" style="width:60%;"  placeholder="请输入词典词典名称"></el-input >
      </el-form-item>
      <el-form-item label="词典描述" prop="remark">
        <el-input v-model="cateGoryForm.remark" style="width:60%;"  placeholder="请输入词典描述"></el-input>
      </el-form-item>
      <el-form-item label="词典排序" prop="dictitemOrderkey" class="inline-item">
        <el-input v-model.trim="cateGoryForm.dictitemOrderkey" style="width:60%;"  placeholder="请输入词典排序"></el-input>
      </el-form-item>
      <div class="tip">
        <p>*排序请勿重复,已存在排序号如下:</p>
        <span v-for="(item,index) in sortList" :key='index'>{{item.dictitemOrderkey}}、</span>
      </div>
      <el-form-item label="图片">
        <vc-upload v-bind="uploadOptionCateGory" ref="uploadImage">
          <i class="el-icon-plus"></i>
        </vc-upload>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-check" type="primary" @click="submitForm('cateGoryForm')">保存</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="resetForm('cateGoryForm')">重置</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import VcUpload from '@/views/common/Upload'
import {addCateGory,getDictionaryList,updateDirCateGory,dirSort,getDirSizeSortList} from '@/api/category'

export default {
  name:'addDictionaryType',
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
				dictCode: '',
        dictitemDisplayName: "",
        remark: "",
        dictitemOrderkey: null,
      },
      rules: {
				dictCode: [
					{ required: true, message: '请选择词典类型', trigger: 'change' }
				],
        dictitemDisplayName: [
          { required: true, message: '请输入词典名称', trigger: 'blur' },
          { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
        ],
        dictitemOrderkey:[
          { required: true, message: '请输入词典排序', trigger: 'blur' },
          { validator: validOrder,trigger: "change"}
        ],
      },
      sortList:[],
			Dlist: [],
      upImg: '',
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
    this.querySortList()
    this.getDList()
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
          this.upImg = fileList.response.data.fileUrl
          this.imgList = this.$refs.uploadImage.uploadFiles
        },
				dictName: '',
      }
    },
  },
  methods:{
    goBack(){
      this.$router.go(-1);   // 查看直接返回
    },
    // 获取所有的类型
		async getDList() {
			const res = await getDictionaryList({})
			this.Dlist = res.body.result
		},
    // 查询所有的类别排序字段
    querySortList(){
      const con = {
        userId: sessionStorage.userId,
        dictCode: this.cateGoryForm.dictCode || "ACTEGORY",
        dictitemCode: this.cateGoryForm.dictCode || 'ACTEGORY',
        brandId: sessionStorage.brandId
      }
      getDirSizeSortList(con).then((res) => {
          if(res.head.status === 0) {
           this.sortList = res.body.result
          }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 先查询所输入排序是否已经存在
          let con = {
            userId: sessionStorage.userId,
            dictCode: this.cateGoryForm.dictCode,
            dictitemCode: this.dictitemCode,
            dictitemOrderkey: this.cateGoryForm.dictitemOrderkey,
            // brandId: sessionStorage.brandId
            imgUrl: this.upImg,
          }
          dirSort(con).then((res) => {
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
              })
            }
          }).catch(err=>{
            console.log(err)
          });
        } else {
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
      const con = {
           dictCode: this.cateGoryForm.dictCode,
           ...this.cateGoryForm,
           createId: sessionStorage.userId,
           imgUrl:imgUrlArr.toString()
          }
      if(!this.editFlag){  // 编辑
      
       updateDirCateGory(con).then((res) => {
         console.log(res)
           if(res.head.status === 0) {
                this.$message({
                    message: "修改词典类型成功",
                    type: "success",
                  })
           }
       })
      }else{  // 新增
        addCateGory(con).then((res) => {
            if(res.head.status === 0) {
                  this.$message({
                    message: "新增词典类型成功",
                    type: "success",
                  })
            }
        })
      }
      this.$router.back();
    },
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
    margin-bottom: 22px;
  }

}
</style>