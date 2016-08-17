'use strict';

function createOrder(params) {
  return Promise.resolve(params);
}

function deleteOrder(orderId) {
  return Promise.resolve(orderId);
}

function getOrder(orderId) {
  return Promise.resolve(orderId);
}

function queryOrders(query) {
  return Promise.resolve(query);
}

module.exports = { createOrder, deleteOrder, getOrder, queryOrders };