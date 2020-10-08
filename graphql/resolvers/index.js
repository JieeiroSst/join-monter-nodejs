const _ = require('lodash');
const modules = [require('./book'), require('./author'), require('./node')];

const mergeAll = (items) => _.reduce(items, _.merge);

const resolvers = mergeAll(modules.map((item) => item.resolvers));

module.exports = {
    ...resolvers,
};