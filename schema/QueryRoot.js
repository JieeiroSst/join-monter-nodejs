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
                console.log(args);
                const data = await joinMonster(resolveInfo, context, (sql) => {
                    return db.raw(sql);
                });
                const [res] = await db('books').count('*');
                const total = res.count;
                const entity = { total, ...connectionFromArray(data, args) };
                return entity;
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

module.exports = resolver;