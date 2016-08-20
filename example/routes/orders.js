'use strict';

const expro = require('../../lib');

const ordersService = require('../services/orders-service');

module.exports.createOrder = expro(
  expro
    .with(x => x.body)
    .await(ordersService.createOrder),
  expro.wrap('order'),
  expro.status(201)
);

module.exports.deleteOrder = expro(
  expro
    .with(x => x.swagger.params['orderId'].value)
    .await(ordersService.deleteOrder),
  expro.wrap('order')
);

module.exports.getOrder = expro(
  expro
    .with(x => x.swagger.params['orderId'].value)
    .await(ordersService.getOrder),
  expro.wrap('order')
);

module.exports.queryOrders = expro(
  expro
    .with(x => x.query)
    .await(ordersService.queryOrders)
);

module.exports.updateOrderShippingData = expro(
  expro
    .with(x => x.swagger.params['orderId'].value, x => x.body.shippingDate)
    .await(ordersService.updateOrderShippingDate),
  expro.wrap('order')
);

module.exports.updateOrderStatus = expro(
  expro
    .with(x => x.swagger.params['orderId'].value, x => x.body.status)
    .await(ordersService.updateOrderStatus),
  expro.wrap('order')
);