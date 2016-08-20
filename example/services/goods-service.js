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

  let pageIndex = query['pageIndex'] || 1,
      pageSize = query['pageSize'] || 10,
      totalPagesCount = 0,
      totalItemsCount = 0;

  if (pageIndex <= 0) pageIndex = 1;
  if (pageSize >= 50) pageSize = 50;

  return dataSource.goods.items()
    .then(items => {

      totalItemsCount = items.length;
      totalPagesCount = Math.ceil(totalItemsCount / pageSize);

      let start = (pageIndex - 1) * pageSize;
      let goods = items.slice(start, start + pageSize);
      return Promise.resolve({
        goods,
        pagination: {
          pageIndex,
          pageSize,
          totalItemsCount,
          totalPagesCount
        }
      });

    });
}

module.exports = { createGoods, updateGoods, deleteGoods, getGoods, listGoods };