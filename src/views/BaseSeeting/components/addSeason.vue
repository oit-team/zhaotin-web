<template>
  <div class="pageCommonStyle" id='addCategory'>
    <el-page-header @back="goBack" :content="editFlag ? '新增季节' : '修改季节'"></el-page-header>
    <el-divider></el-divider>
    <el-form style="margin-top:20px;" :model="seasonForm" :rules="rules" ref="seasonForm" label-width="140px" class="demo-seasonForm">
      <el-form-item label="季节名称" prop="seasonName" >
        <el-input v-model.trim="seasonForm.seasonName" style="width:60%;min-width: 350px;"  placeholder="请输入季节名称"></el-input >
      </el-form-item>
      <el-form-item label="季节" prop="season">
        <el-select v-model="seasonForm.season" placeholder="请选择季节" style="width:40%;;min-width:350px">
          <el-option
            v-for="item in seasonList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品新款推荐" prop="isStyleRecommended">
        <el-select v-model="seasonForm.isStyleRecommended" style="width:40%;;min-width:350px" placeholder="请选择是否为商品新款推荐">
          <el-option
            v-for="item in styleRecommended"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围" prop="seasonTime">
        <el-date-picker
          style="width:40%;min-width:350px"
          v-model="seasonForm.seasonTime"
          type="daterange"
          range-separator="至"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-check" type="primary" @click="submitForm('seasonForm')">保存</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="resetForm('seasonForm')">重置</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { addSeason, updateSeason, getSeasonById } from '@/api/goods'
export default {
  name:'addSeason',
  data(){
    return {
      editFlag:false,
      styleRecommended: [
        {
          label: '是',
          value: '1',
        },
        {
          label: '否',
          value: '0',
        },
      ],
      seasonList: [
        {
          label: '春',
          value: 1,
        },
        {
          label: '夏',
          value: 2,
        },
        {
          label: '秋',
          value: 3,
        },
        {
          label: '冬',
          value: 4,
        },
      ],
      seasonForm: {
        seasonName: "",
        season: "",
        isStyleRecommended: null,
        seasonTime: '',
      },
      rules: {
        seasonName: [
          { required: true, message: '请输入季节名称', trigger: 'blur' },
        ],
        season: [
          { required: true, message: '请选择季节', trigger: 'blur' },
        ],
        isStyleRecommended: [
          { required: true, message: '请选择是否为商品新款推荐', trigger: 'blur' },
        ],
        seasonTime: [
          { required: true, message: '请选择时间范围', trigger: 'blur' },
        ]
      },
    }
  },
  created(){
    if(this.$route.query.item){
      this.editFlag = false;
      this.loadInfo(this.$route.query.item.row)
      
    }else{
      this.editFlag = true;
    }
  },
  mounted(){
  },
  computed:{
  },
  methods:{
    goBack(){
      this.$router.go(-1);   // 查看直接返回
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    loadInfo(row) {
      if(row) {
        const con = {
          seasonId: row.id
        }
        getSeasonById(con).then((res) => {
          if (res.head.status == 0) {
            this.seasonForm.seasonName = res.body.resultList.seasonName
            this.seasonForm.season = res.body.resultList.season
            this.seasonForm.isStyleRecommended = res.body.resultList.isStyleRecommended.toString()
            this.seasonForm.id = res.body.resultList.id
            this.seasonForm.seasonTime = [res.body.resultList.seasonStartTime,res.body.resultList.seasonEndTime]
          } else {
            this.$message({
              message: res.head.msg,
              type: 'warning',
            })
          }
        })
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveFunction();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    saveFunction(){
      let con = this.seasonForm
      con.seasonStartTime = this.seasonForm.seasonTime[0]
      con.seasonEndTime = this.seasonForm.seasonTime[1]
      if(!this.editFlag){  // 编辑
       updateSeason(con).then((res) => {
         if(res.head.status === 0) {
          this.$message({
            message: "修改季节成功",
            type: "success",
          })
          this.$router.back();
         }
       })
      }else{  // 新增
        addSeason(con).then((res) => {
          if(res.head.status === 0) {
            this.$message({
              message: "新增季节成功",
              type: "success",
            })
            this.$router.back();
          }
        })
      }
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
/deep/.el-page-header__content{
  font-size:14px!important;
  font-weight: 500!important;
}
/deep/.el-date-editor .el-range-separator{
  width:20px;
}
</style>