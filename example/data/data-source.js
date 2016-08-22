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

  find(condition) {
    return this.items()
      .then(items => {
        if (_.isEmpty(condition)) return Promise.resolve(items);
        let filtered = items.filter(s => {
          return Object.keys(condition).every(key => s[key] === condition[key]);
        });
        return Promise.resolve(filtered);
      });
  }

  findById(id) {
    if (Array.isArray(id) && id.length) {
      let items = id.map(key => this._coll.get(key)).filter(s => s);
      return Promise.resolve(items);
    }
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
  let demoUsers = [
    {
      username: 'john',
      fullname: 'John Smith',
      email: 'johnsmith@example.com',
      phone: chance.phone({ formatted: false })
    },
    {
      username: 'jane',
      fullname: 'Jane Smith',
      email: 'janesmith@example.com',
      phone: chance.phone({ formatted: false })
    }
  ];
  return dataSource.users.insertMany(demoUsers);
};

const _genGoods = () => {
  let demoGoods = [
    {
      id: '0001',
      name: 'Cappuccino',
      desc: chance.sentence(),
      category: 'Coffee',
      price: chance.floating({ min: 10, max: 200, fixed: 2 }),
      count: chance.integer({ min: 0, max: 1000 }),
      tags: [ 'Coffee', 'Cafe', 'Drinks' ]
    },
    {
      id: '0002',
      name: 'Mocha',
      desc: chance.sentence(),
      category: 'Coffee',
      price: chance.floating({ min: 10, max: 200, fixed: 2 }),
      count: chance.integer({ min: 0, max: 1000 }),
      tags: [ 'Coffee', 'Cafe', 'Drinks' ]
    },
    {
      id: '0003',
      name: 'Latte',
      desc: chance.sentence(),
      category: 'Coffee',
      price: chance.floating({ min: 10, max: 200, fixed: 2 }),
      count: chance.integer({ min: 0, max: 1000 }),
      tags: [ 'Coffee', 'Cafe', 'Drinks' ]
    },
    {
      id: '0004',
      name: 'Espresso',
      desc: chance.sentence(),
      category: 'Coffee',
      price: chance.floating({ min: 10, max: 200, fixed: 2 }),
      count: chance.integer({ min: 0, max: 1000 }),
      tags: [ 'Coffee', 'Cafe', 'Drinks' ]
    },
    {
      id: '0005',
      name: 'Flat White',
      desc: chance.sentence(),
      category: 'Coffee',
      price: chance.floating({ min: 10, max: 200, fixed: 2 }),
      count: chance.integer({ min: 0, max: 1000 }),
      tags: [ 'Coffee', 'Cafe', 'Drinks' ]
    },
    {
      id: '0006',
      name: 'Americano',
      desc: chance.sentence(),
      category: 'Coffee',
      price: chance.floating({ min: 10, max: 200, fixed: 2 }),
      count: chance.integer({ min: 0, max: 1000 }),
      tags: [ 'Coffee', 'Cafe', 'Drinks' ]
    }
  ];
  return dataSource.goods.insertMany(demoGoods);
};

_genUsers().then(users => console.log('users:', users));
_genGoods().then(goods => console.log('goods:', goods));

module.exports = dataSource;