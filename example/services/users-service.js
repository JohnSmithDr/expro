'use strict';

const dataSource = require('../data/data-source');
const makeReject = require('../errors').makeReject;

function createUser(params) {

  return dataSource.users.findByUsername(params.username)
    .then(users => {
      if (users.length > 0) {
        return makeReject(400, 'USER_EXISTS', `User exists: ${params.username}`);
      }
      return dataSource.users.insertOrUpdate(params);
    });
}

function updateUser(username, params) {

  return dataSource.users.findByUsername(params.username)
    .then(users => {
      if (users.length === 0) {
        return makeReject(400, 'USER_NO_EXISTS', `User does not exists: ${username}`);
      }
      let user = users[0];
      user = Object.assign(user, params);
      return dataSource.users.insertOrUpdate(user);
    });
}

function deleteUser(username) {
  return dataSource.users.findAndRemoveByUsername(username);
}

function getUser(username) {
  return dataSource.users.findByUsername(username);
}

module.exports = { createUser, updateUser, deleteUser, getUser };