'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

const dataSource = require('../data/data-source');
const makeReject = require('../errors').makeReject;

function createOrder(params) {

  let buyer = params['buyer'], goodsId = params.goods.map(s => s.goodsId);

  if (!goodsId.length) {
    return makeReject(400, 'NO_ORDER_GOODS', 'Go and pick some goods first.');
  }

  return dataSource.users.findByUsername(buyer)
    .then(user => {
      return user
        ? Promise.map(goodsId, id => dataSource.goods.findById(id))
        : makeReject(404, 'USER_NOT_FOUND', `User not found: ${buyer}`);
    })
    .then(goods => {

      let goodsMap = _.zip(goodsId, goods, params.goods);

      let firstNotFound = _.find(goodsMap, s => !s[1]);

      if (firstNotFound) {
        return makeReject(404, 'GOODS_NOT_FOUND', `Goods not found: ${firstNotFound[0]}`);
      }

      let orderGoods = goodsMap.map(s => {
        return {
          goodsId: s[0],
          name: s[1].name,
          price: s[1].price,
          quantity: s[2].quantity || 1
        };
      });

      let totalFee = orderGoods.reduce((r, c) => r + c.price * c.quantity, 0);

      let order = Object.assign({},
        _.pick(params, ['buyer', 'contactName', 'contactPhone', 'shippingAddress']),
        { goods: orderGoods, totalFee: totalFee, status: 'created' }
      );

      return dataSource.orders.insertOrUpdate(order);

    });
}

function deleteOrder(orderId) {
  return dataSource.orders.findAndRemoveById(orderId)
    .then(order => {
      return order
        ? Promise.resolve(order)
        : makeReject(404, 'ORDER_NOT_FOUND', `Order not found: ${orderId}`);
    });
}

function getOrder(orderId) {
  return dataSource.orders.findById(orderId)
    .then(order => {
      return order
        ? Promise.resolve(order)
        : makeReject(404, 'ORDER_NOT_FOUND', `Order not found: ${orderId}`);
    });
}

function queryOrders(query) {

  let pageIndex = query['pageIndex'] || 1,
      pageSize = query['pageSize'] || 10,
      totalPagesCount = 0,
      totalItemsCount = 0;

  if (pageIndex <= 0) pageIndex = 1;
  if (pageSize >= 50) pageSize = 50;

  let condition = _.omit(query, ['pageIndex', 'pageSize']);

  if (_.isEmpty(condition)) {
    return {
      orders: []
    };
  }

  let find = condition['id']
    ? dataSource.orders.findById(condition['id'])
    : dataSource.orders.items();

  return find
    .then(orders => {

      if (condition['buyer']) {
        orders = orders.filter(s => s['buyer'] === condition['buyer']);
      }

      totalItemsCount = orders.length;
      totalPagesCount = Math.ceil(totalItemsCount / pageSize);

      let start = (pageIndex - 1) * pageSize;
      orders = orders.slice(start, start + pageSize);
      return Promise.resolve({
        orders,
        pagination: {
          pageIndex,
          pageSize,
          totalItemsCount,
          totalPagesCount
        }
      });

    });
}

function updateOrderShippingDate(orderId, shippingDate) {
  return dataSource.orders.findById(orderId)
    .then(order => {
      if (!order) return makeReject(404, 'ORDER_NOT_FOUND', `Order not found: ${orderId}`);
      order.shippingDate = shippingDate;
      return dataSource.orders.insertOrUpdate(order);
    });
}

function updateOrderStatus(orderId, status) {
  return dataSource.orders.findById(orderId)
    .then(order => {
      if (!order) return makeReject(404, 'ORDER_NOT_FOUND', `Order not found: ${orderId}`);
      order.status = status;
      return dataSource.orders.insertOrUpdate(order);
    });
}

module.exports = {
  createOrder,
  deleteOrder,
  getOrder,
  queryOrders,
  updateOrderShippingDate,
  updateOrderStatus
};