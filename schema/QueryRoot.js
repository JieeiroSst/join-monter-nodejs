const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
} = require('graphql');
const Base64 = require('js-base64');
const { globalIdField } = require('graphql-base64');
const { connectionFromArray, connectionArgs } = require('graphql-relay');
const joinMonster = require('join-monster').default;

const { nodeField } = require('./Node');
const { Book, BookConnection } = require('./Book');
const db = require('../db/knex');
const { count } = require('../db/knex');
const { AuthorConnection } = require('./Author');
const { CategoryConnection } = require('./categories');

const resolver = new GraphQLObjectType({
    description: 'global query object',
    sqlPaginate: true,
    name: 'Query',
    fields: {
        node: nodeField,
        books: {
            type: BookConnection,
            args: connectionArgs,
            resolve: async(parent, args, context, resolveInfo) => {
                const data = await joinMonster(
                    resolveInfo,
                    context,
                    (sql) => {
                        return db.raw(sql);
                    }, { dialect: 'pg' }
                );
                const [res] = await db('books').count('*');
                const total = res.count;
                const entity = { total, ...connectionFromArray(data, args) };
                return entity;
            },
        },

        authors: {
            type: AuthorConnection,
            args: connectionArgs,
            resolve: async(parent, args, context, resolveInfo) => {
                const data = await joinMonster(
                    resolveInfo,
                    context,
                    (sql) => {
                        return db.raw(sql);
                    }, { dialect: 'pg' }
                );
                const [res] = await db('authors').count('*');
                const total = res.count;
                const entity = { total, ...connectionFromArray(data, args) };
                return entity;
            },
        },

        categries: {
            type: CategoryConnection,
            args: connectionArgs,
            resolve: async(parent, args, context, resolveInfo) => {
                const data = await joinMonster(
                    resolveInfo,
                    context,
                    (sql) => {
                        return db.raw(sql);
                    }, { dialect: 'pg' }
                );
                const [res] = await db('categories').count('*');
                const total = res.count;
                const entity = { total, ...connectionFromArray(data, args) };
                return entity;
            },
        },
    },
});

module.exports = resolver;