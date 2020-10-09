const { makeExecutableSchema } = require('graphql-tools');
const joinMonsterAdapt = require('join-monster-graphql-tools-adapter');
const { globalIdField } = require('graphql-relay');

const typeDefs = require('./typeDefs');
let resolvers = require('./resolvers');
const scalar = require('../scalar/isoDate');
const { nodeInterface } = require('../utils/node');

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
        name: 'Author',
        sqlTable: 'authors',
        uniqueKey: 'id',
        interfaces: [nodeInterface],
        fields: {
            id: {
                ...globalIdField(),
                sqlDeps: ['id'],
            },
            createdAt: {
                sqlColumn: 'created_at',
            },
            updateAt: {
                sqlColumn: 'update_at',
            },
        },
    },

    Book: {
        name: 'Book',
        sqlTable: 'books',
        uniqueKey: 'id',
        interfaces: [nodeInterface],
        fields: {
            id: {
                ...globalIdField(),
                sqlDeps: ['id'],
            },
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
        name: 'Category',
        sqlTable: 'categories',
        uniqueKey: 'id',
        interfaces: [nodeInterface],
        fields: {
            id: {
                ...globalIdField(),
                sqlDeps: ['id'],
            },
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