<template>
  <div id="addGoods" class="pageCommonStyle">
    <div class="flex justify-between items-center">
      <el-page-header :content="title" @back="goBack" />
      <div class="">
        <el-button v-if="operateFlag!=&quot;view&quot;&&isEdit" size="small" icon="el-icon-check" type="primary" @click="saveGood('ruleForm' , 0)">保存</el-button>
        <el-button v-if="operateFlag!=&quot;view&quot;&&isEdit" size="small" icon="el-icon-position" type="success" @click="saveGood('ruleForm', 1)">发布</el-button>
      </div>
    </div>

    <el-divider class="divider" />

    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="98px">
      <div class="goodsFormBox">
        <!-- 菜单栏 -->
        <div>
          <el-tabs v-model="activeNum">
            <!-- 基础信息面板 -->
            <el-tab-pane label="基础信息" name="message">
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
                    <el-select v-model="ruleForm.styleCategory" @change="getClothingSizeInfo" style="width:76%;" placeholder="请选择商品类别">
                      <el-option
                        v-for="item in styleCategory"
                        :key="item.dictitemCode"
                        :label="item.dicttimeDisplayName"
                        :value="item.dicttimeDisplayName"
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
                  <el-collapse v-model="collapseVal2">
                    <el-collapse-item title="价格配置" name="2">
                      <el-form-item label="成本价格" prop="costPrice">
                        <el-input v-model.trim="ruleForm.costPrice" oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')" style="width:76%;" maxlength="32" placeholder="请输入成本价格" />
                      </el-form-item>
                      <el-form-item label="吊牌价格" prop="tagPrice">
                        <el-input v-model.trim="ruleForm.tagPrice" oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')" style="width:76%;" maxlength="32" placeholder="请输入品牌价格" />
                      </el-form-item>
                      <el-form-item label="零售价格" prop="retailPrice">
                        <el-input v-model.trim="ruleForm.retailPrice" oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')" style="width:76%;" maxlength="32" placeholder="请输入零售价格" />
                      </el-form-item>
                      <el-form-item label="批发价格" prop="tradePrice">
                        <el-input v-model.trim="ruleForm.tradePrice" oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')" style="width:76%;" maxlength="32" placeholder="请输入批发价" />
                      </el-form-item>
                    </el-collapse-item>
                  </el-collapse>
                  <!-- 基础配置折叠面板 -->
                  <el-collapse v-model="collapseVal1">
                    <el-collapse-item title="基础配置" name="1">
                      <el-form-item label="所属季节" prop="seriesId">
                        <el-select v-model="ruleForm.seriesId" style="width:76%;" placeholder="请选择所属季节">
                          <el-option
                            v-for="item in seasoNameList"
                            :key="item.id"
                            :label="item.seasonName"
                            :value="item.id"
                          />
                        </el-select>
                      </el-form-item>
                      <!-- recommendationLevel  '0' 非重点  ‘1’ 重点款 -->
                      <el-form-item label="是否重点款" prop="recommendationLevel">
                        <el-select v-model="ruleForm.styleMajor" style="width:76%;" placeholder="请选择是否标记为重点款">
                          <el-option label="否" value="0" />
                          <el-option label="是" value="1" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="适用场合" prop="styleInfo">
                        <el-input v-model.trim="ruleForm.styleInfo" style="width:76%;" placeholder="请输入适用场合" />
                      </el-form-item>
                      <el-form-item label="商品标签">
                        <el-input v-model.trim="addLabel" style="width:calc(76% - 120px)" maxlength="32" placeholder="请添加商品标签" />
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
                  <el-collapse  v-model="collapseVal4">
                    <el-collapse-item title="服务说明" name="1">
                      <el-form-item label="">
                        <quill
                      	style="width:100%;"
                      	:value="ruleForm.service"
                      	:editor-setting="editorSetting"
                      	:height="&quot;150px&quot;"
                      	@changeVal="changeWashMaintenance"
                        />
                      </el-form-item>
                    </el-collapse-item>
                  </el-collapse>
                </div>
                <div class="fileInfoBox right ml-8">
                  <!-- 商品视频 -->
                  <el-form-item label="商品视频">
                    <el-upload
                      :action="uploadUrl"
                      :data="uploadData"
                      :headers="headersData"
                      :on-progress="uploadVideoProcess"
                      multiple
                      :show-file-list="false"
                      list-type="picture-card"
                      accept='.mp4,.mov'
                      :class="ruleForm.styleVideo?'el-upload-video':''"
                      :before-upload="beforeUploadVideo"
                      :on-success="VideoUploadSuccess"
                    >
                      <video
                        style=""
                        v-if='ruleForm.styleVideo'
                        class="avatar video-avatar"
                        :src="ruleForm.styleVideo"
                        controls="controls">
                        您的浏览器不支持视频播放
                      </video>
                      <el-progress v-if="!ruleForm.styleVideo&&uploadVideoFlag" type="circle" :percentage="perValue"></el-progress>
                      <i v-if="!ruleForm.styleVideo&&!uploadVideoFlag" class="el-icon-plus"></i>
                    </el-upload>
                    <div v-if="ruleForm.styleVideo" style="margin-top:10px"> <el-button @click="delVideo">删除视频</el-button> </div>
                  </el-form-item>
                  <p class="tip">*最多可以上传1个视频，大小限制在50M以内，推荐格式mp4</p>
                  
                  <el-form-item label="视频贴片">
                    <vc-upload v-bind="uploadOptionVideImg" @onRemove='onRemoveVideoImg' ref="uploadVideoImg">
                      <i class="el-icon-plus"></i>
                    </vc-upload>
                  </el-form-item>
                  <p class="tip">*最多可以上传1张图片，推荐格式jpg或png</p>
                  <div class="mt-12 ml-12">
                    <el-collapse label="保养及卖点" class="editBox" name="sale" v-model="collapseVal3">
                      <el-collapse-item title="保养及卖点" name="sale">
                        <el-form-item label="面料卖点">
                          <quill
                            style="width:100%;"
                            :value="ruleForm.sellingPointFabric"
                            :editor-setting="editorSetting"
                            :height="&quot;150px&quot;"
                            @changeVal="changeSellingPointFabric"
                          />
                        </el-form-item>
                        <el-form-item label="设计卖点">
                          <quill
                            style="width:100%;"
                            :value="ruleForm.designSellingPoint"
                            :editor-setting="editorSetting"
                            :height="&quot;150px&quot;"
                            @changeVal="changeDesignSellingPoint"
                          />
                        </el-form-item>
                        <el-form-item label="穿着卖点">
                          <quill
                            style="width:100%;"
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
                      <template slot-scope="scope">
                        <input v-if="editSizeFlag" v-model="scope.row[item.key]" oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')" type="text" maxlength="8" />
                        <span v-else>{{ scope.row[item.key] }}</span>
                      </template>
                      </el-table-column>
                    </el-table>
                    <div style="height:30px;"></div>
                  </div>
                  <div v-else>
                    <div style="margin-right:20px;">商品尺码</div>
                    <p class="noSizeInfo">未发现<span style="color:#e60012;">{{ activeStyleCategory.dicttimeDisplayName }}</span>相关尺码配置，请前往信息预设中设置。</p>
                  </div>
                </div>
              </div>
              <el-divider class="divider" />
              <div>
                <!-- 厚薄程度 -->
                <div style="width:40%;float:left">
                  <div>
                    <div style="margin:20px 0px;">
                      <span style="margin-right:20px;">商品版型</span>
                    </div>
                  </div>
                  <div class="styleDataBox" v-for="(item,index) in ruleForm.styleData" :key="index" >
                    <span>{{item.name}}</span>
                    <el-radio-group v-model="item.checked">
                      <el-radio-button v-for="(Item,Index) in item.options" :key="Index" :label="Item.option"></el-radio-button>
                    </el-radio-group>
                  </div>
                </div>
                <div style="width:60%;float:left">
                  <div>
                    <div style="margin:20px 0px;">
                      <span style="margin-right:20px;">洗涤条件</span>
                    </div>
                  </div>
                  <div class="checkBox">
                    <el-checkbox v-for="(item,index) in ruleForm.styleWashing" :key="index" :checked="item.status == 1" v-model="item.status" :label="item.status" :true-label="1" :false-label="0">
                      <img :src="item.resUrl" alt="">
                      <span>{{item.name}}</span>
                    </el-checkbox>
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
                          @contextmenu.prevent="rightClick('color', item, index)"
                          :class="{'active':colorNum == index,'wordBorder':true}"
                          v-for="(item,index) in colorList"
                          :key="item"
                        >  
                          <p class="text-4xl">{{ item }}</p>
                        </li>
                      </ul>
                      <div class="addColor" @click="addColor"> <i class="el-icon-plus"></i></div>
                    </div>
                    <el-drawer size="40%" :show-close="false" :visible.sync="drawer" class="text-center">
                      <div class="flex justify-between items-center px-4">
                        <p class="text-sm">颜色</p>
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
                      <vc-upload v-bind="uploadOptionimg" @onRemove='onRemove' ref="uploadImage">
                        <i class="el-icon-plus"></i>
                      </vc-upload>
                    </el-form-item>
                    <p class="tip">*最多可以上传6张图片，推荐格式jpg或png</p>

                    <el-form-item label="商品细节">
                      <vc-upload v-bind="uploadOptionxijie" @onRemove='onRemoveXj' ref="uploadxijieImage">
                        <i class="el-icon-plus"></i>
                      </vc-upload>
                    </el-form-item>
                    <p class="tip">*最多可以上传6张图片，推荐格式jpg或png</p>
                  </div>
                <!-- </page-container> -->
                </div>
              </div>
              <el-divider />
              <!-- 商品尺码 -->
              <div>
                <!-- 商品尺码 -->
                <div v-if="activeGoodsShow" class="goodsSizeBox">
                  <div v-if="sizeInfo">
                    <div style="margin:20px 0px;">
                      <span style="margin-right:20px;">商品库存</span>
                    </div>
                    <el-table
                      style="width: 100%"
                      border
                      :data="sizeInfo.resultMap"
                      @current-change="changeRow"
                      ref="goodsSizeRef"
                    >
                      <el-table-column type="selection" width="55" >
                      </el-table-column>
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
                      <template slot-scope="scope">
                        <span>{{ scope.row[item.key] }}</span>
                      </template>
                      </el-table-column>
                    </el-table>
                    <div style="height:30px;"></div>
                  </div>
                  <div v-else>
                    <div style="margin-right:20px;">商品尺码</div>
                    <p class="noSizeInfo">未发现<span style="color:#e60012;">{{ activeStyleCategory.dicttimeDisplayName }}</span>相关尺码配置，请前往信息预设中设置。</p>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-form>
    <!-- <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog> -->
    <el-dialog
      :title="editColor.colorName || 'test'"
      :visible.sync="centerDialogVisible"
      :before-close='closeEditColor'
      width="30%"
      center>
      <span>请选择您的操作</span>
      <el-dialog
        width="30%"
        title="提示"
        :visible.sync="innerVisible"
        center
        append-to-body>
        <span>确认删除</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteItem">确 认</el-button>
          <el-button type="primary" @click="closeDialog">取 消</el-button>
        </span>
      </el-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleEditClick">编 辑</el-button>
        <el-button type="primary" @click="innerVisible = true">删 除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import quill from '@/views/common/quillEditor'
import { addQuillTitle } from '@/assets/js/js/quill-title'
import { getGoodsSizeInfo, getSeasonId, getClothingSizeInfo, addGoodsInfo, updateStyleInfo, getStyleData } from '@/api/goods'
import VcUpload from '@/views/common/Upload'
import MD5 from 'crypto-js/md5'
// import FILE_TYPE from '@/views/common/enums/FILE_TYPE'
// import axios from 'axios'

export default {
  name: 'AddGoods',
  components: { VcUpload, quill },
  data() {
    const pricevalidate = (rule, value, callback) => {
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
      innerVisible: false, //删除颜色提示框
      centerDialogVisible: false, //编辑颜色提示框
      editColor: '', //右键颜色时保存数据
      collapseVal4: ['1'],
      collapseVal1: ['1'],
      collapseVal2: ['2'],
      collapseVal3: ['sale'],
      tabPosition: '',
      perValue: '', //上传进度
      uploadVideoFlag: false,
      uploadUrl: '',
      headersData: {
        token: ''
      },
      uploadData: {
        totalSize: '',
        startPos: 0,
        endPos: '',
        fileType: 1,
        userId: '',
        fname: '',
        noThumb: '',
      },
      isEdit: false,
      videoList: [],
      VideoImgList: [], //视频贴片
      videoUrl: '',
      activeGoodsShow: false,
      activeGoodsSize: [],
      uploadImgFlag: false, // 上传图片的显示隐藏
      colorNum: undefined,
      selectedColorName: [], //
      selectedColorNameXiJie: [],
      styleCategory: [], // 商品类别渲染列表
      activeStyleCategory:'', //选中的商品类别
      seasoNameList: [], // 所属季节渲染列表
      seriesList: [], // 所属系列渲染列表
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
        service: '',
        styleData: [],
        styleWashing: [],
        recommendationLevel: '0',
        status: '0', // NOTGROUNDING  未上架  GROUNDING 已上架
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
        seriesId: '', // 所属系列
        retailPrice: '', // 零售价格
        tagPrice: '', // 品牌价格
        costPrice: '', // 成本价格
        styleVideo: '', // 商品视频
        styleVideoPatch: '', //商品视频贴片
        washMaintenance: '', // 洗涤保养
        wearSellingPoint: '', // 穿着卖点
        sellingPointFabric: '', // 面料卖点
        designSellingPoint: '', // 设计卖点
        styleMajor: '', // 是否重点款
        tradePrice: '', //批发价
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
        seriesId: [
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
        tradePrice : [
          { required: true, message: '请输入批发价格', trigger: 'blur' },
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
      editSizeFlag: false,
      // sizeTableList: [], // 修改商品尺寸传参值
    }
  },
  computed: {
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
        fileList: this.selectedColorName[this.colorNum],
        listType: 'picture-card',
        maxSize: 1024 * 20,
        limit: 6,
        chunkSize: 1024 * 5,
        check: true,
        accept: 'image/*',
        onSuccess: (file, fileList) => {
          this.uploadList = fileList
          // this.selectedColorName[this.colorNum].imgUrl = this.uploadList.response.data.fileUrl
          this.selectedColorName[this.colorNum] = this.$refs.uploadImage.uploadFiles
          // this.selectedColorName[this.colorNum].xijieUrl = this.uploadList.response.data.thumbUrl
        },
      }
    },
    // 上传细节图片
    uploadOptionxijie() {
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
        fileList: this.selectedColorNameXiJie[this.colorNum],
        listType: 'picture-card',
        maxSize: 1024 * 20,
        limit: 6,
        chunkSize: 1024 * 5,
        check: true,
        accept: 'image/*',
        onSuccess: (file, fileList) => {
          // console.log(fileList)
          this.uploadList = fileList
          this.selectedColorNameXiJie[this.colorNum] = this.$refs.uploadxijieImage.uploadFiles
          // this.selectedColorName[this.colorNum].xijieUrl = this.uploadList.response.data.thumbUrl
        },
      }
    },
    //上传视频贴片
    uploadOptionVideImg() {
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
          this.ruleForm.styleVideoPatch = this.uploadList.response.data.fileUrl
        },
      }
    },
    // onePrice() {
    //   let result = Number(this.ruleForm.retailPrice)
    //   //   if (this.styleTradePrice[0].minimumOrderQuantity > 0 && this.styleTradePrice[0].maximumOrder < 5)
    //   //    return  this.styleTradePrice[0].styleTradePrice * 0.8
    //   // console.log(result)
    //   this.styleTradePrice.forEach(item => {
    //     if (Number(item.minimumOrderQuantity) > 0 & Number(item.maximumOrder) < 5) {
    //       // console.log(Number(item.minimumOrderQuantity))
    //       result *= 0.9
    //     } else if (Number(item.minimumOrderQuantity) > 5 & Number(item.maximumOrder) < 10) {
    //       result *= 0.8
    //     } else {
    //       result *= 0.7
    //     }
    //   })
    //   return result
    // },
  },
  created() {
    this.getSeasonId()
    this.isEdit = this.$route.query.flag
    if (this.$route.query.flag == 1) {
      this.isEdit = false
    } else {
      this.isEdit = true
    }
    if (this.$route.query.item) {
      if (this.isEdit == false) {
        this.title = '查看'
      }else {
        this.title = '编辑'
      }
      let res = this.$route.query.item.row;
      res.styleData = JSON.parse(res.styleData)
      if (res.styleData) {
        res.styleData.forEach((item) => {
          item.options.forEach((Item) => {
            if (Item.status == 1) {
              item.checked = Item.option
            }
          })
        })
      }
      this.ruleForm = this.$route.query.item.row
      this.ruleForm.styleData = JSON.parse(JSON.stringify(res.styleData))
      this.ruleForm.styleWashing = JSON.parse(this.ruleForm.styleWashing)
      this.ruleForm.seriesId = Number(this.ruleForm.seriesId)
      if (this.ruleForm.styleLabel) {
        this.labelList = this.ruleForm.styleLabel.split(',')
      }
      if (this.ruleForm.styleVideo) {
        this.videoList.push({url: this.ruleForm.styleVideo})
      }
      if (this.ruleForm.styleVideoPatch) {
        this.VideoImgList.push({url: this.ruleForm.styleVideoPatch})
      }
    //   this.menuIds = '1'
    } else {
      this.title = '新增'
      this.getStyleData()
      this.getStyleWashing()
    }
  },
  mounted() {
    this.headersData.token = localStorage.token
    this.uploadData.userId = sessionStorage.userId
    this.uploadUrl = VcUpload.uploadUrl
    addQuillTitle()
    // this.getBandAndSeries()
    this.getGoodsCategory()
  },
  methods: {
    onRemove(file) {
      this.selectedColorName[this.colorNum] = this.selectedColorName[this.colorNum].filter( item => item.url != file.url)
    },
    onRemoveXj(file) {
      this.selectedColorNameXiJie[this.colorNum] = this.selectedColorNameXiJie[this.colorNum].filter( item => item.url != file.url)
    },
    onRemoveVideoImg(file) {
      this.ruleForm.styleVideoPatch = ''
    },
    //
    handlePictureCardPreview(file) {
      // console.log(file)
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
      if (this.operateFlag !== 'view' && this.isEdit !== false) { // 编辑或新增提示一下
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
    deleteColor(item, index,msg) {
      const _this = this
      if (this.$refs.uploadImage) {
        this.$refs['uploadImage'].clearFiles()
        this.$refs['uploadxijieImage'].clearFiles()
      }
      const times = this.colorNum
      if ( msg != 'noChangeSize') {
        if (this.activeGoodsShow&&this.$refs.goodsSizeRef) {
          this.activeGoodsSize[times] = JSON.stringify(this.$refs.goodsSizeRef.selection) //记录选中的尺寸
          this.$refs.goodsSizeRef.clearSelection()
        }
      }
      this.uploadImgFlag = true
      // this.colorList.splice(item, 1)
      this.colorNum = index
      if (_this.activeGoodsShow&&_this.activeGoodsSize[_this.colorNum]&&_this.activeGoodsSize[_this.colorNum].length > 0) {
        JSON.parse(_this.activeGoodsSize[this.colorNum]).forEach(item => {
          let res = _this.sizeInfo.resultMap.find(Item => {
            return Item.SIZEID == item.SIZEID
          })
          _this.$refs.goodsSizeRef.toggleRowSelection(res,true);
        })
      }
      _this.activeGoodsShow = true
    },
    close() {
      this.drawer = false
    },
    choseColor() {
      if (!this.newColor) {
        return this.$message.warning('请输入颜色')
      }
      if (this.editColor != '') {
        const ColorIndex = this.colorList.findIndex(item => item == this.newColor)
        if (ColorIndex == -1) {
          this.colorList[this.editColor.index] = this.newColor
          this.editColor.colorName = this.newColor
        } else if (ColorIndex == this.editColor.index){
          this.colorList[this.editColor.index] = this.newColor
          this.editColor.colorName = this.newColor
        } else{
          this.$message({
            message: '已存在该颜色',
            type: 'warning',
          })
          return;
        }
      }else {
        if (this.colorList.indexOf(this.newColor) == -1) {
          this.colorList.push(this.newColor)
        } else {
          this.$message({
            message: '已存在该颜色',
            type: 'warning',
          })
          return;
        }
         
      }
      this.newColor = ''
      this.drawer = false
      this.closeDialog()
    },
    // 卖点去除html标签，多行文本框里使用v-html行不通
    changeWashMaintenance(val) {
      this.ruleForm.service = val
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
          if (this.ruleForm.seriesId || this.ruleForm.seriesId === 0) {
            this.getClothingSizeInfo()
          }
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
      const label = this.styleCategory.find(item => item.dicttimeDisplayName == this.ruleForm.styleCategory)
      if (!label) {
        return
      }
      this.activeStyleCategory = label
      const con = {
        brandId: sessionStorage.brandId,
        catergre: label.dicttimeDisplayName,
        styleId: null,
      }
      this.sizeInfo = null
      this.sizeTableList = []
      getClothingSizeInfo(con).then((res) => {
        if (res.head.status == 0) {
          if (res.body) {
            this.sizeInfo = res.body
            this.sizeTableList = res.body.resultMap
            this.sizeTableList.forEach(el => {
              el.userId = sessionStorage.userId
              const temp = el.SIZE_NAME
              el.sizeName = temp // 入参时需要将大写（SIZE_NAME）改为小写（sizeName）
              if (el.ID) {
                const tempId = el.ID
                el.id = tempId
              }
            })
            if (this.ruleForm.styleSizeList.length > 0) {
              this.setSizeInfo()
            } else {
              this.setImgInfo()
            }
          } else {
            this.sizeInfo = null
            this.sizeTableList = []
          }
        } else {
          
          _this.$message({
            message: res.head.msg,
            type: 'warning'
          });
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
    saveGood(formName,status) {
      let msg = ''
      if (status == 0) {
        msg = '确认保存该商品信息吗?'
      } else if(status == 1) {
        msg = '您确定要发布商品至App与商品中心展示吗?'
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm(msg , '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            if (this.title == '编辑'){
              this.editGoodFun(status)
            }else {
              this.saveGoodFun(status)
            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消',
            })
          })
        }
      })
    },
    // 发布
    releaseGood(formName) {
      // this.$confirm('您确定要发布商品至昭廷吗?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning',
      // }).then(() => {
        // this.saveGoodFun('GROUNDING', formName, 'release')
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消',
      //   })
      // })
    },
    getSizeTitle() {
      let obj = {}
      if (this.$refs.goodsSizeRef) {
        const _this = this;
        _this.sizeInfo.sizeInfoVO.upTitle.forEach((item) => {
          obj[item.key] = item.value
        })
      }
      return obj;
    },
    getStyleDataToSubmit() {
      this.ruleForm.styleData.forEach((item) => {
        item.options.forEach((Item) => {
          if (item.checked == Item.option) {
            Item.status = 1
          } else {
            Item.status = 0
          }
        })
      })
      return this.ruleForm.styleData
    },
    getSizeList() {
      let sizeList = [];
      let styleColor = [];
      const _this = this;
      let sizeConfig = [];
      _this.sizeInfo.resultMap.forEach(item => {
        sizeConfig = []
        _this.sizeInfo.sizeInfoVO.upTitle.forEach(Item => {
          if (item[Item.key]) {
            sizeConfig.push(item[Item.key])
          } else {
            sizeConfig.push('')
          }
        })
        sizeList.push({
          sizeConfig: sizeConfig,
          ID: item.SIZEID,
          SIZE_NAME: item.SIZE_NAME,
          userId: item.userId,
          sort: 1,
          sizeName: item.SIZE_NAME
        })
      })
      return sizeList
    },
    getStyleColor() {
      if (this.activeGoodsShow&&this.$refs.goodsSizeRef) {
        this.activeGoodsSize[this.colorNum] = JSON.stringify(this.$refs.goodsSizeRef.selection) //记录选中的尺寸
      }
      let styleColor = [];
      const _this = this;
      this.colorList.forEach((item,index) => {
        let sizeList = [];
        styleColor.push({
          colourName: item
        })
        if (_this.selectedColorName[index] &&_this.selectedColorName[index].length > 0 ) {  //判断是否存在 商品图片
          let imgArr = []
          _this.selectedColorName[index].forEach(function(imgItem,imgIndex){
            if (imgItem.response) {
              imgArr.push(imgItem.response.data.fileUrl)
            } else {
              imgArr.push(imgItem.url)
            }
          })
          styleColor[index].stylePicture = imgArr.toString();
        } else {
          styleColor[index].stylePicture = ''
        }
        if (_this.selectedColorNameXiJie[index]&&_this.selectedColorNameXiJie[index].length>0) {  //判断是否存在 商品图片
          let imgArr = [];
          _this.selectedColorNameXiJie[index].forEach(function(imgItem,imgIndex){
            if (imgItem.response) {
              imgArr.push(imgItem.response.data.fileUrl)
            } else {
              imgArr.push(imgItem.url)
            }
          })
          styleColor[index].styleDetailPicture = imgArr.toString()
        } else {
          styleColor[index].styleDetailPicture = ''
        }
        if (this.activeGoodsSize[index]) {
          let sizeConfig = [];
          let sizeKey = [];
          JSON.parse(_this.activeGoodsSize[index]).forEach(item => {
            _this.sizeInfo.sizeInfoVO.upTitle.forEach(Item => {
              sizeConfig = []
              sizeKey = []
              let goodsInfo = _this.sizeInfo.resultMap.find( goods => goods.SIZEID == item.SIZEID)
              if (goodsInfo[Item.key]) {
                sizeConfig.push(goodsInfo[Item.key])
                sizeKey.push(Item.value)
              } else {
                sizeConfig.push('')
              }
            })
            sizeList.push({
              sizeValue: sizeConfig,
              sort: 1,
              sizeName: item.SIZE_NAME,
              sizeKey: sizeKey,
            })
          })
        }
        styleColor[index].styleSize = sizeList
      })
      return styleColor
    },
    checkstyleColor (con) {
      let returnRes = true
      const _this = this
      if (con.styleColor.length == 0) {
        _this.$message({
          type: 'warning',
          message: '发布前请上传颜色',
        })
        return false
      } else {
        con.styleColor.forEach((item,index) => {
          if (item.styleSize.length == 0) {
            returnRes = false
            //尺码是必选的
          } else if (item.styleDetailPicture == "" || item.stylePicture == "") {
            returnRes = false
            //图片是必传的
          }
        })
      }
      if (!returnRes) {
        _this.$message({
          type: 'warning',
          message: '发布前请添加各颜色的商品图片、细节图片、商品尺码',
        })
      }
      return returnRes 
    },
    saveGoodFun(status) {
      
      const _this = this;
      const con = JSON.parse(JSON.stringify(this.ruleForm));
      con.stylePicture = ''  //款式图片 url地址
      con.brandId = sessionStorage.brandId //所属机构
      // con.tradePrice = this.onePrice //批发价
      // con.styleVideoPatch = '' //商品视频贴片
      con.styleDetailPicture = '' // 暂无  应该是商品图片
      con.accessories = ''// 暂无 商品辅料
      con.filler = '' //暂无 无说明
      con.profitIndex = '' // 暂无 无说明
      con.efficiencyIndex = '' // 暂无 无说明
      con.styleLabel = this.labelList.toString();
      con.sizeList = this.getSizeList();
      con.styleColor = this.getStyleColor();
      con.tatle = this.getSizeTitle()
      con.styleData = JSON.stringify(this.getStyleDataToSubmit())
      con.styleWashing = JSON.stringify(con.styleWashing)
      con.styleSizeList = [];
      con.status = status
      if (status == 1) {
        if (!this.checkstyleColor(con)) {
          return;
        }
      }
      addGoodsInfo(con).then((res) => {
        if (res.head.status == 0) {
          _this.$message({
            type: 'success',
            message: res.head.msg,
          })
          _this.$router.back()
        } else {
          _this.$message({
            type: 'error',
            message: res.head.msg,
          })
        }
      }).catch(err =>{
        console.log(err)
      })
    },
    editGoodFun(status) {
      const _this = this;
      const con = JSON.parse(JSON.stringify(this.ruleForm));
      con.stylePicture = ''  //款式图片 url地址
      con.brandId = sessionStorage.brandId //所属机构
      // con.tradePrice = this.onePrice //批发价
      // con.styleVideoPatch = '' //商品视频贴片
      con.styleDetailPicture = '' // 暂无  应该是商品图片
      con.accessories = ''// 暂无 商品辅料
      con.filler = '' //暂无 无说明
      con.profitIndex = '' // 暂无 无说明
      con.efficiencyIndex = '' // 暂无 无说明
      con.styleLabel = this.labelList.toString();
      con.sizeList = this.getSizeList();
      con.styleColor = this.getStyleColor();
      con.tatle = this.getSizeTitle()
      con.styleData = JSON.stringify(this.getStyleDataToSubmit())
      con.styleWashing = JSON.stringify(con.styleWashing)
      con.styleSizeList = [];
      con.status = status
      if (status == 1) {
        if (!this.checkstyleColor(con)) {
          return;
        }
      }
      updateStyleInfo(con).then((res) => {
        if (res.head.status == 0) {
          _this.$message({
            type: 'success',
            message: res.head.msg,
          })
          _this.$router.back()
        } else {
          _this.$message({
            type: 'error',
            message: res.head.msg,
          })
        }
      }).catch((err) => {
        
      })
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    setSizeInfo() {
      const _this = this;
      this.sizeInfo.resultMap.forEach((item,index) => {
        _this.sizeInfo.sizeInfoVO.upTitle.forEach((Item,Index) => {
          item[Item.key] = _this.ruleForm.styleSizeList.find(Goods => Goods.sizeName == item.sizeName).sizeConfig[Index]
        })
      })
      this.setImgInfo() 
    },
    setImgInfo() {
      const _this = this
      let goodsSize = ''
      let goodsSizeList = []
      let imgList = []
      let imgDetalList = []
      this.ruleForm.styleColorList.forEach((item,index) => {
        goodsSizeList = []
        imgList = []
        imgDetalList = []
        _this.colorList.push(item.styleColor)
        item.styleSize.forEach((Item,Index) => {
          goodsSize = _this.sizeInfo.resultMap.find(GoodsItem => GoodsItem.sizeName == Item.sizeName)
          goodsSizeList.push(goodsSize)
        }) 
        item.styleImg.forEach((Item,Index) => {
          imgList.push({
            url:Item.resUrl
          })
        })
        item.styleImgDetail.forEach((Item,Index) => {
          imgDetalList.push({
            url:Item.resUrl
          })
        })
        // goodsSize = _this.sizeInfo.resultMap.find(Item => Item.SIZEID == )
        _this.activeGoodsSize.push(JSON.stringify(goodsSizeList))
        _this.selectedColorName.push(imgList)
        _this.selectedColorNameXiJie.push(imgDetalList)
        
      })
      if (_this.colorList.length > 0) {
        this.activeGoodsShow = true
        this.$nextTick(() => {
          this.deleteColor(this.colorList[0],0)
        })
      }
    },
    
    uploadVideoProcess(event, file, fileList) {
      this.uploadVideoFlag = true;
      this.perValue = file.percentage.toFixed(0) * 1;
    },
    beforeUploadVideo(file){
      this.delVideo()
      this.uploadData.totalSize = parseInt(file.size/1024)
      this.uploadData.endPos = file.size
      this.uploadData.fileType = '1'
      const pointIndex = file.name.lastIndexOf(".");
      const fileType = file.name.substring(pointIndex+1);   //获取到文件后缀名
      const isVideo = (fileType === "mp4" || fileType === "mov");
      const isLt4M = file.size / 1024 / 1024 < 50;
      const hour = Math.floor(Date.now() / (1000 * 60 * 60))
      const md5FileName = `${ MD5(file.name + hour).toString() }.${ fileType }`
      this.uploadData.fname = md5FileName
      if (!isVideo) {
        this.$message.error("上传视频只能是 mp4，mov 格式!");
        return false
      }
      if (!isLt4M) {
        this.$message.error("上传视频大小不能超过 50MB!");
        return false
      }
      return isVideo && isLt4M;
    },
    VideoUploadSuccess(res,file){
      // this.isShowUploadVideo = true;
      this.uploadVideoFlag = false;
      this.perValue = 0;
      if (res.status === 0) {
        this.ruleForm.styleVideo = res.fileUrl
      } else {
        this.$message.error('上传失败');
      }
    },
    delVideo() {
      this.ruleForm.styleVideo = ''
    },
    getStyleWashing() {
      const con = {
      	brandId: sessionStorage.brandId,
      	type: 'STYLE_WASHING',
      	userId: this.uploadData.userId,
      }
      const _this = this;
      getStyleData(con).then((res) => {
        if (res.head.status == 0) {
          if(res.body.result.length > 0) {
            res.body.result.forEach((item) => {
              _this.ruleForm.styleWashing.push({
                name:item.dicttimeDisplayName,
                status: 0,
                resUrl: item.imgUrl,
                dictCode: item.dictitemCode
              })
            })
          }
        } else {
          this.$message.error(res.head.msg);
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 获取商品厚薄程度
    getStyleData(style) {
      const arr = [
        {
          name:'厚薄程度',
          key:'STYLE_THICKNESS'
        },{
          name:'版型指数',
          key:'VERSION_INDEX'
        },{
          name:'弹力指数',
          key:'ELASTIC_INDEX'
        },{
          name:'柔软指数',
          key:'SOFT_INDEX'
        },
      ]
      async function getData (con,item) {
        let resData = '';
        try {
          const res = await getStyleData(con)
          if (res.head.status == 0) {
            let styleData = {
              name: item.name,
              options: [],
              checked: '',
            }
            if (res.body.result.length > 0) {
              res.body.result.forEach((Item) => {
                styleData.options.push({
                  option: Item.dicttimeDisplayName,
                  status: 0
                })
              })
            }
            _this.ruleForm.styleData.push(styleData)
          } else {
            this.$message.error(res.head.msg);
          }
        } catch (err) {
          console.log(err)
        }
      }
      const _this = this
      arr.forEach((item) => {
        const con = {
        	brandId: sessionStorage.brandId,
        	type: item.key,
        	userId: this.uploadData.userId,
        }
        let data = getData(con,item)
      })
    },
    rightClick(msg,item,index) {
      this.editColor = {
        colorName: item,
        index: index
      };
      this.centerDialogVisible = true
    },
    closeDialog() {
      this.innerVisible = false;
      this.closeEditColor()
    },
    deleteItem() {
      // console.log(this.activeGoodsSize)
      // return ;
      const index = this.editColor.index
      this.colorList.splice(index,1)
      this.selectedColorName.splice(index,1)
      this.selectedColorNameXiJie.splice(index,1)
      this.activeGoodsSize.splice(index,1)
      if (this.colorNum == index && this.colorList.length > 0){
        this.$refs.goodsSizeRef.clearSelection();
        this.deleteColor(this.colorList[0],0,'noChangeSize')
      } else if (this.colorNum > index) {
        this.$refs.goodsSizeRef.clearSelection();
        this.deleteColor(this.colorList[this.colorNum - 1],this.colorNum - 1,'noChangeSize')
      } else if (this.colorList.length == 0) {
        this.colorNum = undefined
      }
      this.closeDialog()
    },
    handleEditClick() {
      this.drawer = true
      this.newColor = this.editColor.colorName
    },
    closeEditColor() {
      this.editColor = ''
      this.newColor = ''
      this.centerDialogVisible = false;
    }
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
    // display: flex;
    // justify-content: space-between;
    // border:2px solid red;
    .baseInfoBox{
      width: 46%;
      border:2px solid red;
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
    outline-width: 500px;
    height:200px;
    overflow:hidden;
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
  width: 50%;
  padding-right:20px;
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
li.active{
  background:#cda46c;
  color:#fff;
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

}
/deep/ .el-tabs__active-bar {
  display: none;
}
.el-collapse{
  border-bottom:0px;
}
/deep/ .el-tabs__nav-scroll{
  display: flex;
  justify-content: center;
}
.styleDataBox{
  margin-bottom: 12px;
  span{
    width:98px;
    font-size:14px;
    color:#606266;
    display: inline-block;
    padding-right:12px;
    text-align: right;
  }
  /deep/.el-radio-button__orig-radio:checked + .el-radio-button__inner{
    background-color:#cda46c;
    border-color: #cda46c;
    box-shadow:-1px 0 0 0 #cda46c;
  }
  /deep/.el-radio-button__inner:hover{
    color:#cda46c
  }
  /deep/.is-active .el-radio-button__inner:hover{
    color:#fff;
  }
} 
.checkBox {
  .el-checkbox{
    border:1px solid #e8eaee;
    padding:10px;
    margin:0 0 14px 14px;
  }
  /deep/ .el-checkbox__input{
    position: absolute;
    top:10px;
    left: 10px;
  }
  /deep/ .el-checkbox__label{
    img{
      width:120px;
      height:120px;
      height:auto;
    }
    text-align:center;
    font-size:14px;
    padding-right:0px;
  }
  /deep/.el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #cda46c;
    border-color: #cda46c;
  }
  /deep/.el-checkbox__input.is-checked + .el-checkbox__label{
    color:#cda46c;
  }
  /deep/ .el-checkbox__inner:hover{
    border-color:#cda46c;
  }
}
/deep/.el-page-header__content{
  font-size:14px!important;
  font-weight: 500!important;
}
/deep/.el-radio-button__inner{
  padding: 12px 30px;
}
.text-4xl {
  font-size:16px;
  line-height: 24px;
  text-align: center;
}
.editBox {
  /deep/ .el-form-item{
    padding-top: 40px;
  }
  /deep/ .el-form-item:nth-child(1){
    padding-top: 0px;
  }
}
</style>
<style>
  .el-upload-list__item {
    transition: none !important;
  }
  >>>.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate
  .el-checkbox.is-bordered.is-checked{
      border-color: #cda46c;
     }
  .el-checkbox__input.is-focus .el-checkbox__inner{
      border-color:  #cda46c;
     }
</style>