'use strict';

const expro = require('../../lib');

const goodsService = require('../services/goods-service');

module.exports.createGoods = expro(
  expro
    .with(x => x.body)
    .await(goodsService.createGoods),
  expro.status(201)
);

module.exports.updateGoods = expro(
  expro
    .with(x => x.swagger.params.goodsId.value, x => x.body)
    .await(goodsService.updateGoods)
);

module.exports.deleteGoods = expro(
  expro
    .with(x => x.swagger.params.goodsId.value)
    .await(goodsService.deleteGoods)
);

module.exports.getGoods = expro(
  expro
    .with(x => x.swagger.params.goodsId.value)
    .await(goodsService.getGoods)
);

module.exports.listGoods = expro(
  expro
    .with(x => x.query)
    .await(goodsService.listGoods)
);