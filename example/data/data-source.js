'use strict';

const _ = require('lodash');
const chance = require('chance').Chance();
const Promise = require('bluebird');

const objectId = () => {
  let chars = '0a1b2c3d4e5f6789';
  let len = 24;
  return _
    .range(len)
    .reduce(arr => {
      let j = _.random(0, chars.length - 1);
      arr.push(chars.charAt(j));
      return arr;
    }, [])
    .join('');
};

class Collection {

  constructor(name) {
    this._name = name;
    this._coll = new Map();
  }

  insertOrUpdate(obj) {
    if (!obj.id) obj.id = objectId();
    this._coll.set(obj.id, obj);
    return Promise.resolve(obj);
  }

  insertMany(arr) {
    return Promise.map(arr, s => this.insertOrUpdate(s));
  }

  items() {
    let arr = Array.from(this._coll).map(s => s[1]);
    return Promise.resolve(arr);
  }

  findById(id) {
    return Promise.resolve(this._coll.get(id));
  }

  findAndRemoveById(id) {
    let obj = this._coll.get(id);
    if (obj) this._coll.delete(id);
    return Promise.resolve(obj);
  }

}

class UsersCollection extends Collection {

  constructor() {
    super('users');
  }

  findByUsername(username) {
    return this
      .items()
      .then(users => users.filter(s => s.username === username));
  }

  findAndRemoveByUsername(username) {
    return this
      .findByUsername(username)
      .then(users => {
        return users[0]
          ? this.findAndRemoveById(users[0].id)
          : Promise.resolve(null);
      });
  }

}

const dataSource = {
  users: new UsersCollection(),
  goods: new Collection('goods'),
  orders: new Collection('orders')
};

const _genUsers = () => {
  let users = _.range(10).map(() => {
    let name = chance.last();
    let fullname = chance.first() + ' ' + name;
    return {
      username: name.toLowerCase(),
      fullname: fullname,
      email: `${fullname.toLowerCase().replace(/\s+/g, '_')}@example.com`,
      phone: chance.phone({ formatted: false })
    };
  });
  return dataSource.users.insertMany(users);
};

const _genGoods = () => {
  let goods = _.range(10).map(() => {
    return {
      name: chance.word(),
      desc: chance.sentence(),
      category: chance.word(),
      price: chance.floating({ min: 10, max: 100, fixed: 2 }),
      count: chance.integer({ min: 0, max: 1000 }),
      tags: _.range(_.random(2, 8)).map(() => chance.word())
    };
  });
  return dataSource.goods.insertMany(goods);
};

const _genOrders = () => {
  // dataSource.users.find()
  //   .then(users => {
  //
  //   });
};

_genUsers().then(users => console.log('users:', users));
_genGoods().then(goods => console.log('goods:', goods));
// _genOrders();

module.exports = dataSource;