const { makeExecutableSchema } = require('graphql-tools');
const typeDefs = require('./typeDefs');
let resolvers = require('./resolvers');
const scalar = require('../scalar/isoDate');

resolvers = {...scalar, ...resolvers };

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

module.exports = schema;