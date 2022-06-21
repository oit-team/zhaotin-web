<template>
	<div class="zt-page">
		<el-container>
			<el-aside width="210px">
				<div class="title">
					积分类型
				</div>
				<div class="tabs">
					<div
						class="tabs-item"
						v-for="(item, index) in tabs"
						:key="index"
						:class="selectT === index?'selectTab':''"
						@click="selectT = index,selectTab(item)"
					>
						<!-- @click="selectTab(index)" -->
						{{ item.dicttimeDisplayName }}
					</div>
				</div>
			</el-aside>
			<el-container class="zt-content">
  			<el-button
					size="small"
					icon="el-icon-plus"
					type="success"
					@click="addRules"
				>
					新增规则
				</el-button>
				<!-- 新增框 -->
				<el-card class="box-card" v-if="dialog">
					<div class="card-head">
						<div class="card-head__left"></div>
						<div class="card-head__right" @click="offcard('forms')">
							<i class="el-icon-close"></i>
						</div>
					</div>
					<div class="card-content">
						<el-form
							class="content-form"
							ref="forms"
							:rules="rules"
							:model="form"
							label-width="150px"
						>	
							<!-- 区间 -->
							<el-form-item label="区间" required>
								<el-col :span="6">
									<el-form-item prop="startValue">
										<el-input v-model.number="form.startValue" placeholder=""></el-input>
									</el-form-item>
								</el-col>
								<el-col class="line" :span="2">-</el-col>
								<el-col :span="6">
									<el-form-item prop="endValue">
										<el-input v-model.number="form.endValue" placeholder=""></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="6" class="ml-10">
									<el-form-item prop="valueUnit">
										<el-input v-model="form.valueUnit" placeholder="单位：年/元/人"></el-input>
									</el-form-item>
								</el-col>
							</el-form-item>
							<!-- 区间积分 -->
							<el-form-item
								label="积分"
								prop="OneintegralValue"
							>
								<el-input v-model.number="form.OneintegralValue" placeholder=""></el-input>
							</el-form-item>
							<!-- 联动规则  切换状态-->
							<el-form-item prop="chain" label="联动规则" v-if="leftTab.remark === '1'">
								<el-switch v-model="form.chain"></el-switch>
							</el-form-item>
							<div v-if="form.chain">
								<el-form-item label="规则类型" prop="preRuleCode">
									<el-select @change="cgSelect" v-model="form.preRuleCode" placeholder="请选择">
										<el-option
											v-for="item in tabsS"
											:key="item.dictitemCode"
											:label="item.dicttimeDisplayName"
											:value="item.dictitemCode">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item
									v-for="(item, index) in form.preList"
									:key="index"
									:label="`${item.startValue}~${item.endValue}${item.valueUnit}`"
									:rules="{
										required: true, message: '请输入积分', trigger: 'change'
									}"
								>
									<el-col :span="20">
										<el-input v-model="item.integralValue" placeholder="" />
									</el-col>
									<el-col :span="2">
										<div class="jif">积分</div>
									</el-col>
								</el-form-item>
							</div>
							<el-form-item>
								<el-button type="primary" @click="submitForm('forms')">提交</el-button>
								<el-button @click="offcard('forms')">关闭</el-button>
							</el-form-item>
						</el-form>
					</div>
				</el-card>
				<el-empty v-if="!ruleList.length" description="暂无数据"></el-empty>
				<!-- 展示框 -->
				<el-card
					class="box-card"
					v-for="(item, index) in ruleList"
					:key="index"
				>
					<div class="card-head">
						<div class="card-head__left"></div>
						<div class="card-head__right">
    					<el-button style="padding: 3px 10px" type="text" @click="cgdisab(item)">{{ item.disab?'编辑':'取消'}}</el-button>
							<i class="el-icon-close" @click="deleteCard(item)"></i>
						</div>
					</div>
					<el-form
						class="content-form"
						:ref="`form${index}`"
						:rules="rules"
						:model="item"
						label-width="150px"
						:disabled="item.disab"
					>
						<!-- 区间 -->
						<el-form-item label="区间" required>
							<el-col :span="10">
								<el-form-item prop="startValue">
									<el-input v-model.number="item.startValue"></el-input>
								</el-form-item>
							</el-col>
							<el-col class="line" :span="2">-</el-col>
							<el-col :span="10">
								<el-form-item prop="endValue">
									<el-input v-model.number="item.endValue"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="2">
								<span>{{ item.valueUnit }}</span>
							</el-col>
						</el-form-item>
						<!-- 已有积分 -->
						<el-form-item
							label="积分"
							prop="integralValue"
						>
							<el-input v-model="item.integralValue" placeholder=""></el-input>
						</el-form-item>
						<!-- 联动规则 -->
						<div v-if="item.preList">
							<el-form-item label="联动规则">
								<span>{{ item.preRuleName }}</span>
							</el-form-item>
							<el-form-item
								v-for="(iteM, indeX) in item.preList"
								:key="indeX"
								:label="`${iteM.startValue}~${iteM.endValue}${iteM.valueUnit}`"
								:rules="{ required: true, message: '请输入积分', trigger: 'blur' }"
							>
								<el-col :span="20">
									<el-input v-model.number="iteM.integralValue" placeholder=""></el-input>
								</el-col>
								<el-col :span="2">
									<div class="jif">积分</div>
								</el-col>
							</el-form-item>
						</div>
						<!-- 如果没有联动规则 且是编辑状态 且可以选择联动规则 -->
						<div v-show="!item.preList && !item.disab && leftTab.remark === '1'">
							<!-- 联动规则  切换状态-->
							<el-form-item prop="chain" label="联动规则">
								<el-switch v-model="item.chain"></el-switch>
							</el-form-item>
							<div v-if="item.chain">
								<el-form-item label="规则类型" prop="preRuleCode">
									<el-select @change="cgSelect2" v-model="item.preRuleCode" placeholder="请选择">
										<el-option
											v-for="item in tabsS"
											:key="item.dictitemCode"
											:label="item.dicttimeDisplayName"
											:value="item.dictitemCode">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item
									v-for="(iteM, indeX) in PreList"
									:key="indeX"
									:label="`${iteM.startValue}~${iteM.endValue}${iteM.valueUnit}`"
									:rules="{
										required: true, message: '请输入积分', trigger: 'change'
									}"
								>
									<el-col :span="20">
										<el-input v-model.number="iteM.integralValue" placeholder=""></el-input>
									</el-col>
									<el-col :span="2">
										<div class="jif">积分</div>
									</el-col>
								</el-form-item>
							</div>
						</div>
						<el-form-item v-if="!item.disab">
							<el-button type="primary" @click="subForm(`form${index}`,item)">提交</el-button>
						</el-form-item>
					</el-form>
				</el-card>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import {
	getDictionaryInfo,
	getCollocation,
	deleteCollocation,
	addCollocation,
	updateCollocation,
} from '@/api/category'

export default {
	name: 'Integral',
	data() {
		return {
			// tabs: ['客户建档', '下单总额', '客户转介绍'],
			tabs: [],
			tabsS: [],
			selectT: 0,
			dialog: false,
			ruleListkong: false,
			form: {
				startValue: '',
				endValue: '',
				integralValue: '',
				valueUnit: '',
        chain: false,
				preList: [],
				preRuleCode: '',
				OneintegralValue: '',
			},
			PreList: [],
			preRuleCode: '',
			formData: {
				pageNum: 1,
				pageSize: 20,
			},
			leftTab: {},
			// dictitemCode: 'ROO1',
			ruleList: [],
			rules: {
				startValue: { required: true, type: 'number', message: '请输入数字', trigger: 'change' },
				endValue: { required: true, type: 'number', message: '请输入数字', trigger: ['change','blur']},
				integralValue: { required: true, message: '请输入积分', trigger: 'change' },
				valueUnit: { required: true, message: '单位：年/元/人', trigger: 'change' },
				preRuleCode: { required: true, message: '请选择联动类型', trigger: 'change' },
				OneintegralValue: { required: true, message: '请输入积分', trigger: 'change' },
			},
			total: 0,
		}
	},
	created () {
		this.getTab()
	},
	methods: {
		getTab() {
			const that = this
			getDictionaryInfo({
        type: "RULE_TYPE_CODE",
        userId: sessionStorage.userId,
			}).then(res => {
				if (res.head.status === 0) {
					that.tabs = res.body.result
					// that.tabsS = res.body.result
					that.leftTab = res.body.result[0]
					that.getCollocation()
				} else {
					that.$message(res.head.msg)
				}
			})
		},
		// 获取对应配置
		getCollocation() {
			const that = this
			getCollocation({
				roleTypeCode: that.leftTab.dictitemCode,
			}).then(res => {
				if (res.head.status === 0) {
					that.ruleList = JSON.parse(JSON.stringify(res.body.resultList))
					if (that.ruleList.length) {
						that.ruleList.forEach(e => {
							that.$set(e, 'disab', true)
							that.$set(e, 'chain', false)
							if (e.preRuleCode) {
								that.tabsS = JSON.parse(JSON.stringify(that.tabs))
								that.tabsS.forEach(i => {
									if (i.dictitemCode === e.preRuleCode) {
										this.$set(e, 'preRuleName', i.dicttimeDisplayName)
									}
								})
							}
						})
					} else {
					}
				}
			})
		},
		// 左侧 tab 切换
		selectTab(item) {
			this.leftTab = item
			if (this.dialog) {
				this.offcard('forms')
			}
			this.getCollocation()
		},
		// 删除规则
		deleteCard(item) {
			this.$confirm('此操作将永久删除该规则, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				deleteCollocation({
					id: item.id,
				}).then(res => {
					if (res.head.status === 0) {
						this.$message({
							type: 'success',
							message: '删除成功!'
						})
					}
					this.getCollocation()
				})
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});          
			});
		},
		// 新增规则
		addRules() {
			const that = this
			that.dialog = true
			that.tabsS = JSON.parse(JSON.stringify(that.tabs))
			that.tabsS.forEach((e, index, arr) => {
				if (e.dictitemCode === that.leftTab.dictitemCode) {
					that.tabsS.splice(index, 1)
				}
			})
			that.ruleList.forEach(e => {
				that.$set(e, 'disab', true)
				that.$set(e, 'chain', false)
			})
		},
		// 新增 提交
		submitForm(formName) {
			const preList = []
			this.form.preList.forEach(e => {
				const pre = {
					preIntegralId: e.id,
					integralValue: e.integralValue - 0,
				}
				preList.push(pre)
			})
			const formDt = {
				ruleTypeCode: this.leftTab.dictitemCode,
				ruleType: 1,
				startValue: this.form.startValue,
				endValue: this.form.endValue,
				valueUnit: this.form.valueUnit,
				preRuleCode: this.form.preRuleCode,
				preList: preList,
				integralValue: this.form.OneintegralValue,
			}
			// if (this.form.OneintegralValue) {
			// 	formDt.integralValue = this.form.OneintegralValue
			// }
			this.$refs[formName].validate((valid) => {
				if (valid) {
					addCollocation(formDt).then(res => {
						if (res.head.status === 0) {
							this.dialog = false
							this.getCollocation()
							this.$refs[formName].resetFields()
						}
					})
				} else {
					// console.log('error submit!!')
					return false
				}
			})
		},
		// 关闭新增框
		offcard(formName) {
			this.$confirm('关闭后数据重置，是否继续关闭?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				// 关闭新增卡片  重置 form 表单
				this.dialog = false
				this.form.preList = []
				this.$refs[formName].resetFields()
				let newRules = { required: true, type: 'number', message: '请输入积分', trigger: 'change' }
				// this.rules = {...this.rules, OneintegralValue: newRules}
			}).catch(() => {
			})
		},
		// 是否联动
		// cgSwitch(e) {
		// 	if (e) {
		// 		// this.rules.OneintegralValue = {}
		// 	} else {
		// 		let newRules = { required: true, type: 'number', message: '请输入积分', trigger: 'change' }
		// 		// this.rules = {...this.rules, OneintegralValue: newRules}
		// 	}
		// },
		// 新增 下拉框 改变
		cgSelect(e) {
			this.form.preRuleCode = e
			getCollocation({
				roleTypeCode: e,
			}).then(res => {
				if (res.head.status === 0) {
					this.form.preList = res.body.resultList
				}
			})
		},
		// 修改 下拉框 改变
		cgSelect2(e) {
			this.preRuleCode = e
			getCollocation({
				roleTypeCode: e,
			}).then(res => {
				if (res.head.status === 0) {
					this.PreList = res.body.resultList
				}
			})
		},
		// 编辑修改
		cgdisab(item) {
			const that = this
			that.$set(item, 'disab', !item.disab)
			if (item.disab) {
				that.preRuleCode = ''
				that.PreList = []
				that.getCollocation()
			} else {
				that.tabsS = JSON.parse(JSON.stringify(that.tabs))
				that.tabsS.forEach((e, index) => {
					if (e.dictitemCode === that.leftTab.dictitemCode) {
						that.tabsS.splice(index, 1)
					}
				})
			}
			if (that.dialog) {
				that.offcard('forms')
			}
		},
		// 修改提交
		subForm(formName, item) {
			this.$refs[formName][0].validate((valid) => {
				if (valid) {
					if (item.preList) {
						this.PreList = item.preList
					}
					let preList = []
					if (this.PreList && this.PreList.length !== 0) {
						this.PreList.forEach(e => {
							const ad = {
								preIntegralId: item.preList?e.preIntegralId:e.id,
								integralValue: e.integralValue - 0,
							}
							preList.push(ad)
						})
					}
					const formDt = {
						ruleTypeCode: item.ruleTypeCode,
						ruleType: 1,
						id: item.id,
						startValue: item.startValue,
						endValue: item.endValue,
						valueUnit: item.valueUnit,
						preRuleCode: item.preRuleCode,
						preList: preList,
						integralValue: item.integralValue,
					}
					updateCollocation(formDt).then(res => {
						if (res.head.status === 0) {
							this.$message.success('修改成功')
							this.getCollocation()
						} else {
							this.$message.warning(res.head.msg)
						}
					})
				} else {
					this.$message.error('修改失败')
					return false
				}
			})
		},
	},
}
</script>

<style lang='scss' scoped> 
.zt-page{
	min-height: 82vh;
}
body > .el-container {
	margin-bottom: 40px;
}
.el-aside {
	color: #333;
	text-align: center;
	line-height: 40px;
	padding: 0 10px;
	border: 1px solid #e5e7eb;
	border-radius: 10px;
}
.tabs{
	.tabs-item{
		background-color: #fff;
		border: 1px solid #CDA46C;
		color: #909090;
		font-size: 14px;
		border-radius: 5px;
		margin: 20px 0;
	}
	.tabs-item:hover{
		cursor: pointer;
	}
	.selectTab{
		background-color: #CDA46C;
		color: #fff;
	}
}
.zt-content{
	display: block;
	max-height: 82vh;
	padding: 20px;
	box-sizing: border-box;
	overflow-y: auto;
	.box-card{
		.card-head{
			position: relative;
			// display: flex;
			// justify-content: space-between;
			.card-head__right{
				position: absolute;
				right: 0;
			}
		}
		.card-food{
			padding: 10px 0;
			text-align: right;
			box-sizing: border-box;
		}
	}
	.el-form-item{
		width: fit-content;
	}
	::v-deep .el-form-item__content{
		text-align: center;
	}
	::v-deep .el-card__body{
		padding-bottom: 0;
	}
	::v-deep .el-card{
		margin-top: 20px;
	}
	.jif{
		width: 50px;
		text-align: right;
	}
	i:hover{
		font-weight: 800;
		font-size: 18px;
		color: #0075ff;
		cursor: pointer;
	}
}
</style>
