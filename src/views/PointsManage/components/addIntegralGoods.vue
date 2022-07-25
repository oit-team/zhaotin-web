<template>
  <div class="h-full py-5">
    <div class="flex justify-between items-center">
      <el-page-header :content="title" @back="$router.back()" />
      <div v-if="isEdit">
        <el-button size="small" icon="el-icon-check" type="primary" @click="saveGood('formData', 0)">
          保存
        </el-button>
        <el-button size="small" icon="el-icon-position" type="success" @click="saveGood('formData', 1)">
          发布
        </el-button>
      </div>
    </div>

    <el-divider />
    <!-- 表单 -->
    <el-form
      ref="formData"
      v-loading="loading"
      class="flex justify-around"
      :model="formData"
      label-width="100px"
      :rules="rules"
    >
      <div class="content-left w-2/5">
        <el-form-item label="物品名称" prop="goodsName">
          <el-input v-model="formData.goodsName" placeholder="请输入物品名称" />
        </el-form-item>
        <el-form-item label="兑换积分" prop="goodsIntegral">
          <el-input v-model="formData.goodsIntegral" placeholder="请输入数字" />
        </el-form-item>
        <!-- <el-form-item label="物品类别" prop="goodsSort">
          <el-select v-model="formData.goodsSort" placeholder="请选择物品类别">
            <el-option label="积分商品" value="1" />
            <el-option label="引用商品" value="2" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="物品类型" prop="goodsType">
          <el-select v-model="formData.goodsType" placeholder="请选择物品类别">
            <el-option v-for="(item, index) in IntegralType" :key="index" :label="item.categoryName" :value="item.orderKey" />
          </el-select>
        </el-form-item>
        <el-form-item label="物品原价" prop="goodsPrice">
          <el-input v-model="formData.goodsPrice" placeholder="单位：元" />
        </el-form-item>
        <el-form-item label="使用有效期" prop="userLife">
          <el-input v-model.number="formData.userLife" placeholder="单位：天" />
        </el-form-item>
        <el-form-item label="物品说明" prop="integralDesc">
          <el-input v-model="formData.integralDesc" type="textarea" :rows="4" />
        </el-form-item>
      </div>
      <el-divider direction="vertical" />
      <div v-if="!$route.query.cite" class="content-right w-2/5">
        <el-form-item label="物品视频">
          <!-- <vc-upload v-bind="uploadOptionVideo" class="el-upload-video" :on-remove="onRemoveVideo" ref="uploadVideo"> -->
          <VcUpload
            v-if="!formData.video"
            v-bind="uploadOptionVideo"
            ref="uploadVideo"
            :on-remove="onRemoveVideo"
          >
            <i class="el-icon-plus"></i>
            <!-- <el-progress type="circle" :percentage="percentage" /> -->
          </VcUpload>
          <video
            v-if="formData.video"
            class="avatar video-avatar"
            :src="formData.video"
            controls="controls"
            :poster="formData.videoImage"
          >
            <source :src="formData.video" type="video/mp4" />
            <track kind="captions" label="English captions" src="" srclang="en" default />
            您的浏览器不支持视频播放
          </video>
          <div v-if="formData.video" style="margin-top:10px">
            <el-button @click="formData.video = ''">
              删除视频
            </el-button>
          </div>
        </el-form-item>
        <p class="tip">
          *最多可以上传1个视频，大小限制在50M以内，推荐格式mp4
        </p>
        <!-- <el-form-item label="视频贴片">
          <VcUpload v-bind="uploadOptionVideoImg" ref="uploadVideoImg" :on-remove="onRemoveVideoImg">
            <i class="el-icon-plus"></i>
          </VcUpload>
        </el-form-item> -->
        <!-- <p class="tip">
          *最多可以上传1张图片，推荐格式jpg或png
        </p> -->
        <el-form-item label="物品图片">
          <VcUpload v-bind="uploadOptionimg" ref="goodsImg" :on-remove="onRemoveGoodsImg">
            <i class="el-icon-plus"></i>
          </VcUpload>
        </el-form-item>
        <p class="tip">
          *最多可以上传6张图片，推荐格式jpg或png
        </p>
      </div>
      <div v-else class="content-right w-2/5">
        <div class="flex flex-wrap justify-between">
          <div class="flex w-2/5 items-center mb-5">
            <p class="flex-shrink-0 mr-2 text-sm">
              款式名称
            </p>
            <el-input v-model="searchData.styleName" placeholder="" size="medium" />
          </div>
          <div class="flex w-2/5 items-center mb-5">
            <p class="flex-shrink-0 mr-2 text-sm">
              款式编号
            </p>
            <el-input v-model="searchData.styleNo" placeholder="" size="medium" />
          </div>
          <div class="flex items-center mb-5">
            <p class="flex-shrink-0 mr-2 text-sm">
              创建时间
            </p>
            <el-date-picker
              v-model="searchData.creatTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy/MM/dd"
              :default-time="['00:00:00', '23:59:59']"
            >
            </el-date-picker>
          </div>
        </div>
        <div class="sub flex justify-around">
          <el-button type="primary" @click="searchSub">
            查询
          </el-button>
          <el-button type="info" @click="resetSearch">
            清空
          </el-button>
        </div>
        <el-divider />
        <div class="goodsList">
          <template v-if="emp">
            <el-empty description="描述文字"></el-empty>
          </template>
          <div v-else ref="content" class="zt-content">
            <div
              v-for="(item, index) in goodsList"
              :key="index"
              class="zt-content__item"
              :class="selectGoods === index ? '!border-yellow-500' : ''"
              @click="selecteD(item, index)"
            >
              <el-image
                class="zt-good__image"
                :src="item.resUrl"
                fit="contain"
              />
              <div class="zt-item__line">
                <p class="truncate">
                  {{ item.styleName }}@
                </p>
                <p>{{ item.styleNo }}</p>
              </div>
              <!-- <div class="zt-item__line flex items-end">
                <div class="zt-price__l">
                  ￥{{ item.tradePrice }}
                </div>
                <div class="zt-price__r">
                  积分：<div class="zt-item__price">
                    {{ item.goodsIntegral }}
                  </div>
                </div>
              </div> -->
            </div>
          </div>

          <el-pagination
            layout="prev, pager, next"
            :total="totalNum"
          >
          </el-pagination>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import {
  addIntegralGoods,
  getIntegralGoodsDetailed,
  getTypeAndDate,
  updateIntegralGoods,
  updateIntegralGoodsState,
} from '@/api/integral'
import { getProductList } from '@/api/product'
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
      VideoImgList: {}, // 视频贴片
      videoUrl: '',
      uploadList: [],
      fileList: [],
      activeGoodsShow: false,
      uploadVideoFlag: false,
      activeGoodsSize: [],
      uploadImgFlag: false, // 上传图片的显示隐藏
      operateFlag: null, // 操作标志  'view'  查看  'edit'  编辑
      IntegralType: [],
      selectedColorName: [],
      title: '',
      colorNum: undefined,
      // -----------
      formData: {
        goodsName: '',
        goodsSort: '',
        goodsType: '',
        goodsCode: '',
        goodsIntegral: '',
        goodsPrice: '',
        styleVideo: '',
        videoImage: '',
        images: [],
        integralDesc: '',
        userLife: null,
        state: null,
      },
      rules: {
        goodsName: [
          { required: true, message: '请输入物品名称', trigger: 'blur' },
        ],
        // goodsSort: [
        //   { required: true, message: '请选择物品类别' },
        // ],
        goodsType: [
          { required: true, message: '请选择物品类型' },
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
      searchData: {
        styleName: '',
        styleNo: '',
        creatTime: [],
        startDate: '',
        endDate: '',
        pageSize: 9,
        pageNum: 1,
        status: 1,
      },
      goodsList: [],
      selectGoods: 0,
      videoListTest: [],
      emp: false,
      loading: false,
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
        fileList: this.videoListTest,
        listType: 'picture-card',
        maxSize: 1024 * 20,
        chunkSize: 1024 * 2,
        check: true,
        accept: '.mp4,.mov',
        onSuccess: (file, fileList) => {
          this.formData.video = file.data.fileUrl
          this.formData.videoImage = file.data.thumbUrl
          this.videoListTest.push({ url: file.data.thumbUrl })
        },
      }
    },
    // 上传视频贴片
    // uploadOptionVideoImg() {
    //   return {
    //     showFileList: true,
    //     multiple: true,
    //     typeOption: {
    //       'image/*': {
    //         data: {
    //           fileType: 0,
    //         },
    //       },
    //     },
    //     fileList: this.fileList,
    //     listType: 'picture-card',
    //     maxSize: 1024 * 20,
    //     limit: 1,
    //     chunkSize: 1024 * 5,
    //     check: true,
    //     accept: 'image/*',
    //     onSuccess: (file, fileList) => {
    //       const data = {
    //         url: file.data.fileUrl,
    //       }
    //       this.uploadList = fileList
    //       this.formData.videoImage = data
    //     },
    //   }
    // },
    // 上传图片
    uploadOptionimg() {
      return {
        showFileList: true,
        typeOption: {
          'image/*': {
            data: {
              fileType: 0,
            },
          },
        },
        fileList: this.formData.images,
        listType: 'picture-card',
        maxSize: 1024 * 20,
        limit: 6,
        chunkSize: 1024 * 5,
        check: true,
        accept: 'image/*',
        onSuccess: (file, fileList) => {
          const data = {
            url: file.data.fileUrl,
          }
          this.uploadList.push(data)
          this.formData.images.push(data)
        },
      }
    },
  },
  created() {
    this.isEdit = this.$route.query.flag
    if (this.$route.query.flag === '1')
      this.isEdit = false
    else
      this.isEdit = true

    if (this.$route.query.item) {
      if (this.isEdit === false)
        this.title = '查看商品'
      else
        this.title = '编辑商品'

      this.formData.goodsCode = this.$route.query.item.row.goodsCode
      this.getData()
    } else {
      this.title = '新增商品'
      this.getGoodsList()
      this.getType()
    }
  },
  methods: {
    getData() {
      getIntegralGoodsDetailed({
        goodsCode: this.formData.goodsCode,
      }).then((res) => {
        this.formData = res.body
        // 因为组件的原因 upData 组件渲染需要key url  所以需要转换
        const imagesUrl = []
        this.formData.images.forEach(e => {
          const data = {
            url: e,
          }
          imagesUrl.push(data)
        })
        this.formData.images = JSON.parse(JSON.stringify(imagesUrl))
        // 因为 视频贴片是字符串  所以也要转换
        const dat = {
          url: this.formData.videoImage,
        }
        this.fileList.push(dat)
      }).catch(() => {})
    },
    getType() {
      getTypeAndDate({}).then(res => {
        if (res.head.status !== 0) this.$message(res.head.msg)
        this.IntegralType = res.body.goodsCategory
      })
    },
    onRemoveVideo() {
      this.formData.video = ''
    },
    onRemoveVideoImg() {
      this.formData.vedioImage = ''
    },
    onRemoveGoodsImg(file) {
      this.formData.images = this.formData.images.filter(item => item.url !== file.url)
    },
    saveGood(formName, status) {
      let msg = ''
      if (status === 0) msg = '确认保存该商品信息吗?'
      else if (status === 1) msg = '您确定要发布商品至App与商品中心展示吗?'
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.editGoodFun(status)
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
      this.loading = true
      const imagesUrl = []
      this.formData.images.forEach(e => {
        imagesUrl.push(e.url)
      })
      this.formData.images = [...imagesUrl]
      // this.formData.videoImage = this.formData.videoImage?.url
      this.formData.goodsSort = this.$route.query.cite ? '2' : '1'
      const con = JSON.parse(JSON.stringify(this.formData))
      if (this.title === '新增商品') {
        con.state = '2'
        addIntegralGoods(con).then((res) => {
          if (res.head.status === 0) {
            this.$message({
              type: 'success',
              message: res.head.msg,
            })
            if (status === 0) this.$router.back()
            else this.upgoods()
          } else {
            this.$message({
              type: 'error',
              message: res.head.msg,
            })
          }
        }).catch(() => {
        }).finally(() => {
          this.loading = false
        })
      } else {
        updateIntegralGoods(con).then(res => {
          if (res.head.status !== 0) {
            this.$message(res.head.msg)
          } else {
            if (status === 0) {
              this.$message.success('操作成功')
              this.$router.back()
            } else {
              this.upgoods()
            }
          }
        }).finally(() => {
          this.loading = false
        })
      }
      // if (status === 0) {
      //   this.$router.back()
      // } else {
      //   const con = {
      //     id: [this.formData.goodsCode],
      //     state: 1,
      //   }
      // }
    },
    getGoodsList() {
      getProductList({ ...this.searchData }).then((res) => {
        if (res.head.status !== 0) {
          this.$message('查询失败')
          this.emp = true
        } else {
          this.goodsList = res.body.resultList
          this.totalNum = res.body.totalCount
        }
      })
    },
    upgoods() {
      const con = {
        id: [this.formData.id],
        state: 1,
      }
      updateIntegralGoodsState(con).then((res) => {
        if (res.head.status !== 0) {
          this.$message(res.head.msg)
        } else {
          this.$message.success('发布成功')
          this.$router.back()
        }
      })
    },
    searchSub() {
      this.searchData.startDate = this.searchData.creatTime[0]
      this.searchData.endDate = this.searchData.creatTime[1]
      getProductList({ ...this.searchData }).then((res) => {
        if (res.head.status !== 0) this.$message('查询失败')
        else this.goodsList = res.body.resultList
      })
    },
    resetSearch() {
      this.searchData.styleName = ''
      this.searchData.styleNo = ''
      this.searchData.startDate = ''
      this.searchData.endDate = ''
      this.searchData.creatTime = []
    },
    saveGoodFun() {
    },
    selecteD(item, index) {
      this.selectGoods = index
      this.formData.goodsCode = item.styleNo
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
::v-deep .el-range-separator{
  width: 8% !important;
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
.zt-content {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  min-height: 50vh;
  .zt-content__item:hover {
    cursor: pointer;
  }

  .zt-content__item {
    font-size: 14px;
    position: relative;
    width: 31%;
    height: 100%;
    margin: 0 0 10px 8px;
    color: #333333;
    border-radius: 5px;
    border: 1px solid #ECE8E5;

    .zt-good__image {
      width: 100%;
      height: 110px;
      border-radius: 5px;
      border-bottom: 1px solid #F2F2F2;
    }

    .zt-video__b {
      position: absolute;
      top: 10px;
      right: 10px;
      box-sizing: border-box;
      border-radius: 5px;

      .icon-shipin {
        font-size: 28px;
        color: #FF9606;
        border-radius: 5px;
        background-color: #fff;
      }
    }

    .zt-item__line {
      // display: flex;
      overflow: hidden;
      // align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 8px 14px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .zt-price__l {
      color: #FF0000;
    }

    .zt-price__r {
      display: flex;
      align-items: baseline;
      color: #FF0000;
    }

    .zt-item__price {
      font-size: 24px;
      color: #FF0000;
    }
  }
}
::v-deep .el-loading-spinner{
  left: 50%;
}
</style>
