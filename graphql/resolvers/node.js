const { nodeDefinitions, fromGlobalId } = require('graphql-relay');
const joinMonster = require('join-monster').default;

const db = require('../../db/knex');

const { nodeInterface, nodeField } = nodeDefinitions(
    async(globalId, context, resolverInfo) => {
        const { type, id } = fromGlobalId(globalId);
        return await joinMonster.getNode(
            type,
            resolverInfo,
            context,
            parseInt(id),
            (sql) => {
                return db.raw(sql);
            }, { dialect: 'pg' }
        );
    },
    (obj) => obj.__type__
);

const resolvers = {
    Query: {},
    Mutation: {},
    Node: {
        __resolveType() {
            return nodeInterface;
        },
    },
};

module.exports = { resolvers };