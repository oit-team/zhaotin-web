<template>
  <div class="my-10 block">
    <!-- 头部 -->
    <div>
      <div class="flex justify-between items-center mb-2">
        <el-page-header
          content="订单详情"
          @back="$router.back()"
        />
        <div>
          <el-button type="text" @click="dialogSee = true, getEx()">
            查看兑换记录
          </el-button>
          <el-divider v-if="flag === '1'" direction="vertical" />
          <el-button v-if="flag === '1'" class="!text-rose-500" type="text" @click="dialogAdd = true">
            添加兑换记录
          </el-button>
        </div>
      </div>
      <div class="flex justify-between px-14 zt-head">
        <div class="font-extrabold">
          单号：{{ orderInfo.orderNo }}
        </div>
        <div class="font-extrabold">
          下单时间: {{ orderInfo.orderTime }}
        </div>
      </div>
      <!-- ----- -->
      <div class="zt-content">
        <div class="zt-content__item">
          <!-- <div class="zt-cart__title">
            <div class="zt-title__title">
              订单编号：{{ orderInfo.orderNo }}
            </div>
          </div> -->
          <div class="zt-cart__line">
            <el-row :gutter="20">
              <el-col :span="3">
                <el-image
                  style="width: 100px; height: 100px"
                  :src="orderInfo.goodsImg"
                  fit="contain"
                  @click="todetails(orderInfo.goodsId)"
                />
              </el-col>
              <el-col :span="6">
                <div class="zt-cart__name">
                  {{ orderInfo.goodsName }}
                </div>
              </el-col>
              <el-col :span="8">
                <div class="zt-cart__color">
                  物品编号：{{ orderInfo.goodsNo }}
                </div>
              </el-col>
              <el-col :span="6">
                <div class="zt-cart__color">
                  <!-- {{ orderInfo.orderRemarks }} -->
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="zt-footer">
        <div class="">
          <div class="font-extrabold">
            数量: {{ orderInfo.goodsNumber }}件
          </div>
          <div v-show="!isSet" class="font-extrabold">
            消费积分: <span class="zt-red">{{ orderInfo.goodsIntegral }}</span>
          </div>
        </div>
        <div class="zt-footer__right">
          <p>收货人：<span>{{ orderInfo.consignee || '无' }}</span>{{ ' ' }}{{ orderInfo.consigneePhone || '' }}</p>
          <p>寄送地址：<span>{{ orderInfo.consigneeAddress || '无' }}</span></p>
        </div>
      </div>
    </div>
    <div class="flex my-5">
      <div class="label w-32">
        订单备注：
      </div>
      <!-- <el-input type="textarea" :rows="4" v-model="orderNote" /> -->
      <div>{{ orderInfo.orderRemarks }}</div>
    </div>
    <!-- <div v-if="flag === '1'" class="flex my-5">
      <div class="label w-32">
        客服兑换记录：
      </div>
      <el-input v-model="exchange" type="textarea" :rows="4" />
    </div> -->
    <el-drawer
      ref="addEx"
      title="添加兑换记录"
      :visible.sync="dialogAdd"
      :direction="direction"
      size="40%"
      custom-class="zt-demo__drawer"
    >
      <div class="demo-drawer__content">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-position="left"
          label-width="80px"
          :hide-required-asterisk="false"
        >
          <el-form-item label="兑换凭证" prop="voucherImg">
            <VcUpload v-bind="uploadImg" ref="goodsImg" :on-remove="onRemoveImg">
              <i class="el-icon-plus"></i>
            </VcUpload>
            <p class="tip">
              *最多可以上传1张图片，推荐格式jpg或png
            </p>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="ruleForm.remarks" type="textarea" rows="4" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="dialogAdd = false">
            取 消
          </el-button>
          <el-button type="primary" :loading="loading" @click="add('ruleForm')">
            {{ loading ? "提交中 ..." : "确 定" }}
          </el-button>
        </div>
      </div>
    </el-drawer>
    <el-drawer
      ref="seeEx"
      title="查看兑换记录"
      :visible.sync="dialogSee"
      :direction="direction"
      size="40%"
      custom-class="zt-demo__drawer"
    >
      <div class="demo-drawer__content">
        <div class="drawer-content">
          <el-card v-for="(item, index) in exchangeList" :key="index" shadow="hover" class="drawer-item mb-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                兑换凭证：
                <el-image :src="item.voucherImg" style="width: 70px; height: 70px" :preview-src-list="[item.voucherImg]"></el-image>
              </div>
              <p>
                兑换人员：{{ item.customer }}
              </p>
            </div>
            <div>
              备注：<span>{{ item.exchangeRemarks || '暂无备注' }}</span>
            </div>
            <div class="flex justify-between">
              <p>
              </p>
              <p>
                {{ item.createTime }}
              </p>
            </div>
          </el-card>
        </div>
        <div></div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { addExchangeRecord, getOrderDetail, getOrderExchange } from '@/api/order'
import VcUpload from '@/views/common/Upload'

export default {
  name: 'OrderInfo',
  components: {
    VcUpload,
  },
  data() {
    return {
      orderInfo: {},
      orderId: '',
      orderTime: '',
      orderTypeName: '',
      orderInfoList: [],
      Numb: 0,
      priceAll: 0,
      dataInfo: {},
      isSet: false,
      priceList: [],
      drawer: false,
      direction: 'rtl',
      drawerNote: false,
      textarea: '', // 修改订单原因
      bValidateForm: {
        cause: '',
      },
      dialogAdd: false,
      dialogSee: false,
      loading: false,
      updateRecord: [], // 修改记录
      isUpdate: false,
      flag: '',
      exchange: '',
      ruleForm: {
        orderNo: '',
        customer: '',
        voucherImg: '',
        remarks: '',
      },
      rules: {
        remarks: [{
          required: true, message: '请输入活动名称', trigger: 'blur',
        }],
      },
      fileList: [],
      exchangeList: [],
    }
  },
  computed: {
    uploadImg() {
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
          const data = {
            url: file.data.fileUrl,
          }
          this.fileList.push(data)
          this.ruleForm.voucherImg = file.data.fileUrl
        },
      }
    },
  },
  created() {
    this.flag = this.$route.query.flag
    if (this.$route.query.item) {
      this.orderId = this.$route.query.item.row.id
      this.getData()
    }
  },
  methods: {
    getData() {
      getOrderDetail({
        id: this.orderId,
      }).then((res) => {
        this.orderInfo = res.body.resultMap
      }).catch(() => {})
    },
    onRemoveImg() {
      this.ruleForm.voucherImg = ''
    },
    // 获取 订单兑换记录
    getEx() {
      getOrderExchange({
        orderNo: this.orderInfo.orderNo,
      }).then(res => {
        if (res.head.status !== 0) {
          this.$message(res.head.msg)
        } else {
          this.exchangeList = res.body.exchangeList
        }
      })
    },
    add() {
      this.ruleForm.orderNo = this.orderInfo.orderNo
      this.ruleForm.customer = sessionStorage.getItem('userId')
      addExchangeRecord(this.ruleForm).then(res => {
        if (res.head.status === 0) {
          this.$message.success('添加成功')
          this.dialogAdd = false
        }
      })
    },
  },
}
</script>

<style lang='scss' scoped>
.zt-content{
  background-color: #f5f5f5;
  padding: 20px 10px;
  margin-top: 15px;
  border-radius: 5px 5px 0 0;
  box-sizing: border-box;
}
.zt-content__item{
  padding: 10px;
  box-sizing: border-box;
  .zt-cart__title{
    display: flex;
    align-items: center;
    .zt-title__title{
      margin: 0 10px;
    }
  }
}
.zt-cart__size{
  width: 100%;
  margin: 10px 0;
}
.zt-size__item{
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 15px 0;
  border-top: 1px solid #ccc;
  box-sizing: border-box;
}
.zt-size__item:hover{
  cursor: pointer;
}
.zt-cart__line{
  padding: 10px 30px;
  padding-bottom: 0;
  width: 100%;
  background: #fff;
  margin: 10px 0;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  box-sizing: border-box;
  .el-row{
    display: flex;
    align-items: center;
  }
  .zt-cart__image{
    width: 100px;
    height: 100px;
    border-radius: 5px;
    border: 1px solid #c9a76e;
  }
  .zt-cart__name{
    p{
      color: #909193;
      font-size: 14px;
    }
  }
  .zt-cart__allPrice{
    color: #c9a76e;
  }
  .zt-cart__set{
    padding: 0 20px;
  }
  .zt-cart__set:hover{
    cursor: default;
  }
}
.zt-footer{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 16px;
  padding: 0 20px;
  border-radius: 0 0 5px 5px;
  background-color: #f6f5f3;
  .zt-footer__left{
    // display: flex;
    align-items: center;
    padding: 10px 0;
    line-height: 30px;
    box-sizing: border-box;
    .zt-left__btn{
      border: 1px solid #c9a76e;
      color: #c9a76e;
      text-align: center;
      padding: 5px 30px;
      margin: 0 20px;
      border-radius: 30px;
      box-sizing: border-box;
      .el-icon-delete{
        color: #c9a76e;
      }
    }
    .zt-left__btn:hover{
      cursor: pointer;
    }
  }
  .zt-red{
    font-size: 20px;
    font-weight: 800;
    color: #FF0000;
  }
  .zt-hui{
    color: #666;
  }
  .zt-footer__right{
    // display: flex;
    align-items: center;
    max-width: 30%;
    padding: 10px 0;
    line-height: 30px;
    box-sizing: border-box;
    .zt-footer__button{
      padding: 15px 50px;
      background-color: #cda46c;
      margin-left: 20px;
      border-radius: 30px;
      font-size: 18px;
      color: #fff;
      box-sizing: border-box;
    }
    .zt-footer__button:hover{
      cursor: pointer;
    }
  }
}
.demo-drawer__content {
  display: flex;
  flex-direction: column;
  padding: 40px;
  height: 100%;
  justify-content: space-between;
  .demo-drawer__footer {
    display: flex;
    justify-content: space-around;
  }
  .el-button--default {
    width: 40%;
  }
  .el-button--primary {
    width: 40%;
  }
}
// .demo-drawer__content{
//   display: flex;
//   flex-direction: column;
//   height: 100%;
// }
.zt-red{
  color: #FF0000;
}
.tip{
  color:#e60012;
  margin:12px 0px;
}
</style>
