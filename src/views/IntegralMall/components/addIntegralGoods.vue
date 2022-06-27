<template>
  <div class="h-full py-5">
    <el-form ref="form" class="flex justify-around" :model="formData" label-width="80px">
      <div class="content-left">
        <el-form-item label="物品名称" prop="goodsName">
          <el-input v-model="formData.goodsName" />
        </el-form-item>
        <el-form-item label="兑换积分" prop="goodsIntegral">
          <el-input v-model="formData.goodsIntegral" />
        </el-form-item>
        <el-form-item label="物品类别">
          <el-select v-model="formData.goodsSort" placeholder="请选择物品类别">
            <el-option label="积分商品" value="1" />
            <el-option label="引用商品" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="物品原价" prop="goodsPrice">
          <el-input v-model="formData.goodsPrice" />
        </el-form-item>
        <el-form-item label="使用有效期" prop="userLife">
          <el-input v-model.number="formData.userLife" />
        </el-form-item>
        <el-form-item label="物品说明" prop="integralDesc">
          <el-input type="textarea" :rows="4" v-model="formData.integralDesc" />
        </el-form-item>
      </div>
      <el-divider direction="vertical" />
      <div class="content-right">
        <el-form-item label="物品视频">
          <vc-upload v-bind="uploadOptionVide" :class="formData.styleVideo?'el-upload-video':''" :on-remove="onRemoveVideoImg" ref="uploadVideoImg">
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
            <i v-if="!formData.styleVideo&&!uploadVideoFlag" class="el-icon-plus"></i>
          </vc-upload>
          <div v-if="formData.styleVideo" style="margin-top:10px"> <el-button @click="delVideo">删除视频</el-button> </div>
        </el-form-item>
        <p class="tip">*最多可以上传1个视频，大小限制在50M以内，推荐格式mp4</p>
        <el-form-item label="视频贴片">
          <vc-upload v-bind="uploadOptionVideImg" :on-remove="onRemoveVideoImg" ref="uploadVideoImg">
            <i class="el-icon-plus"></i>
          </vc-upload>
        </el-form-item>
        <p class="tip">*最多可以上传1张图片，推荐格式jpg或png</p>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'AddIntegralGoods',
  data() {
    return {
      formData: {
        goodsName: '',
        goodsSort: '',
        goodsIntegral: '',
        goodsPrice: '',
        styleVedio: '',
        vedioImage: '',
        image: '',
        integralDesc: '',
        userLife: null,
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
</style>
