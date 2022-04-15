<template>
  <div id="addGoods" class="pageCommonStyle">
    <div class="flex justify-between items-center">
      <el-page-header :content="title" @back="goBack" />
      <div class="">
        <el-button v-if="operateFlag!=&quot;view&quot;" size="small" icon="el-icon-check" type="primary" @click="saveGood('ruleForm')">保存</el-button>
        <el-button v-if="operateFlag!=&quot;view&quot;" size="small" icon="el-icon-position" type="success" @click="releaseGood('ruleForm')">发布</el-button>
      </div>
    </div>

    <el-divider class="divider" />

    <el-form ref="ruleForm" class="demo-ruleForm" :model="ruleForm" :rules="rules" label-width="98px">
      <div class="goodsFormBox">
        <!-- 菜单栏 -->
        <div class="w-4/5">
          <el-tabs class="" v-model="activeNum">
            <!-- 基础信息面板 -->
            <el-tab-pane class="msgTab" label="基础信息" name="message">
              <!-- <el-collapse-item title="" name="1"> -->
              <div class="flex">
                <div class="left left-box">
                  <el-form-item label="商品名称" prop="styleName">
                    <el-input v-model.trim="ruleForm.styleName" style="width:76%;" maxlength="32" placeholder="请输入商品名称" />
                  </el-form-item>
                  <el-form-item label="商品编号" prop="styleNo">
                    <el-input v-model.trim="ruleForm.styleNo" style="width:76%;" maxlength="32" placeholder="请输入商品编号" />
                  </el-form-item>
                  <el-form-item label="商品类别" prop="styleCategory">
                    <el-select v-model="ruleForm.styleCategory" style="width:76%;" placeholder="请选择商品类别">
                      <el-option
                        v-for="item in styleCategory"
                        :key="item.styleType"
                        :label="item.DICTITEM_DISPLAY_NAME"
                        :value="item.DICTITEM_DISPLAY_NAME"
                      />
                    </el-select>
                  <!-- <el-input
                    v-model="ruleForm.styleCategory"
                    style="width:76%;"
                    maxlength="32"
                    placeholder="请输入商品类别"
                  /> -->
                  </el-form-item>
                  <el-form-item label="商品廓形" prop="styleFlowerPattern">
                    <el-input v-model.trim="ruleForm.styleFlowerPattern" style="width:76%;" maxlength="32" placeholder="请输入商品廓形" />
                  </el-form-item>
                  <el-form-item label="商品材质" prop="styleFabric">
                    <el-input v-model.trim="ruleForm.styleFabric" style="width:76%;" maxlength="64" placeholder="请输入商品材质" />
                  </el-form-item>
                  <!-- 基础配置折叠面板 -->
                  <el-collapse>
                    <el-collapse-item title="基础配置" name="1">
                      <el-form-item label="所属季节" prop="bandName">
                        <el-select v-model="ruleForm.bandName" style="width:76%;" placeholder="请选择所属季节">
                          <el-option
                            v-for="item in seasoNameList"
                            :key="item.id"
                            :label="item.seasonName"
                            :value="item.seasonName"
                          />
                        </el-select>
                      </el-form-item>
                      <!-- recommendationLevel  '0' 非重点  ‘1’ 重点款 -->
                      <el-form-item label="是否重点款" prop="recommendationLevel">
                        <!-- <el-input
                v-model="ruleForm.recommendationLevel"
                style="width:76%;"
                maxlength="10"
                placeholder="需要确认字段的详细代表含义"
              /> -->
                        <el-select v-model="ruleForm.styleMajor" style="width:76%;" placeholder="请选择是否标记为重点款">
                          <el-option label="否" value="0" />
                          <el-option label="是" value="1" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="适用场合" prop="styleInfo">
                        <el-input v-model.trim="ruleForm.remarks" style="width:76%;" placeholder="请输入适用场合" />
                      </el-form-item>
                      <el-form-item label="商品标签">
                        <el-input v-model.trim="addLabel" style="width:56%;" maxlength="32" placeholder="请添加商品标签" />
                        <el-button class="addGoods-addBtn" @click="addGoodLabel(addLabel)">新增</el-button>
                      </el-form-item>
                      <div v-if="labelList.length>0" class="labelList">
                        <div v-for="(item,i) in labelList" :key="i" class="labelItem">
                          <span>{{ item }}</span>
                          <i style="font-size:16px;margin-left:10px;" class="el-icon-circle-close" @click="delLabel(i)"></i>
                        </div>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
                <div class="fileInfoBox right ml-8">
                  <!-- 商品视频 -->
                  <el-form-item label="商品视频">
                    <vc-upload v-bind="uploadOption" ref="uploadVideo">
                      <i class="el-icon-plus"></i>
                    </vc-upload>
                  </el-form-item>
                  <p class="tip">*最多可以上传1个视频，大小限制在50M以内，推荐格式mp4</p>

                  <!-- https://www.cnblogs.com/1312mn/p/11233395.html  上传视频参考连接，本功能需要再完善 -->
                  <!-- :on-progress="uploadVideoProcess" 自定义上传的时候貌似不生效 -->
                  <!-- <el-form-item label="商品视频">
                    <el-upload
                      class="el-upload-video"
                      action="#"
                      accept=".mp4,.mov"
                      :before-upload="beforeUploadVideo"
                      :http-request="requestUploadVideo"
                      :show-file-list="false"
                    >
                      <video
                        v-if="videoSrc"
                        style=""
                        class="avatar video-avatar"
                        :src="videoSrc"
                        controls="controls"
                      >
                        <track
                          default
                          kind="captions"
                          srclang="en"
                          src="/video/php/friday.vtt"
                        />
                        抱歉，您的浏览器不支持嵌入视频！
                      </video>
                      <el-progress
                        v-if="!videoSrc&&uploadVideoFlag"
                        type="circle"
                        :percentage="perValue"
                      />
                      <div v-if="!videoSrc&&!uploadVideoFlag" class="addVideoIcon"><i class="el-icon-plus" style="font-size:28px;color:#888;"></i></div>
                    </el-upload>
                    <div v-if="videoSrc"> <el-button @click="delVideo">删除视频</el-button> </div>
                  </el-form-item>
                  <p class="tip">*最多可以上传1个视频，大小限制在50M以内，推荐格式mp4</p> -->

                  <!-- <el-form-item v-if="videoSrc" label="视频贴片">
                    <el-upload
                      class="avatar-uploader"
                      :show-file-list="false"
                      action="#"
                      accept=".jpg,.png"
                      :before-upload="beforeUploadImg"
                      :http-request="requestUploadPatch"
                      :on-preview="handlePictureCardPreview"
                      :on-remove="handleRemove"
                    >
                      <img v-if="imageUrl" alt="" class="patchImage" :src="imageUrl" />
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <div v-if="imageUrl"> <el-button @click="delVideoPatch">删除视频贴片</el-button> </div>
                  </el-form-item> -->
                  <div class="mt-12 ml-12">
                    <el-collapse label="保养及卖点" name="sale">
                      <el-collapse-item title="保养及卖点" name="sale">
                        <el-form-item label="洗涤保养">
                          <quill
                            style="width:96%;"

                            :value="ruleForm.washMaintenance"
                            :editor-setting="editorSetting"
                            :height="&quot;150px&quot;"
                            @changeVal="changeWashMaintenance"
                          />
                        </el-form-item>
                        <el-form-item label="面料卖点">
                          <quill
                            style="width:96%;"
                            :value="ruleForm.sellingPointFabric"
                            :editor-setting="editorSetting"
                            :height="&quot;150px&quot;"
                            @changeVal="changeSellingPointFabric"
                          />
                        </el-form-item>
                        <el-form-item label="设计卖点">
                          <quill
                            style="width:96%;"
                            :value="ruleForm.designSellingPoint"
                            :editor-setting="editorSetting"
                            :height="&quot;150px&quot;"
                            @changeVal="changeDesignSellingPoint"
                          />
                        </el-form-item>
                        <el-form-item label="穿着卖点">
                          <quill
                            style="width:96%;"
                            :value="ruleForm.wearSellingPoint"
                            :editor-setting="editorSetting"
                            :height="&quot;150px&quot;"
                            @changeVal="changeWearSellingPoint"
                          />
                        </el-form-item>
                      </el-collapse-item>
                    </el-collapse>
                  </div>
                </div>
              </div>
              <el-divider />
              <!-- 商品尺码 -->
              <div>
                <!-- 商品尺码 -->
                <div v-if="true" class="goodsSizeBox">
                  <div v-if="sizeInfo">
                    <div style="margin:20px 0px;">
                      <span style="margin-right:20px;">商品尺码</span>
                      <el-button v-if="operateFlag!=&quot;view&quot;&&editSizeFlag" size="small" @click="editSizeConfirm"><i class="el-icon-check"></i>确认</el-button>
                      <el-button v-if="operateFlag!=&quot;view&quot;&&!editSizeFlag" size="small" @click="editSize"><i class="el-icon-edit"></i>编辑</el-button>
                    </div>
                    <el-table
                      style="width: 100%"
                      border
                      :data="sizeInfo.resultMap"
                      @current-change="changeRow"
                    >
                      <el-table-column label="尺码\部位">
                        <template slot-scope="scope">
                          <span>
                            {{ scope.row.SIZE_NAME }}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        v-for="(item, index) in sizeInfo.sizeInfoVO.upTitle"
                        :key="index"
                        :label="item.value"
                      >
                      <!-- <template slot-scope="scope">
              <input v-if="1" v-model="scope.row[item.key]" type="text" maxlength="8" />
              <span v-else>{{ scope.row[item.key] }}</span>
            </template> -->
                      </el-table-column>
                    </el-table>
                    <div style="height:30px;"></div>
                  </div>
                  <div v-else>
                    <div style="margin-right:20px;">商品尺码</div>
                    <p class="noSizeInfo">未发现<span style="color:#e60012;">{{ ruleForm.styleCategory }}</span>相关尺码配置，请前往信息预设中设置。</p>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <!-- 商品颜色面板 -->
            <el-tab-pane label="颜色" name="color">
              <div>
                <!-- 商品颜色 -->
                <div>
                  <div class="my-4">
                    <div class="flex items-center">
                      <ul class="flex direction-col" v-if="colorList.length">
                        <li
                          @click="deleteColor(item,index)"
                          class="wordBorder"
                          v-for="(item,index) in colorList"
                          :key="item"
                        >
                          <p class="text-4xl">{{ item }}</p>
                        </li>
                      </ul>
                      <div class="addColor" @click="addColor"> <i class="el-icon-plus"></i></div>
                    </div>
                    <el-drawer size="30%" :show-close="false" :visible.sync="drawer" class="text-center">
                      <div class="flex justify-between items-center px-4">
                        <p class="text-sm">请输入商品颜色</p>
                        <el-input
                          ref="colorInput"
                          v-model="newColor"
                          @keydown.enter.native="choseColor"
                          style="width:70%;"
                          maxlength="32"
                          placeholder="请输入商品颜色"
                        />
                      </div>
                      <div class="mt-8">
                        <el-button size="small" type="primary" @click="choseColor">确 认</el-button>
                        <el-button size="small" @click="close">取 消</el-button>
                      </div>
                    </el-drawer>
                  </div>
                  <!-- <page-container column>
                  <page-header content="上传文件" /> -->
                  <!-- 上传图片 -->
                  <div class="flex flex-col" v-if="uploadImgFlag">
                    <el-form-item label="商品图片">
                      <vc-upload v-bind="uploadOption" ref="uploadImage">
                        <i class="el-icon-plus"></i>
                      </vc-upload>
                    </el-form-item>
                    <p class="tip">*最多可以上传6张图片(按住Ctrl或Alt键选择多张图片上传)，推荐格式jpg或png</p>

                    <el-form-item label="商品细节">
                      <vc-upload v-bind="uploadOption" ref="uploadImage">
                        <i class="el-icon-plus"></i>
                      </vc-upload>
                    </el-form-item>
                    <p class="tip">*最多可以上传6张图片(按住Ctrl或Alt键选择多张图片上传)，推荐格式jpg或png</p>
                  </div>
                <!-- </page-container> -->
                </div>
              </div>
            </el-tab-pane>
            <!-- 商品价格面板 -->
            <el-tab-pane class="" label="价格" name="price">
              <el-form-item label="成本价格" prop="costPrice">
                <el-input v-model.trim="ruleForm.costPrice" style="width:100%;" maxlength="32" placeholder="请输入成本价格" />
              </el-form-item>
              <el-form-item label="吊牌价格" prop="tagPrice">
                <el-input v-model.trim="ruleForm.tagPrice" style="width:100%;" maxlength="32" placeholder="请输入品牌价格" />
              </el-form-item>
              <el-form-item label="零售价格" prop="retailPrice">
                <el-input v-model.trim="ruleForm.retailPrice" style="width:100%;" maxlength="32" placeholder="请输入零售价格" />
              </el-form-item>
              <!-- 批发价格面板 -->
              <div class="">
                <el-collapse label="批发价格" v-model="ruleForm.tradePrice" :accordion="true" name="tradePrice">
                  <el-collapse-item title="批发价格">
                    <div class="flex items-center justify-between mb-4">
                      <el-input v-model="styleTradePrice[0].minimumOrderQuantity" style="width:20%;" placeholder="请输入起订数" /><div>———</div>
                      <el-input v-model="styleTradePrice[0].maximumOrder" style="width:20%;" placeholder="请输入截止数" /><div>———></div>
                      <el-input v-model="onePrice" style="width:20%;" placeholder="请输入批发价格" />
                    </div>
                    <!-- <div class="flex items-center justify-between mb-4">
                      <el-input v-model="styleTradePrice[1].minimumOrderQuantity" style="width:20%;" placeholder="请输入起订数" /><div>———</div>
                      <el-input v-model="styleTradePrice[1].maximumOrder" style="width:20%;" placeholder="请输入截止数" /><div>———></div>
                      <el-input v-model="twoPrice" style="width:20%;" placeholder="请输入批发价格" />
                    </div>
                    <div class="flex items-center justify-between">
                      <el-input v-model="styleTradePrice[2].minimumOrderQuantity" style="width:20%;" placeholder="请输入起订数" /><div>———</div>
                      <el-input v-model="styleTradePrice[2].maximumOrder" style="width:20%;" placeholder="请输入截止数" /><div>———></div>
                      <el-input v-model="threePrice" style="width:20%;" placeholder="请输入批发价格" />
                    </div> -->
                  <!-- <div><input type="text" /></div> -->
                  </el-collapse-item>
                </el-collapse>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-form>
    <!-- <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog> -->
  </div>
</template>

<script>
import quill from '@/views/common/quillEditor'
import { addQuillTitle } from '@/assets/js/js/quill-title'
import { getGoodsSizeInfo, getSeasonId, getClothingSizeInfo } from '@/api/goods'
import VcUpload from '@/views/common/Upload'
// import FILE_TYPE from '@/views/common/enums/FILE_TYPE'
// import axios from 'axios'

export default {
  name: 'AddGoods',
  components: { VcUpload, quill },
  data() {
    const pricevalidate = (rule, value, callback) => {
      // // console.log("价格验证value",value)
      if (/^\d+\.?\d{0,2}$/.test(value)) {
        if (value.indexOf('.') === '-1' && value.length > 1 && value.slice(0, 1) === '0') {
          callback(new Error('最多包含两位小数的正数且不能为以0开头的正整数'))
        }
      } else {
        callback(new Error('最多包含两位小数的正数且不能为以0开头的正整数'))
      }
      callback()
    }
    return {
      uploadImgFlag: false, // 上传图片的显示隐藏
      colorNum: undefined,
      selectedColorName: [], //
      styleCategory: [], // 商品类别渲染列表
      seasoNameList: [], // 所属季节渲染列表
      startPrice: '', // 起订数
      colorList: [
        // {
        //   colorName: '',
        //   imgUrl: '',
        //   xijieUrl: '',
        //   chima: '',
        // },
      ], // 新增颜色的集合数组
      newColor: '', // 新增的商品颜色个体
      uploadList: [],
      selectedItem: null,
      maxMB: 50,
      drawer: false, // 新增商品颜色弹框显示
      // direction:'rtl', // 弹框打开方向
      activeNum: 'message',
      title: '新增商品',
      brandId: 0,
      goodsId: '',
      activeName: '1',
      addLabel: '', // 商品标签
      labelList: [], // 标签列表
      // 反显的fileList里的url是官方规定字段，拿到的值如果不是url，需要手动的替换一下，要注意逻辑
      fileList: [],
      editorSetting: [
        ['bold', 'italic'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['clean'],
      ],
      // imageUrl: '',
      // sellPoint:"<p>销售买点说的是的空间发生口角发生口角的看法大哥大很好看交换空间</p><br/><p>dfkjgdfkghdfjkgjdk</p>",
      ruleForm: {
        recommendationLevel: '0',
        status: 'NOTGROUNDING', // NOTGROUNDING  未上架  GROUNDING 已上架
        styleId: '', // 款式id
        styleCategory: '', // 商品类别
        styleColor: '', // 商品颜色
        styleFabric: '', // 款式材质
        styleFlowerPattern: '', // 款式廓形
        styleInfo: '', // 款式风格
        styleName: '', // 商品名称
        styleNo: '', // 商品编号
        stylePrice: '', // 商品价格
        remarks: '', // 备注
        // seasonId: '', // 所属季节
        bandName: '', // 所属季节
        retailPrice: '', // 零售价格
        tagPrice: '', // 品牌价格
        costPrice: '', // 成本价格
        styleVideo: '', // 商品视频
        washMaintenance: '', // 洗涤保养
        wearSellingPoint: '', // 穿着卖点
        sellingPointFabric: '', // 面料卖点
        designSellingPoint: '', // 设计卖点
        styleSize: [], // 商品尺码
        styleMajor: '', // 是否重点款
      },
      // 不同的批发价格
      styleTradePrice: [
        {
          minimumOrderQuantity: '',
          maximumOrder: '',
          styleTradePrice: '',
          sort: 1,
        },
        {
          minimumOrderQuantity: '',
          maximumOrder: '',
          styleTradePrice: '',
          sort: 2,
        },
        {
          minimumOrderQuantity: '',
          maximumOrder: '',
          styleTradePrice: '',
          sort: 3,
        },
      ], // 批发价格
      rules: {
        styleName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          {
            min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur',
          },
        ],
        styleNo: [
          { required: true, message: '请输入商品编号', trigger: 'blur' },
          {
            min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur',
          },
        ],
        styleFabric: [
          { required: true, message: '请输入商品材质', trigger: 'blur' },
          // { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        styleColor: [
          { required: true, message: '请输入商品颜色', trigger: 'blur' },
          {
            min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur',
          },
        ],
        styleCategory: [
          { required: true, message: '请选择商品类别', trigger: 'blur' },
        ],
        stylePrice: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          {
            min: 1, max: 10, message: '长度在 1 到 10 位数字', trigger: 'blur',
          },
          { validator: pricevalidate, trigger: 'blur' },
        ],
        bandName: [
          { required: true, message: '请选择所属季节', trigger: 'blur' },
        ],
        costPrice: [
          { required: true, message: '请选择成本价格', trigger: 'blur' },
        ],
        tagPrice: [
          { required: true, message: '请选择吊牌价格', trigger: 'blur' },
        ],
        retailPrice: [
          { required: true, message: '请选择零售价格', trigger: 'blur' },
        ],
        idList: [
          {
            type: 'array', required: true, message: '请选择所属波段/系列', trigger: 'change',
          },
        ],
        styleFlowerPattern: [
          { required: true, message: '请输入商品廓形', trigger: 'blur' },
          // { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        recommendationLevel: [
          { required: true, message: '请确认是否为重点款', trigger: 'blur' },
        ],

      },
      // dialogImageUrl: '',
      // dialogVisible: false,

      // uploadTimer: null,
      // uploadVideoFlag: false,
      // videoUploadPercent: 0, // 上传进度
      // perValue: 0,
      // videoSrc: '',
      // videoSrc:'http://192.168.9.26:9107/ZDNAS/94/20210524/d588a538e8dd3f63b423e8648aba3ce8.mp4',

      // styleId: null,
      // cateOptions: [], // 商品类别

      operateFlag: null, // 操作标志  'view'  查看  'edit'  编辑
      // bandId: null,
      // bandName: null,
      // seriesId: null,
      // seriesName: null,
      // // idList:[],   // 级联回显id数组
      // bandOptions: [],

      // goodSizeFlag: false, // 商品尺寸默认显示与否
      sizeInfo: null, // 商品尺码
      // editSizeFlag: false,
      // sizeTableList: [], // 修改商品尺寸传参值
    }
  },
  computed: {
    // 上传文件组件
    uploadOption() {
      return {
        showFileList: true,
        multiple: true,
        typeOption: {
          'image/*': {
            data: {
              fileType: 0,
            },
          },
          'video/*': {
            data: {
              fileType: 1,
            },
          },
        },
        listType: 'picture-card',
        maxSize: 1024 * 20,
        limit: 6,
        chunkSize: 1024 * 5,
        check: true,
        accept: 'image/*, video/*',
        onSuccess: (file, fileList) => {
          // console.dir(fileList)
          this.uploadList = fileList
          this.selectedColorName[this.colorNum].imgUrl = this.uploadList.response.data.fileUrl
        },
      }
    },
    onePrice() {
      let result = Number(this.ruleForm.retailPrice)
      //   if (this.styleTradePrice[0].minimumOrderQuantity > 0 && this.styleTradePrice[0].maximumOrder < 5)
      //    return  this.styleTradePrice[0].styleTradePrice * 0.8
      // console.log(result)
      this.styleTradePrice.forEach(item => {
        if (Number(item.minimumOrderQuantity) > 0 & Number(item.maximumOrder) < 5) {
          // console.log(Number(item.minimumOrderQuantity))
          result *= 0.9
        } else if (Number(item.minimumOrderQuantity) > 5 & Number(item.maximumOrder) < 10) {
          result *= 0.8
        } else {
          result *= 0.7
        }
      })
      return result
    },
  },
  created() {
    this.getSeasonId()
    if (this.$route.query.item) {
      this.title = '编辑'
      this.ruleForm = this.$route.query.item.row
    //   this.menuIds = '1'
    } else {
      this.title = '新增'
    }
  },
  mounted() {
    addQuillTitle()
    // this.getBandAndSeries()
    this.getGoodsCategory()
  },
  methods: {
    //
    handlePictureCardPreview(file) {
      console.log(file)
    },

    // 删除文件
    // removeFile(index, item) {
    //   this.$refs.upload.abort(item)
    //   this.uploadList.splice(index, 1)
    //   item.url && URL.revokeObjectURL(item.url)
    //   if (item === this.selectedItem) this.selectedItem = null
    // },
    // 点击显示图片
    preview(item) {
      // console.log(item)
      item.url = item.url || URL.createObjectURL(item.raw)
      this.selectedItem = item
    },
    //   点击返回
    goBack() {
      if (this.operateFlag !== 'view') { // 编辑或新增提示一下
        this.$confirm('返回会丢失未保存的数据，确认吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$router.go(-1)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          })
        })
      } else {
        this.$router.back() // 查看直接返回
      }
    },
    // 商品颜色
    addColor() {
      this.drawer = true
      // 打开弹框时自动获取焦点
      this.$nextTick(() => {
        this.$refs.colorInput.focus()
      })
    },
    // 点击删除已输入的商品颜色
    deleteColor(item, index) {
      this.uploadImgFlag = true
      // this.colorList.splice(item, 1)
      this.colorNum = index
      console.log(item)
      this.selectedColorName.push({ item })
      console.log(this.selectedColorName)
    },
    close() {
      this.drawer = false
    },
    choseColor() {
      if (!this.newColor) {
        return this.$message.warning('请输入颜色')
      }
      this.colorList.push(this.newColor)
      this.newColor = ''
      this.drawer = false
    },
    // 卖点去除html标签，多行文本框里使用v-html行不通
    changeWashMaintenance(val) {
      this.ruleForm.washMaintenance = val
      // // console.log("洗涤卖点==",val)
    },
    changeSellingPointFabric(val) {
      this.ruleForm.sellingPointFabric = val
      // // console.log("销售卖点==",val)
    },
    changeDesignSellingPoint(val) {
      this.ruleForm.designSellingPoint = val
      // // console.log("设计卖点==",val)
    },
    changeWearSellingPoint(val) {
      this.ruleForm.wearSellingPoint = val
      // // console.log("穿着卖点==",val)
    },
    removeLabel(val) {
      if (val) {
        const content = val.replace(/<\/?.+?\/?>/g, '')
        return content
      }
      return ''
    },
    // 获取商品类别
    getGoodsCategory() {
      const con = {
        brandId: sessionStorage.brandId,
        type: 'styleCategory',
        userId: sessionStorage.userId,
      }
      // 获取商品类别
      getGoodsSizeInfo(con).then((res) => {
        // console.log(res)
        if (res.head.status === 0) {
          this.styleCategory = res.body.result
        } else {
          this.$message({
            message: res.head.msg,
            type: 'warning',
          })
        }
      }).catch(err => {
        // console.log(err)
      })
    },
    // 获取所属季节
    getSeasonId() {
      const con = {
        bandName: '',
      }
      getSeasonId(con).then((res) => {
        // console.log(res)
        if (res.head.status === 0) {
          this.seasoNameList = res.body.resultList
        } else {
          this.$message({
            message: res.head.msg,
            type: 'warning',
          })
        }
      }).catch(err => {
        // console.log(err)
      })
    },
    // 新增商品标签
    addGoodLabel(val) {
      // // console.log("新增商品标签===");
      if (val) {
        this.labelList.push(val)
        this.addLabel = ''
        // // console.log("this.labelList==",this.labelList)
      } else {
        this.$message({
          type: 'warning',
          message: '您还未输入标签内容',
        })
      }
    },
    // 删除标签
    delLabel(index) {
      this.labelList.splice(index, 1)
    },
    // 尺码==========================
    // 获取商品尺码信息
    getClothingSizeInfo(val) {
      const con = {
        brandId: sessionStorage.brandId,
        // styleNo:_this.ruleForm.styleNo,
        catergre: val,
        styleId: this.ruleForm.styleId,
      }
      getClothingSizeInfo(con).then((res) => {
        console.log(res)
        if (res.data.head.status === 0) {
          if (res.data.body) {
            this.sizeInfo = res.data.body
            this.sizeTableList = res.data.body.resultMap
            this.sizeTableList.forEach(el => {
              el.userId = sessionStorage.userId
              const temp = el.SIZE_NAME
              el.sizeName = temp // 入参时需要将大写（SIZE_NAME）改为小写（sizeName）
              if (el.ID) {
                const tempId = el.ID
                el.id = tempId
              }
            })
            // // console.log("this.sizeTableList,",this.sizeTableList)
          } else {
            this.sizeInfo = null
            this.sizeTableList = []
          }
        } else {
          this.sizeInfo = null
          this.sizeTableList = []
          // _this.$message({
          //   message: res.data.head.msg,
          //   type: 'warning'
          // });
        }
      }).catch(err => {
        // console.log(err)
      })
    },
    // 商品尺码
    editSize() {
      this.editSizeFlag = true
    },
    // 商品尺码
    editSizeConfirm() {
      this.editSizeFlag = false
      // // console.log("this.sizeTableList:",this.sizeTableList)
    },
    changeRow(currentRow, oldCurrentRow) {
      // // console.log("currentRow, ",currentRow,"oldCurrentRow:", oldCurrentRow);
      // 正常来说currentRow一定存在，多判断一下也无妨
      // // console.log("this.sizeTableList:",this.sizeTableList);

      if (currentRow) {
        for (let i = 0; i < this.sizeTableList.length; i++) {
          if (currentRow.SIZE_NAME === this.sizeTableList[i].SIZE_NAME) {
            // // console.log("currentRow.ID == this.sizeTableList[i].ID:",currentRow ,this.sizeTableList[i]);
            this.sizeTableList[i] = currentRow
            // // console.log("this.sizeTableList===",this.sizeTableList)
            return
          }
        }
      }
    },

    // 保存
    saveGood(formName) {
      this.$confirm('确认保存该商品信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.saveGoodFun('NOTGROUNDING', formName, 'save')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消',
        })
      })
    },
    // 发布
    releaseGood(formName) {
      this.$confirm('您确定要发布商品至昭廷吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.saveGoodFun('GROUNDING', formName, 'release')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消',
        })
      })
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 保存/发布公共方法调用
    saveGoodFun(releaseStatus, formName, saveType) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        // // console.log('_this.fileList===',_this.fileList)
        if (valid) {
          // // console.log("_this.ruleForm.idList===",_this.ruleForm.idList)
          if (_this.ruleForm.idList.length === 0) {
            this.$message({
              type: 'warning',
              message: '请在配置信息中选择相应波段/系列',
            })
            return
          }
          const picArr = []
          for (let i = 0; i < _this.fileList.length; i++) {
            const newUrl = `${_this.fileList[i].url}_${i}`
            picArr.push(newUrl)
          }
          console.log(_this.$refs.uploadImage.getUploadImageResults())
          const con = {
            bandId: _this.ruleForm.idList[0] ? _this.ruleForm.idList[0] : null, // 先写死，要动接口的
            seriesId: _this.ruleForm.idList[1] ? _this.ruleForm.idList[1] : null, // 先写死，要动接口的
            bandName: this.bandName, // 这个参数只是为了编辑的时候传递列表反显新修改的所属系列波段，不涉及接口传参
            seriesName: this.seriesName, // 同上
            brandId: sessionStorage.brandId,
            designSellingPoint: _this.ruleForm.designSellingPoint,
            recommendationLevel: _this.ruleForm.recommendationLevel,
            sellingPointFabric: _this.ruleForm.sellingPointFabric,
            status: releaseStatus, // NOTGROUNDING  未上架  GROUNDING 已上架
            styleCategory: _this.ruleForm.styleCategory,
            styleColor: _this.ruleForm.styleColor,
            styleFabric: _this.ruleForm.styleFabric,
            styleFlowerPattern: _this.ruleForm.styleFlowerPattern,
            styleId: _this.ruleForm.styleId,
            styleInfo: _this.ruleForm.styleInfo,
            styleLabel: _this.labelList.join(','),
            styleName: _this.ruleForm.styleName,
            styleNo: _this.ruleForm.styleNo,
            stylePrice: _this.ruleForm.stylePrice,
            // styleVideo: _this.ruleForm.styleVideo,
            styleVideo: _this.videoSrc,
            // styleVideoPatch: _this.ruleForm.styleVideoPatch,
            styleVideoPatch: _this.imageUrl,
            urlArray: picArr.join(','), // 在图片的url后要加上"_对应图片的序号"
            // urlArray:'http://res.oitor.com:8099/upload/143/2021/4/02412068f2724b3cb216e57dd1fb7de3.png_0,http://res.gaodanyi.com:8102/upload/143/2021/5/676d98569ace4f11bd00e9348342d09b.jpg_1',
            washMaintenance: _this.ruleForm.washMaintenance ? _this.ruleForm.washMaintenance : '', // 没有数据设为字符串
            wearSellingPoint: _this.ruleForm.wearSellingPoint,
            sizeList: _this.sizeTableList,
            urlDetailArray: _this.$refs.uploadImage.getUploadImageResults().map((url, index) => `${url}_${index}`).toString(),
          }

          let jsonParam = null
          if (_this.styleId) { // 编辑
            jsonParam = _this.GLOBAL.g_paramJson(con, 40003)
          } else { // 新增
            jsonParam = _this.GLOBAL.g_paramJson(con, 40002)
          }
          _this.$axios.post(`${_this.GLOBAL.goods_manager_server}/style/styleAllMethod`, jsonParam).then((res) => {
            // // console.log("编辑更新商品信息-----",res.data.body);
            if (res.data.head.status === 0) {
              if (_this.styleId) { // 编辑
                // jsonParam = _this.GLOBAL.g_paramJson(con,40003);
                if (_this.fileList.length > 0) {
                  _this.$route.query.item.resUrl = _this.fileList[0].url
                }
                const itemData = { ...this.$route.query.item, ...con }
                _this.$bus.$emit('goodsDetail', itemData) // 事件分发
                // _this.$router.back();
                if (saveType === 'release') { // 编辑时如果点击的是发布，让其返回上一页，点击保存则不返回
                  _this.$message({
                    type: 'success',
                    message: '发布成功',
                  })
                  _this.$router.back()
                }
                if (saveType === 'save') {
                  _this.$message({
                    type: 'success',
                    message: '保存成功',
                  })
                }
              } else { // 新增
                _this.$bus.$emit('goodsDetail', 'add') // 事件分发
                _this.$router.back()
              }
            } else {
              _this.$message({
                message: res.data.head.msg,
                type: 'warning',
              })
            }
          }).catch(err => {
            // console.log(err)
          })
        } else {
          // console.log('error submit!!');
          return false
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
@deep:~'>>>';
#addGoods{
  min-height: 82vh;
  text-align: left;
  margin-left: 100px;
  @{deep} .el-upload-list__item.is-ready {
    display: none;
  }

  //商品基础信息
  .goodsFormBox{
    width:100%;
    line-height: 100%;
    display: flex;
    // justify-content: space-between;
    // border:2px solid red;
    .baseInfoBox{
      width: 46%;
      // border:2px solid red;
      .labelList{
        padding-left:90px;
        display: flex;
        flex-wrap: wrap;
        .labelItem{
          border:1px solid #DCDFE6;
          padding:6px 10px;
          margin-right:10px;
          margin-bottom:10px;
        }
      }
    }
    .fileInfoBox{
      width: 54%;
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
  }
  .tip{
    padding-left:90px;
    color:#e60012;
    margin:12px 0px;
  }
  @{deep} .el-form-item{
    margin-bottom:20px;
  }
  .el-upload-video{
    text-align: left!important;
    @{deep} .el-upload{
      width:70%;
    }
    @{deep} video{
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

  // 商品尺码
  .goodsSizeBox{
    // border:2px solid green;
    .noSizeInfo{
      text-align: center;
      line-height: 60px;
    }
  }
  .saveBtnBox{
    display: flex;
    justify-content: center;
    margin:20px 0px;
  }
  @{deep} .el-tooltip {
    padding: 7px!important;
  }
  @{deep} .el-table__empty-block {
    height: 50px!important;
  }
  @{deep} .el-table .cell{
    text-overflow: clip;
  }
  @{deep} .el-table .cell input{
    width:80%;
    height:20px;
    border:none;
    outline: 1px solid #aaa;
  }
  @{deep} .el-table .cell input:focus {//获取焦点
    outline: 1px solid #1978fe;//边框不用border，用outline
    // background: rgba(3, 16, 28, 0);//背景色
  }
  .addGoods-addBtn{
    margin-left: 10px;
  }
  .divider {
    margin: 10px 0;
  }
}
.el-tabs__item {
  margin-left: 200px!important;
}
.left-box {
  width: 372px;
}
.wordBorder {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed #ccc;
  margin-left: 20px;
  margin-bottom: 15px;
  background-color: rgb(240, 238, 238);
}
.addColor {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed #ccc;
  margin-left: 20px;
  margin-bottom: 15px;
  background-color: rgb(240, 238, 238);
}
.wordBorder:hover {
  opacity: 0.3;
  background-color: rgb(63, 61, 61);
}
.addColorStyle {
  height: 80px;
}
/deep/ .el-tabs__item {
  padding: 0 80px;
  height: 40px;
  box-sizing: border-box;
  line-height: 40px;
  display: inline-block;
  list-style: none;
  font-size: 14px;
  font-weight: 800;
  color: #303133;
  position: relative;
    left: 300px;
}
/deep/ .el-tabs__active-bar {
  display: none;
}
</style>
