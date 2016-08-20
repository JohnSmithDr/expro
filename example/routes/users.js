'use strict';

const expro = require('../../lib');

const usersService = require('../services/users-service');

module.exports.createUser = expro(
  expro
    .with(x => x.body)
    .await(usersService.createUser),
  expro.wrap('user'),
  expro.status(201)
);

module.exports.updateUser = expro(
  expro
    .with(x => x.swagger.params.username.value, x => x.body)
    .await(usersService.updateUser),
  expro.wrap('user')
);

module.exports.deleteUser = expro(
  expro
    .with(x => x.swagger.params.username.value)
    .await(usersService.deleteUser),
  expro.wrap('user')
);

module.exports.getUser = expro(
  expro
    .with(x => x.swagger.params.username.value)
    .await(usersService.getUser),
  expro.wrap('user')
);