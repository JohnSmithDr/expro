'use strict';

const dataSource = require('../data/data-source');
const makeReject = require('../errors').makeReject;

function createGoods(params) {
  return dataSource.goods.insertOrUpdate(params);
}

function updateGoods(goodsId, params) {
  return dataSource.goods.findById(goodsId)
    .then(goods => {
      if (!goods) {
        return makeReject(400, 'GOODS_NO_EXISTS', `Goods does not exists: ${goodsId}`);
      }
      goods = Object.assign(goods, params);
      return dataSource.users.insertOrUpdate(goods);
    });
}

function deleteGoods(goodsId) {
  return dataSource.goods.findAndRemoveById(goodsId);
}

function getGoods(goodsId) {
  return dataSource.goods.findById(goodsId);
}

function listGoods(query) {
  return dataSource.goods.items();
}

module.exports = { createGoods, updateGoods, deleteGoods, getGoods, listGoods };