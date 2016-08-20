'use strict';

const expro = require('../../lib');

const goodsService = require('../services/goods-service');

module.exports.createGoods = expro(
  expro
    .with(x => x.body)
    .await(goodsService.createGoods),
  expro.wrap('goods'),
  expro.status(201)
);

module.exports.updateGoods = expro(
  expro
    .with(x => x.swagger.params['goodsId'].value, x => x.body)
    .await(goodsService.updateGoods),
  expro.wrap('goods')
);

module.exports.deleteGoods = expro(
  expro
    .with(x => x.swagger.params['goodsId'].value)
    .await(goodsService.deleteGoods),
  expro.wrap('goods')
);

module.exports.getGoods = expro(
  expro
    .with(x => x.swagger.params['goodsId'].value)
    .await(goodsService.getGoods),
  expro.wrap('goods')
);

module.exports.listGoods = expro(
  expro.query.prop('pageIndex').toInt(),
  expro.query.prop('pageSize').toInt(),
  expro
    .with(x => x.query)
    .await(goodsService.listGoods)
);