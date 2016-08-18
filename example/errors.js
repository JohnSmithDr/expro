'use strict';

function makeError(statusCode, errorCode, errorMessage) {
  let err = Error(errorMessage);
  err.statusCode = statusCode;
  err.errorCode = errorCode;
  return err;
}

function makeReject(statusCode, errorCode, errorMessage) {
  return Promise.reject(makeError(statusCode, errorCode, errorMessage));
}

module.exports = { makeError, makeReject };