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
                  <el-select v-model="ruleForm.styleCategory" style="width:76%;" placeholder="请选择商品类别" @change="changeCate">
                    <el-option
                      v-for="item in cateOptions"
                      :key="item.styleType"
                      :label="item.DICTITEM_DISPLAY_NAME"
                      :value="item.DICTITEM_CODE"
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
                <el-collapse v-model="ruleForm.seasonId">
                  <el-collapse-item title="基础配置" name="1">
                    <el-form-item label="所属季节" prop="seasonId">
                      <el-select v-model="ruleForm.seasonId" style="width:76%;" placeholder="请选择所属季节" @change="changeCate">
                        <el-option
                          v-for="item in cateOptions"
                          :key="item.dicttimeDisplayName"
                          :label="item.dicttimeDisplayName"
                          :value="item.dicttimeDisplayName"
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
                      <el-select v-model="ruleForm.recommendationLevel" style="width:76%;" placeholder="请选择是否标记为重点款">
                        <el-option label="否" value="0" />
                        <el-option label="是" value="1" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="适用场合" prop="styleInfo">
                      <el-input v-model.trim="ruleForm.styleInfo" style="width:76%;" placeholder="请输入适用场合" />
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
                <p class="tip">*最多可以上传1个视频，大小限制在50M以内，推荐格式mp4</p>

                <el-form-item v-if="videoSrc" label="视频贴片">
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
                  <p class="noSizeInfo">未发现<span style="color:#e60012;">({{ ruleForm.styleSize }})</span>相关尺码配置，请前往信息预设中设置。</p>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <!-- 商品颜色面板 -->
          <el-tab-pane label="颜色" name="color">
            <div>
              <!-- 商品颜色 -->
              <div>
                <!-- <page-container column>
                  <page-header content="上传文件" /> -->
                <div class="flex overflow-hidden flex-1 mb-2">
                  <div class="inline-flex flex-col h-full">
                    <vc-upload v-bind="uploadOption" ref="upload">
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                      <div class="el-upload__tip">只能上传图片或视频文件，单次提交最多{{ uploadOption.limit }}个，且不得超过{{ maxMB }}MB</div>
                    </vc-upload>
                    <ul class="overflow-y-auto flex-1 mb-2 space-y-1 upload-list">
                      <li
                        v-for="(item, index) of uploadList"
                        :key="item.uid"
                        class="px-2 py-1 rounded-lg border border-gray-300 border-solid cursor-pointer"
                        :class="{'bg-blue-50': item === selectedItem}"
                        @click="preview(item)"
                      >
                        <div class="flex items-center">
                          <span class="mr-2">
                            <i v-if="/image/.test(item.raw.type)" class="text-xl el-icon-picture-outline"></i>
                            <i v-if="/video/.test(item.raw.type)" class="text-xl el-icon-video-camera"></i>
                          </span>
                          <span class="flex-1 mr-2 truncate">{{ item.name }}</span>
                          <span v-if="item.percentage > 0 && item.percentage < 100">{{ Math.floor(item.percentage) }}%</span>
                          <span v-if="item.percentage >= 100" class="text-green-500">完成</span>
                          <i
                            class="ml-1 w-4 h-4 text-xl text-red-400 rounded-lg el-icon-close hover:bg-gray-100 flex-center"
                            @click.stop="removeFile(index, item)"
                          ></i>
                        </div>
                        <el-progress :show-text="false" :stroke-width="2" :percentage="item.percentage" />
                      </li>
                    </ul>
                    <el-button type="primary" plain @click="submit()">提交</el-button>
                  </div>
                  <div class="flex overflow-hidden flex-1 ml-2 rounded-lg border flex-center">
                    <template v-if="selectedItem">
                      <el-image
                        v-if="/image/.test(selectedItem.raw.type)"
                        class="w-full h-full"
                        :src="selectedItem.url"
                        fit="scale-down"
                      />
                      <video
                        v-if="/video/.test(selectedItem.raw.type)"
                        class="w-full h-full bg-white"
                        :src="selectedItem.url"
                        controls
                      >
                        <track
                          default
                          kind="captions"
                          srclang="en"
                          src="/video/php/friday.vtt"
                        />
                        抱歉，您的浏览器不支持嵌入视频！</video>
                    </template>
                    <el-empty v-else description="未选中文件" />
                  </div>
                </div>
                <!-- </page-container> -->
              </div>
              <div class="my-4">
                <el-button @click="drawer = true" type="primary" style="margin-left: 16px;">
                  点击选择颜色
                </el-button>
                <el-drawer
                  :visible.sync="drawer"
                  class="text-center"
                >
                  <el-form-item label="商品颜色" prop="styleColor">
                    <el-input v-model.trim="ruleForm.styleColor" style="width:100%;" maxlength="32" placeholder="请输入商品颜色" />
                  </el-form-item>
                  <div class="">
                    <el-button size="small" @click="close('areaForm')">取 消</el-button>
                    <el-button size="small" type="primary" @click="conAddArea('areaForm')">确 认</el-button>
                  </div>
                </el-drawer>
              </div>
              <!-- 商品图片 -->
              <el-form-item label="商品图片">
              <!--http-request 覆盖默认的上传行为，实现自定义上传
                    on-exceed 文件超出限制个数时的钩子
                    on-preview 点击文件列表中已上传的文件时的钩子
                    on-remove 文件列表移除文件时的钩子  -->
              <!-- <el-upload
                  action="http://home.gaodanyi.com/gdy/"
                  multiple
                  :limit="6"
                  :file-list="fileList"
                  list-type="picture-card"
                  accept=".jpg,.png"
                  :before-upload="beforeUploadImg"
                  :http-request="requestUploadImg"
                  :on-exceed="handleExceed"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
              <p class="tip">*最多可以上传6张图片(按住Ctrl或Alt键选择多张图片上传)，推荐格式jpg或png</p>

              <el-form-item label="商品细节">
                <el-upload v-bind="uploadOption" ref="uploadImage">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
              <p class="tip">*最多可以上传6张图片(按住Ctrl或Alt键选择多张图片上传)，推荐格式jpg或png</p> -->
              <!-- </el-form-item> -->
              </el-form-item>
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
                <!-- <el-collapse-item title="批发价格" name="tradePrice">
                  <div class="flex">
                    <el-form-item class="flex" label="" prop="costPrice">
                      <el-input v-model.trim="ruleForm.costPrice" style="width:60%;" maxlength="32" placeholder="请输入起订数" />
                      <el-input v-model.trim="ruleForm.costPrice" style="width:60%;" maxlength="32" placeholder="请输入截止数" />
                    </el-form-item>
                    <el-form-item label="" prop="costPrice">

                    </el-form-item>
                  </div>
                <el-form-item label="" prop="tagPrice">
                  <el-input v-model.trim="ruleForm.tagPrice" style="width:50%;" maxlength="32" placeholder="请输入品牌价格" />
                </el-form-item>
                <el-form-item label="" prop="retailPrice">
                  <el-input v-model.trim="ruleForm.retailPrice" style="width:50%;" maxlength="32" placeholder="请输入零售价格" />
                </el-form-item>
                </el-collapse-item> -->
                <el-collapse-item title="批发价格">
                  <div><el-input v-model.trim="ruleForm.tradePrice" style="width:80%;" maxlength="32" placeholder="请输入起订数" /></div>
                  <!-- <div><input type="text" /></div> -->
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import quill from '@/views/common/quillEditor'
import { addQuillTitle } from '@/assets/js/js/quill-title'
import { getGoodsSizeInfo, getSeasonId, addAdvertsRes } from '@/api/goods'
import VcUpload from '@/views/common/Upload'
import FILE_TYPE from '@/views/common/enums/FILE_TYPE'
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
      addLabel: '',
      labelList: [], // 标签列表
      // 反显的fileList里的url是官方规定字段，拿到的值如果不是url，需要手动的替换一下，要注意逻辑
      fileList: [],
      editorSetting: [
        ['bold', 'italic'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['clean'],
      ],
      imageUrl: '',
      // sellPoint:"<p>销售买点说的是的空间发生口角发生口角的看法大哥大很好看交换空间</p><br/><p>dfkjgdfkghdfjkgjdk</p>",

      ruleForm: {
        recommendationLevel: '0',
        status: 'NOTGROUNDING', // NOTGROUNDING  未上架  GROUNDING 已上架
        styleCategory: [], // 商品类别
        styleColor: '', // 商品颜色
        styleFabric: '', // 款式材质
        styleFlowerPattern: '', // 款式廓形
        styleInfo: '', // 款式风格
        styleLabel: '',
        seasonId: '', // 所属季节
        styleName: '', // 商品名称
        styleNo: '', // 商品编号
        stylePrice: '', // 商品价格
        retailPrice: '', // 零售价格
        tagPrice: '', // 品牌价格
        costPrice: '', // 成本价格
        tradePrice: '', // 批发价格
        styleVideo: '', // 商品视频
        styleVideoPatch: '', // 款式视频贴片
        washMaintenance: '', // 洗涤保养
        wearSellingPoint: '', // 穿着卖点
        sellingPointFabric: '', // 面料卖点
        designSellingPoint: '', // 设计卖点
        styleId: null, // 款式id
        styleSize: [], // 商品尺码
        idList: [],
      },
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
        seasonId: [
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
      dialogImageUrl: '',
      dialogVisible: false,

      uploadTimer: null,
      uploadVideoFlag: false,
      videoUploadPercent: 0, // 上传进度
      perValue: 0,
      videoSrc: '',
      // videoSrc:'http://192.168.9.26:9107/ZDNAS/94/20210524/d588a538e8dd3f63b423e8648aba3ce8.mp4',

      styleId: null,
      cateOptions: [], // 商品类别

      operateFlag: null, // 操作标志  'view'  查看  'edit'  编辑
      bandId: null,
      bandName: null,
      seriesId: null,
      seriesName: null,
      // idList:[],   // 级联回显id数组
      bandOptions: [],

      goodSizeFlag: false, // 商品尺寸默认显示与否
      sizeInfo: null,
      editSizeFlag: false,
      sizeTableList: [], // 修改商品尺寸传参值
    }
  },
  computed: {
    uploadOption() {
      return {
        drag: true,
        showFileList: false,
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
        maxSize: 1024 * this.maxMB,
        limit: 6,
        chunkSize: 1024 * 5,
        check: true,
        accept: 'image/*,video/*',
        onChange: (file, fileList) => {
          // console.dir(info)
          this.uploadList = fileList
          // console.log(this.uploadList)
        },
      }
    },
  },
  created() {
    // this.requestUploadImg()
    // this.getSeasonId()
    // this.getGoodsInfo()
    // this.getGoodstyle()
    // this.getGoodsSizeInfo()
    // this.getGoofdstyle()
    // // console.log(this.$route.query.item)
    // if (this.$route.query.item) {
    //   this.goodSizeFlag = true
    //   this.operateFlag = this.$route.query.operateFlag
    //   this.styleId = this.$route.query.item.styleId
    //   this.bandId = this.$route.query.item.bandId
    //   this.bandName = this.$route.query.item.bandName
    //   this.seriesId = this.$route.query.item.seriesId
    //   this.seriesName = this.$route.query.item.seriesName
    //   if (this.$route.query.item.styleVideoPatch) {
    //     this.imageUrl = this.$route.query.item.styleVideoPatch
    //   }
    //   this.ruleForm = this.$route.query.item
    //   this.ruleForm.styleNo = this.$route.query.item.styleNo
    //   this.ruleForm.styleCategory = this.$route.query.item.styleCategory
    //   if (this.ruleForm.stylePrice) {
    //     this.ruleForm.stylePrice = String(this.ruleForm.stylePrice)
    //   }

    //   if (this.operateFlag === 'view') {
    //     this.title = '查看商品'
    //   }
    //   if (this.operateFlag === 'edit') {
    //     this.title = '编辑商品'
    //   }
    //   this.getGoodsInfo()
    // } else {
    //   this.operateFlag = this.$route.query.operateFlag
    //   this.title = '新增商品'
    // }
  },
  mounted() {
    addQuillTitle()
    // this.getBandAndSeries()
    this.getGoodsCategory()
  },
  methods: {
    // 删除文件
    removeFile(index, item) {
      this.$refs.upload.abort(item)
      this.uploadList.splice(index, 1)
      item.url && URL.revokeObjectURL(item.url)
      if (item === this.selectedItem) this.selectedItem = null
    },
    preview(item) {
      item.url = item.url || URL.createObjectURL(item.raw)
      this.selectedItem = item
    },
    // submit() {
    //   if (!this.uploadList.length) return this.$message.warning('请先上传文件')
    //   if (!this.$refs.upload.checkUploadDone()) return this.$message.warning('请等待文件全部上传完成后在提交')
    //   console.log(this.uploadList)
    //   const params = this.uploadList.map(item => {
    //     const { type } = item.raw
    //     if (/video/.test(type)) {
    //       return {
    //         resName: item.name,
    //         resUrl: item.response.data.fileUrl,
    //         videoImg: item.response.data.thumbUrl,
    //         resType: FILE_TYPE.VIDEO,
    //       }
    //     } if (/image/.test(type)) {
    //       return {
    //         resName: item.name,
    //         resUrl: item.response.data.data.fileUrls[0].fileUrl,
    //         resType: FILE_TYPE.IMAGE,
    //       }
    //     }
    //   })

    //   addAdvertsRes({
    //     resList: params,
    //   }).then(res => {
    //     this.$message.success('文件提交成功')
    //     this.$router.back()
    //   })
    // },
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
    // 卖点去除html标签，多行文本框里使用v-html行不通
    removeLabel(val) {
      if (val) {
        const content = val.replace(/<\/?.+?\/?>/g, '')
        return content
      }
      return ''
    },
    // 获取商品信息
    // getGoodsInfo() {
    //   const _this = this
    //   const con = {
    //     styleId: _this.styleId,
    //   }
    //   getGoodstyle(con).then((res) => {
    //     console.log('获取到的商品信息-----', res.data.body)
    //     if (res.data.head.status === 0) {
    //       _this.ruleForm = res.data.body.styleInfo
    //       _this.ruleForm.imgUrlList.forEach(el => {
    //         const obj = {}
    //         obj.url = el.RES_URL
    //         _this.fileList.push(obj)
    //       })
    //       _this.videoSrc = _this.ruleForm.styleVideo
    //       _this.ruleForm.stylePrice = String(_this.ruleForm.stylePrice)
    //       // // console.log('_this.ruleForm.styleLabel===',_this.ruleForm.styleLabel)
    //       // _this.labelList = _this.ruleForm.styleLabel.split(',');
    //       if (_this.ruleForm.styleLabel) {
    //         _this.labelList = _this.ruleForm.styleLabel.split(',')
    //       }
    //       if (_this.ruleForm.styleVideoPatch) {
    //         _this.imageUrl = _this.ruleForm.styleVideoPatch
    //       }
    //       // // console.log("_this.imageUrl:",_this.imageUrl)

    //       // // console.log("_this.ruleForm====",_this.ruleForm)
    //       _this.ruleForm.idList = []
    //       if (_this.ruleForm.bandId) {
    //         _this.ruleForm.idList.push(String(_this.ruleForm.bandId))
    //         if (this.seriesId) {
    //           _this.ruleForm.idList.push(String(_this.ruleForm.seriesId))
    //         }
    //       }
    //       _this.getGoodsSizeInfo()
    //     } else {
    //       _this.$message({
    //         message: res.data.head.msg,
    //         type: 'warning',
    //       })
    //     }
    //   }).catch(err => {
    //     // console.log(err)
    //   })
    // },
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
          this.cateOptions = res.body.result
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
        brandId: sessionStorage.brandId,
        pageNum: '1',
        pageSize: '12',
        seriesName: '',
        seriesLabel: '',
      }
      // 获取商品类别
      getSeasonId(con).then((res) => {
        console.log(res)
        if (res.head.status === 0) {
          this.cateOptions = res.body.result
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
    // 修改商品类别
    changeCate(val) {
      // // console.log("商品类别===",val)
      this.ruleForm.styleCategory = val
      this.goodSizeFlag = true
      this.getGoodsSizeInfo()
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
    // // 上传前检测格式
    // beforeUploadImg(file) {
    //   // // console.log("上传图片前：",file)
    //   const pointIndex = file.name.lastIndexOf('.')
    //   const fileType = file.name.substring(pointIndex + 1) // 获取到文件后缀名
    //   // // console.log("fileType==",fileType)
    //   const isJPG = (fileType === 'jpg' || fileType === 'png')
    //   const isLt4M = file.size / 1024 / 1024 < 4
    //   // // console.log('isJPG===',isJPG)
    //   if (!isJPG) {
    //     this.$message.error('上传图片只能是 JPG , PNG格式!')
    //     return
    //   }
    //   if (!isLt4M) {
    //     this.$message.error('上传图片大小不能超过 4MB!')
    //     return
    //   }
    //   return isJPG && isLt4M
    // },
    // handleExceed(files, fileList) {
    //   this.$message.warning(`当前限制选择 6 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    // },
    // // 自定义上传图片函数
    // requestUploadImg(params) {
    //   // console.log(params)
    //   // // console.log("params=====",params)
    //   const reader = new FileReader()
    //   const arr = []
    //   let fileResult = ''
    //   const _this = this
    //   reader.readAsDataURL(params.file)
    //   // //开始转
    //   reader.onload = function (e) {
    //     fileResult = e.currentTarget.result // base64文件流

    //     const str1 = fileResult.replace('data:image/jpeg;base64,', '')// 这里根据自己上传图片的格式进行相应修改
    //     const strLength1 = (str1.length / 8) * 2
    //     // console.log(str1.length)
    //     const fileLength1 = parseInt(str1.length - strLength1, 2)
    //     // 由字节转换为KB
    //     const size1 = ''
    //     // size1 = (fileLength1 / 1024).toFixed(2)
    //     console.log('图片压缩前的文件大小==，', size1)

    //     const Img = new Image()
    //     let dataURL = ''
    //     Img.src = fileResult

    //     Img.onload = function () { // 要先确保图片完整获取到，这是个异步事件
    //       const canvas = document.createElement('canvas') // 创建canvas元素
    //       const { width } = Img // 确保canvas的尺寸和图片一样
    //       const { height } = Img
    //       // 默认将长宽设置为图片的原始长宽，这样在长宽不超过最大长度时就不需要再处理
    //       const ratio = width / height
    //       const maxLength = 1000
    //       let newHeight = height
    //       let newWidth = width
    //       // 在长宽超过最大长度时，按图片长宽比例等比缩小
    //       if (width > maxLength || height > maxLength) {
    //         if (width > height) {
    //           newWidth = maxLength
    //           newHeight = maxLength / ratio
    //         } else {
    //           newWidth = maxLength * ratio
    //           newHeight = maxLength
    //         }
    //       }
    //       canvas.width = newWidth
    //       canvas.height = newHeight
    //       canvas.getContext('2d').drawImage(Img, 0, 0, newWidth, newHeight) // 将图片绘制到canvas中

    //       dataURL = canvas.toDataURL('image/jpeg', 0.6)
    //       // canvas的toDataURL()方法是返回一个包含图片展示的 数据URL，同时可以指定输出格式和质量。
    //       // 语法：canvas.toDataURL(type, encoderOptions);
    //       // 参数：1、type：图片格式，默认为 image/png,可以是其他image/jpeg等
    //       //       2、encoderOptions：0到1之间的取值，主要用来选定图片的质量，默认值是0.92，超出范围也会选择默认值

    //       // // console.log("压缩后的dataURL==，",dataURL);

    //       const str2 = dataURL.replace('data:image/jpeg;base64,', '')// 这里根据自己上传图片的格式进行相应修改
    //       // console.log(str2)
    //       const strLength2 = (str2.length / 8) * 2
    //       const fileLength2 = parseInt(strLength2 - strLength2, 2)
    //       // 由字节转换为KB
    //       let size2 = ''
    //       size2 = (fileLength2 / 1024).toFixed(2)
    //       // console.log('图片压缩后的文件大小==，', size2)
    //       console.log(dataURL)
    //       arr.push(dataURL)

    //       // const params = {
    //       //   files: arr.join('#@#'),
    //       //   fileType: 0,
    //       //   userId: sessionStorage.userId,
    //       // }
    //       axios.post(
    //         'http://192.168.1.101:8080/api/system/file/uploadFile',
    //         {
    //           files: arr.join('#@#'),
    //           fileType: 0,
    //           userId: sessionStorage.userId,
    //         },
    //       ).then((res) => {
    //       // uploadFile(con).then((res) => {
    //         console.log(res)
    //         // // console.log("上传图片返回信息-----",res.data);
    //         if (res.data.code === 200) {
    //           _this.fullscreenLoading = false
    //           // // console.log('res.data.data.fileUrls==',res.data.data.fileUrls)
    //           const obj = {}
    //           obj.url = res.data.data.fileUrls[0].fileUrl
    //           _this.fileList.push(obj)
    //           _this.fileList.push(params.file)
    //           // // console.log("上传成功后的===_this.fileList",_this.fileList)
    //         } else {
    //           _this.$message({
    //             message: '上传失败',
    //             type: 'warning',
    //           })
    //         }
    //       }).catch(err => {
    //         // console.log(err)
    //       })
    //     }
    //   }
    // },
    // // 关闭图片选择弹框
    // close() {
    //   this.drawer = true
    // },
    // // 上传视频贴片，其实可以与上传商品图片走同一个方法，只是没有找到方法去区分上传商品图或者贴片，可以再优化一下
    // requestUploadPatch(params) {
    //   // // console.log("params=====",params)
    //   const reader = new FileReader()
    //   const arr = []
    //   let fileResult = ''
    //   const _this = this
    //   reader.readAsDataURL(params.file)
    //   // //开始转
    //   reader.onload = function (e) {
    //     fileResult = e.currentTarget.result // base64文件流

    //     const str1 = fileResult.replace('data:image/jpeg;base64,', '')// 这里根据自己上传图片的格式进行相应修改
    //     const strLength1 = str1.length
    //     const strNum = (strLength1 / 8) * 2
    //     const fileLength1 = parseInt(strLength1 - strNum, 2)
    //     // 由字节转换为KB
    //     let size1 = ''
    //     size1 = (fileLength1 / 1024).toFixed(2)
    //     // // console.log("图片压缩前的文件大小==，",size1)

    //     const Img = new Image()
    //     let dataURL = ''
    //     Img.src = fileResult

    //     Img.onload = function () { // 要先确保图片完整获取到，这是个异步事件
    //       const canvas = document.createElement('canvas') // 创建canvas元素
    //       const { width } = Img // 确保canvas的尺寸和图片一样
    //       const { height } = Img
    //       // 默认将长宽设置为图片的原始长宽，这样在长宽不超过最大长度时就不需要再处理
    //       const ratio = width / height
    //       const maxLength = 1000
    //       let newHeight = height
    //       let newWidth = width
    //       // 在长宽超过最大长度时，按图片长宽比例等比缩小
    //       if (width > maxLength || height > maxLength) {
    //         if (width > height) {
    //           newWidth = maxLength
    //           newHeight = maxLength / ratio
    //         } else {
    //           newWidth = maxLength * ratio
    //           newHeight = maxLength
    //         }
    //       }
    //       canvas.width = newWidth
    //       canvas.height = newHeight
    //       canvas.getContext('2d').drawImage(Img, 0, 0, newWidth, newHeight) // 将图片绘制到canvas中
    //       dataURL = canvas.toDataURL('image/jpeg', 0.6)
    //       const str2 = dataURL.replace('data:image/jpeg;base64,', '')// 这里根据自己上传图片的格式进行相应修改
    //       // const strLength2 = str2.length
    //       // const fileLength2 = parseInt(strLength2 - (strLength2 / 8) * 2)
    //       // 由字节转换为KB
    //       const size2 = ''
    //       // size2 = (fileLength2 / 1024).toFixed(2)
    //       // // console.log("图片压缩后的文件大小==，",size2)
    //       arr.push(dataURL)
    //       const con = {
    //         files: arr.join('#@#'),
    //         fileType: 0,
    //         userId: sessionStorage.userId,
    //       }
    //       _this.$axios.post(`${_this.GLOBAL.system_manager_server}/file/uploadFile`, con).then((res) => {
    //         if (res.data.code === 200) {
    //           _this.imageUrl = res.data.data.fileUrls[0].fileUrl
    //         } else {
    //           _this.$message({
    //             message: '上传失败',
    //             type: 'warning',
    //           })
    //         }
    //       }).catch(err => {
    //         // console.log(err)
    //       })
    //     }
    //   }
    // },
    // // // 删除视频贴片
    // delVideoPatch() {
    //   this.imageUrl = ''
    // },
    // // 压缩图片
    // imageCompress(base64) {
    //   const _this = this
    //   const Img = new Image()
    //   let dataURL = ''
    //   Img.src = base64
    //   const p = new Promise((resolve, reject) => {
    //     Img.onload = function () { // 要先确保图片完整获取到，这是个异步事件
    //       const canvas = document.createElement('canvas') // 创建canvas元素
    //       const { width } = Img // 确保canvas的尺寸和图片一样
    //       const { height } = Img
    //       // 默认将长宽设置为图片的原始长宽，这样在长宽不超过最大长度时就不需要再处理
    //       const ratio = width / height
    //       const maxLength = 1000
    //       let newHeight = height
    //       let newWidth = width
    //       // 在长宽超过最大长度时，按图片长宽比例等比缩小
    //       if (width > maxLength || height > maxLength) {
    //         if (width > height) {
    //           newWidth = maxLength
    //           newHeight = maxLength / ratio
    //         } else {
    //           newWidth = maxLength * ratio
    //           newHeight = maxLength
    //         }
    //       }
    //       canvas.width = newWidth
    //       canvas.height = newHeight
    //       canvas.getContext('2d').drawImage(Img, 0, 0, newWidth, newHeight) // 将图片绘制到canvas中

    //       dataURL = canvas.toDataURL('image/jpeg', 0.6)
    //       // canvas的toDataURL()方法是返回一个包含图片展示的 数据URL，同时可以指定输出格式和质量。
    //       // 语法：canvas.toDataURL(type, encoderOptions);
    //       // 参数：1、type：图片格式，默认为 image/png,可以是其他image/jpeg等
    //       //       2、encoderOptions：0到1之间的取值，主要用来选定图片的质量，默认值是0.92，超出范围也会选择默认值

    //       resolve(dataURL)
    //     }
    //   })
    //   // // console.log("============p",p,)
    //   // p.then(res=>{
    //   //   // // console.log(res)
    //   // })
    //   return p
    // },
    // // 文件列表移除文件时的钩子
    // handleRemove(file, fileList) {
    //   // // console.log(file, fileList);
    //   this.fileList = fileList
    // },
    // // 点击文件列表中已上传的文件时钩子
    // handlePictureCardPreview(file) {
    //   this.dialogImageUrl = file.url
    //   this.dialogVisible = true
    // },
    // // 上传视频前校验
    // beforeUploadVideo(file) {
    //   // // console.log(file)
    //   // 自己获取后缀名判断文件格式
    //   const pointIndex = file.name.lastIndexOf('.')
    //   const fileType = file.name.substring(pointIndex + 1) // 获取到文件后缀名
    //   if (fileType !== 'mp4' && fileType !== 'mov') {
    //     this.$message.error('你选择的文件不是视频哦，仅支持mp4和mov格式')
    //     return false
    //   }
    // },
    // // 进度条
    // uploadVideoProcess(event, file, fileList) {
    //   // // console.log("进度条===file：",file)
    //   this.videoFlag = true
    //   this.videoUploadPercent = file.percentage.toFixed(0) * 1
    // },
    // // 自定义上传函数
    // requestUploadVideo(params) {
    //   // // console.log('params.file====:',params.file)
    //   const _this = this
    //   const { file } = params
    //   const fileType = 1 // 1 视频 2 音频  默认设为1
    //   const limitUpCount = 50 * 1024 * 1024 // 限制上传大小，大于50M不可以上传
    //   const upFileSize = file.size
    //   // // console.log("要上传的字节大小===",upFileSize,"限制上传的字节大小===",limitUpCount)
    //   if (upFileSize <= limitUpCount) {
    //     _this.videoSrc = ''
    //     _this.uploadVideoFlag = true
    //     // // console.log("文件小于00M,可以上传");
    //     // _this.videoSrc="http://192.168.9.26:9107/ZDNAS/94/20210524/d588a538e8dd3f63b423e8648aba3ce8.mp4"
    //     const chunkSize = 5 * 1024 * 1024// 每个chunk的大小，5兆
    //     const totalChunk = Math.ceil(upFileSize / chunkSize) // 总分片数
    //     // // console.log("总分片数----:",totalChunk)
    //     const userID = sessionStorage.userId
    //     // let tempFileName = file.name;

    //     const nameArr = file.name.split('.')
    //     // // console.log(nameArr)
    //     const curtime = new Date().getTime() // name不可以带中文，以时间戳的形式重新组合传给后端
    //     // // console.log('curtime===',curtime)
    //     const tempFileName = `${curtime}.${nameArr[1]}`

    //     _this.uploadSliceData(0, totalChunk, chunkSize, upFileSize, file, fileType, userID, tempFileName)
    //   } else {
    //     _this.$message({
    //       type: 'warning',
    //       message: '文件大小超过50M,不可以上传',
    //     })
    //     return false
    //   }
    // },

    // // 分段上传音视频函数
    // uploadSliceData(i, totalChunk, chunkSize, totalSize, file, fType, userId, tempFileName) {
    //   const _this = this
    //   if (this.uploadTimer != null) {
    //     clearTimeout(this.uploadTimer)
    //     this.uploadTimer = null
    //   }

    //   // this.perValue = Number((i * 100 / totalChunk).toFixed(1))// 进度
    //   const startPos = i * chunkSize // 当前上传文件块的起始位置
    //   const endPos = Math.min(file.size, startPos + chunkSize)
    //   const formData = new FormData()
    //   // formData.append('file', blobSlice.call(file, startPos, endPos))
    //   formData.append('totalSize', totalSize)
    //   formData.append('startPos', startPos)
    //   formData.append('endPos', endPos)
    //   formData.append('fileType', fType)
    //   formData.append('userId', userId)
    //   formData.append('fname', tempFileName)
    //   formData.append('noThumb', 0)
    //   // // console.log('formData====:',formData)
    //   // // console.log(formData.get('file'))

    //   _this.$axios.post(`${_this.GLOBAL.system_manager_server}/file/upVideoOrAudio`, formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   }).then((res) => {
    //     // // console.log("分片上传视频接口返回信息====",res);
    //     // debugger
    //     if (res.data.status === 101) {
    //       // 一个分片上传成功后继续上传下一个分片
    //       // debugger
    //       _this.uploadTimer = setTimeout(() => {
    //         _this.uploadSliceData(i + 1, totalChunk, chunkSize, totalSize, file, fType, userId, tempFileName)
    //       }, 50)
    //     } else if (res.data.status === 0) {
    //       // 视频整个上传完成
    //       _this.perValue = 100
    //       _this.videoSrc = res.data.fileUrl
    //       _this.uploadVideoFlag = false
    //       // // console.log("上传视频成功后的url======",_this.videoSrc);

    //       // thumbUrl
    //     } else {
    //       // 上传失败,重置信息
    //       _this.perValue = 0
    //       _this.uploadVideoFlag = false
    //       _this.videoSrc = ''
    //       _this.$message({
    //         type: 'error',
    //         message: '视频上传失败，请重试',
    //       })
    //     }
    //   }).catch(err => {
    //     // 上传失败
    //     if (_this.iNum !== i) {
    //       _this.iNum = i
    //       _this.errCount = 1
    //       _this.uploadSliceData(i, totalChunk, chunkSize, totalSize, file, fType, userId, tempFileName)
    //     } else {
    //       _this.errCount += 1
    //       if (_this.errCount === 3) {
    //         // 彻底终止操作
    //         // console.log("上传视频失败，请重试");
    //         document.getElementsByClassName('bar')[0].style.width = '0'
    //         _this.perValue = ''
    //         return false
    //       }
    //       _this.uploadSliceData(i, totalChunk, chunkSize, totalSize, file, fType, userId, tempFileName)
    //     }
    //   })
    // },
    // // 删除当前视频
    // delVideo() {
    //   // // console.log("this.imageUrl:",this.imageUrl)
    //   this.videoSrc = ''
    //   this.imageUrl = ''
    //   // // console.log("this.imageUrl:",this.imageUrl)
    // },

    // 尺码==========================
    // 获取商品尺码信息
    getGoodsSizeInfo() {
      const _this = this
      const con = {
        brandId: sessionStorage.brandId,
        // styleNo:_this.ruleForm.styleNo,
        catergre: _this.ruleForm.styleCategory,
        styleId: _this.ruleForm.styleId,
      }
      const jsonParam = _this.GLOBAL.g_paramJson(con)
      getGoodsSizeInfo(jsonParam).then((res) => {
        // // console.log("获取商品尺码：",res.data.body);
        _this.editSizeFlag = false
        if (res.data.head.status === 0) {
          if (res.data.body) {
            _this.sizeInfo = res.data.body
            _this.sizeTableList = res.data.body.resultMap
            _this.sizeTableList.forEach(el => {
              el.userId = sessionStorage.userId
              const temp = el.SIZE_NAME
              el.sizeName = temp // 入参时需要将大写（SIZE_NAME）改为小写（sizeName）
              if (el.ID) {
                const tempId = el.ID
                el.id = tempId
              }
            })
            // // console.log("_this.sizeTableList,",_this.sizeTableList)
          } else {
            _this.sizeInfo = null
            _this.sizeTableList = []
          }
        } else {
          _this.sizeInfo = null
          _this.sizeTableList = []
          // _this.$message({
          //   message: res.data.head.msg,
          //   type: 'warning'
          // });
        }
      }).catch(err => {
        // console.log(err)
      })
    },
    editSize() {
      this.editSizeFlag = true
    },
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
</style>
