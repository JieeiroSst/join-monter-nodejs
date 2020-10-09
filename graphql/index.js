const { makeExecutableSchema } = require('graphql-tools');
const joinMonsterAdapt = require('join-monster-graphql-tools-adapter');

const typeDefs = require('./typeDefs');
let resolvers = require('./resolvers');
const scalar = require('../scalar/isoDate');

resolvers = {...scalar, ...resolvers };

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

joinMonsterAdapt(schema, {
    Query: {
        fields: {},
    },

    Author: {
        sqlTable: 'authors',
        uniqueKey: 'id',
        fields: {
            createdAt: {
                sqlColumn: 'created_at',
            },
            updateAt: {
                sqlColumn: 'update_at',
            },
        },
    },

    Book: {
        sqlTable: 'books',
        uniqueKey: 'id',
        fields: {
            createdAt: {
                sqlColumn: 'created_at',
            },
            updateAt: {
                sqlColumn: 'update_at',
            },
            authors: {
                sqlJoin: (bookTable, authorTable) =>
                    `${bookTable}.auth_id=${authorTable}.id`,
            },
        },
    },
    Category: {
        sqlTable: 'categories',
        uniqueKey: 'id',
        fields: {
            authors: {
                sqlJoin: (categoryTable, authorTable) =>
                    `${categoryTable}.auth_id=${authorTable}.id`,
            },
            books: {
                sqlJoin: (categoryTable, bookTable) =>
                    `${categoryTable}.book_id=${bookTable}.id`,
            },
        },
    },
});

module.exports = schema;