'use strict';

const dataSource = require('../data/data-source');
const makeReject = require('../errors').makeReject;

function createOrder(params) {
  return dataSource.orders.insertOrUpdate(params);
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
  return Promise.resolve(query);
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