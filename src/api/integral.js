import { post } from './index'

// 积分商城列表
export function getGoodsList(params) {
  return post('/goods/integralShop/getGoodsList', params, {
    mod: 'vue',
    uuid: '0',
  })
}

// 积分商品详情
export function getDetails(params) {
  return post('/goods/integralShop/getGoodsDetails', params, {
    mod: 'vue',
    uuid: '0',
  })
}

// 积分商品管理  表格
export function getIntegralGoodsList(params) {
  return post('/goods/integralGoods/getIntegralGoodsList', params, {
    mod: 'home',
    cmd: '100001',
    uuid: '1',
  })
}

// 积分商品 下单
export function addIntegralOrder(params) {
  return post('/order/integralShop/addIntegralOrder', params, {
    mod: 'vue',
    uuid: '0',
  })
}

// 积分商品下单后 支付
export function payIntegralOrder(params) {
  return post('/order/integralShop/payIntegralOrder', params, {
    mod: 'vue',
    uuid: '0',
  })
}

// 积分商品 新增
export function addIntegralGoods(params) {
  return post('/goods/integralGoods/addIntegralGoods', params, {
    mod: 'vue',
    uuid: '0',
  })
}

// 积分商品 查看/修改
export function getIntegralGoodsDetailed(params) {
  return post('/goods/integralGoods/getIntegralGoodsDetailed', params, {
    mod: 'home',
    cmd: 100001,
    uuid: '0',
  })
}

// 积分商城 类别 tab
export function getTypeAndDate(params) {
  return post('/goods/integralShop/getTypeAndData', params, {
    mod: 'home',
    cmd: 100001,
    uuid: '0',
  })
}
