'use strict';

const expro = require('../../lib');

const ordersService = require('../services/orders-service');

module.exports.createOrder = expro(
  expro
    .with(x => x.body)
    .await(ordersService.createOrder),
  expro.status(201)
);

module.exports.deleteOrder = expro(
  expro
    .with(x => x.swagger.params.orderId.value)
    .await(ordersService.deleteOrder)
);

module.exports.getOrder = expro(
  expro
    .with(x => x.swagger.params.orderId.value)
    .await(ordersService.getOrder)
);

module.exports.queryOrders = expro(
  expro
    .with(x => x.query)
    .await(ordersService.queryOrders)
);