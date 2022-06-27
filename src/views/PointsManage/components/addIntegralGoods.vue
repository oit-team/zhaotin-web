<template>
  <div class="h-full py-5">
    <div class="flex justify-between items-center">
      <el-page-header :content="`${title}商品`" @back="$router.back()" />
      <div class="">
        <el-button v-if="operateFlag!=&quot;view&quot;&&isEdit" size="small" icon="el-icon-check" type="primary" @click="saveGood('formData' , 0)">保存</el-button>
        <el-button v-if="operateFlag!=&quot;view&quot;&&isEdit" size="small" icon="el-icon-position" type="success" @click="saveGood('formData', 1)">发布</el-button>
      </div>
    </div>

    <el-divider />
    <!-- 表单 -->
    <el-form
      ref="formData"
      class="flex justify-between"
      :model="formData"
      label-width="120px"
      :rules="rules"
    >
      <div class="content-left w-2/5">
        <el-form-item label="物品名称" prop="goodsName">
          <el-input v-model="formData.goodsName" placeholder="请输入物品名称" />
        </el-form-item>
        <el-form-item label="兑换积分" prop="goodsIntegral">
          <el-input v-model="formData.goodsIntegral" placeholder="请输入数字" />
        </el-form-item>
        <el-form-item label="物品类别" prop="goodsSort">
          <el-select v-model="formData.goodsType" placeholder="请选择物品类别">
            <el-option label="积分商品" value="1" />
            <el-option label="引用商品" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="物品原价" prop="goodsPrice">
          <el-input v-model="formData.goodsPrice" placeholder="单位：元" />
        </el-form-item>
        <el-form-item label="使用有效期" prop="userLife">
          <el-input v-model.number="formData.userLife" placeholder="单位：天" />
        </el-form-item>
        <el-form-item label="物品说明" prop="integralDesc">
          <el-input type="textarea" :rows="4" v-model="formData.integralDesc" />
        </el-form-item>
      </div>
      <el-divider direction="vertical" />
      <div class="content-right w-2/5">
        <el-form-item label="物品视频">
          <!-- <vc-upload v-bind="uploadOptionVideo" class="el-upload-video" :on-remove="onRemoveVideo" ref="uploadVideo"> -->
          <vc-upload v-show="!formData.styleVideo" v-bind="uploadOptionVideo" :class="formData.styleVideo ?'el-upload-video':''" :on-remove="onRemoveVideo" ref="uploadVideo">
            <i class="el-icon-plus"></i>
            <!-- <el-progress type="circle" :percentage="percentage" /> -->
          </vc-upload>
          <video
            v-if="formData.styleVideo"
            class="avatar video-avatar"
            :src="formData.styleVideo"
            controls="controls"
          >
            <source :src="formData.styleVideo" type="video/mp4" />
            <track kind="captions" label="English captions" src="" srclang="en" default />
            您的浏览器不支持视频播放
          </video>
          <div v-if="formData.styleVideo" style="margin-top:10px"> <el-button @click="formData.styleVideo = ''">删除视频</el-button> </div>
        </el-form-item>
        <p class="tip">*最多可以上传1个视频，大小限制在50M以内，推荐格式mp4</p>
        <el-form-item label="视频贴片">
          <vc-upload v-bind="uploadOptionVideoImg" :on-remove="onRemoveVideoImg" ref="uploadVideoImg">
            <i class="el-icon-plus"></i>
          </vc-upload>
        </el-form-item>
        <p class="tip">*最多可以上传1张图片，推荐格式jpg或png</p>
        <el-form-item label="物品图片">
          <vc-upload v-bind="uploadOptionimg" :on-remove="onRemoveGoodsImg" ref="goodsImg">
            <i class="el-icon-plus"></i>
          </vc-upload>
        </el-form-item>
        <p class="tip">*最多可以上传6张图片，推荐格式jpg或png</p>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getIntegralGoodsDetailed, addIntegralGoods } from '@/api/integral'
import VcUpload from '@/views/common/Upload'

export default {
  name: 'AddIntegralGoods',
  components: {
    VcUpload,
  },
  data() {
    return {
      isEdit: false,
      videoList: [],
      VideoImgList: [], // 视频贴片
      videoUrl: '',
      uploadList: [],
      activeGoodsShow: false,
      uploadVideoFlag: false,
      activeGoodsSize: [],
      uploadImgFlag: false, // 上传图片的显示隐藏
      operateFlag: null, // 操作标志  'view'  查看  'edit'  编辑
      // -----------
      formData: {
        goodsName: '',
        goodsSort: '',
        goodsCode: '',
        goodsIntegral: '',
        goodsPrice: '',
        styleVideo: '',
        videoImage: '',
        image: [],
        integralDesc: '',
        userLife: null,
        state: null,
      },
      rules: {
        goodsName: [
          { required: true, message: '请输入物品名称', trigger: 'blur' },
        ],
        goodsSort: [
          { required: true, message: '请选择物品类别', trigger: 'blur' },
        ],
        goodsIntegral: [
          { required: true, message: '请输入物品兑换说明', trigger: 'blur' },
        ],
        integralDesc: [
          { required: true, message: '请输入物品说明', trigger: 'blur' },
        ],
        goodsPrice: [
          { required: true, message: '请输入物品价格', trigger: 'blur' },
        ],
        userLife: [
          { required: true, message: '请输入物品使用有效期', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    uploadOptionVideo() {
      return {
        showFileList: false,
        multiple: true,
        typeOption: {
          '.mp4,.mov': {
            data: {
              fileType: 1,
            },
          },
        },
        listType: 'picture-card',
        maxSize: 1024 * 20,
        chunkSize: 1024 * 2,
        check: true,
        accept: '.mp4,.mov',
        onSuccess: (file, fileList) => {
          this.formData.styleVideo = file.data.fileUrl
        },
        // onChange: (file, fileList) => {
        //   this.percentage = file.percentage
        // },
      }
    },
    // 上传视频贴片
    uploadOptionVideoImg() {
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
        fileList: this.VideoImgList,
        listType: 'picture-card',
        maxSize: 1024 * 20,
        limit: 1,
        chunkSize: 1024 * 5,
        check: true,
        accept: 'image/*',
        onSuccess: (file, fileList) => {
          this.uploadList = fileList
          this.formData.videoImage = this.uploadList.response.data.fileUrl
        },
      }
    },
    // 上传图片
    uploadOptionimg() {
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
        fileList: this.selectedColorName,
        listType: 'picture-card',
        maxSize: 1024 * 20,
        limit: 6,
        chunkSize: 1024 * 5,
        check: true,
        accept: 'image/*',
        onSuccess: (file, fileList) => {
          this.uploadList = fileList
          this.formData.image.push(this.uploadList.response.data.fileUrl)
        },
      }
    },
  },
  created() {
    this.isEdit = this.$route.query.flag
    if (this.$route.query.flag === '1') {
      this.isEdit = false
    } else {
      this.isEdit = true
    }
    if (this.$route.query.item) {
      if (this.isEdit === false) {
        this.title = '查看'
      } else {
        this.title = '编辑'
      }
      this.formData.goodsCode = this.$route.query.item.row.goodsCode
      this.getData()
    } else {
      this.title = '新增'
    }
  },
  methods: {
    getData() {
      getIntegralGoodsDetailed({
        goodsCode: this.formData.goodsCode,
      }).then(res => {
        this.formData = res.body
      }).catch(() => {})
    },
    onRemoveVideo() {
      this.formData.styleVedio = ''
    },
    onRemoveVideoImg() {
      this.formData.vedioImage = ''
    },
    onRemoveGoodsImg(file) {
      this.formData.image = this.formData.image.filter(item => item.url !== file.url)
      console.log(this.formData.image)
    },
    saveGood(formName, status) {
      let msg = ''
      if (status === 0) {
        msg = '确认保存该商品信息吗?'
      } else if (status === 1) {
        msg = '您确定要发布商品至App与商品中心展示吗?'
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.editGoodFun(status)
            // if (this.title === '编辑') {
            //   // 保存
            // } else {
            //   // 发布 / 上架
            //   this.saveGoodFun()
            // }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消',
            })
          })
        }
      })
    },
    // 点击保存 / 发布
    editGoodFun(status) {
      const con = JSON.parse(JSON.stringify(this.formData))
      console.log(con)
      if (this.title === '新增') {
        con.state = '2'
      }
      addIntegralGoods(con).then((res) => {
        console.log(res)
        if (res.head.status === 0) {
          this.$message({
            type: 'success',
            message: res.head.msg,
          })
          // 如果status === 1 则需要继续掉上架的接口
          // if () {

          // }
          this.$router.back()
        } else {
          this.$message({
            type: 'error',
            message: res.head.msg,
          })
        }
      }).catch(() => {
      })
    },
    saveGoodFun() {
      console.log(123)
    },
  },
}
</script>

<style lang='scss' scoped>
::v-deep .el-divider--vertical{
  height: auto;
}
.fileInfoBox{
  width: 50%;
  padding-left:20px;
  border-left:1px solid #DCDFE6;
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    vertical-align: top;
  }
  .patchImage{
    width: 148px;
    height: 148px;
    display: block;
  }
}
.el-upload-video{
  text-align: left!important;
  outline-width: 500px;
  height:200px;
  overflow:hidden;
  ::v-deep .el-upload{
    width:70%;
  }
  ::v-deep video{
      width:100%;
      height: 200px;
  }
  .addVideoIcon{
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    line-height: 146px;
    vertical-align: top;
  }
}
.tip{
  padding-left:90px;
  color:#e60012;
  margin:12px 0px;
}
</style>
