const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
} = require('graphql');

const Base64 = require('js-base64');
const { globalIdField } = require('graphql-base64');

const { connectionFromArray } = require('graphql-relay');

const joinMonster = require('join-monster').default;
const { nodeField } = require('./Node');

const { Book, BookConnection } = require('./Book');

const db = require('../db/knex');

const resolver = new GraphQLObjectType({
    description: 'global query object',
    name: 'Query',
    fields: {
        node: nodeField,

        books: {
            type: BookConnection,
            resolve: async(parent, args, context, resolveInfo) => {
                const data = await joinMonster(resolveInfo, context, (sql) => {
                    return db.raw(sql);
                });
                return connectionFromArray(data, args);
            },
        },

        book: {
            type: BookConnection,
            args: {
                id: {
                    type: GraphQLInt,
                },
            },

            where: (bookTable, args, context) => {
                if (args.id) return `${bookTable}.id = ${args.id}`;
            },

            resolve: async(parent, args, context, resolveInfo) => {
                const data = await joinMonster(resolveInfo, context, (sql) => {
                    return db.raw(sql);
                });
                let idDecode = Base64.encode(args.id.toString());
                console.log(connectionFromArray(data, idDecode));
                return connectionFromArray(data, idDecode);
            },
        },
        pagration: {
            type: BookConnection,
            args: {
                first: {
                    type: GraphQLInt,
                },
                after: {
                    type: GraphQLInt,
                },
            },
            resolve: async(parent, args, context, resolveInfo) => {
                const { first = null, after = 0 } = args;
                let query = db('books').offset(after);
                if (first) {
                    query = query.limit(first);
                }
                const data = await query;
                return connectionFromArray(data, args);
            },
        },
    },
});

console.log(resolver);

module.exports = resolver;