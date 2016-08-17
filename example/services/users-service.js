'use strict';

function createUser(params) {
  return Promise.resolve(params);
}

function updateUser(username, params) {
  return Promise.resolve(params);
}

function deleteUser(username) {
  return Promise.resolve(username);
}

function getUser(username) {
  return Promise.resolve(username);
}

module.exports = { createUser, updateUser, deleteUser, getUser };