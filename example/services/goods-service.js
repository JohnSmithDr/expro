'use strict';

function createGoods(params) {
  return Promise.resolve(params);
}

function updateGoods(goodsId, params) {
  return Promise.resolve(params);
}

function deleteGoods(goodsId) {
  return Promise.resolve(goodsId);
}

function getGoods(goodsId) {
  return Promise.resolve(goodsId);
}

function listGoods(query) {
  return Promise.resolve(query);
}

module.exports = { createGoods, updateGoods, deleteGoods, getGoods, listGoods };