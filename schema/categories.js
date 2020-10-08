const { GraphQLObjectType, GraphQLString, GraphQLInt } = require('graphql');
const {
    connectionDefinitions,
    globalIdField,
    forwardConnectionArgs,
} = require('graphql-relay');

const { nodeInterface } = require('./Node');
const { BookConnection } = require('./Book');
const { AuthorConnection } = require('./Author');

const Category = new GraphQLObjectType({
    name: 'Category',
    sqlTable: 'categories',
    uniqueKey: 'id',
    interfaces: [nodeInterface],
    fields: {
        id: {
            ...globalIdField(),
            sqlDeps: ['id'],
        },

        name: {
            type: GraphQLString,
            sqlColumn: 'name',
        },

        authors: {
            type: AuthorConnection,
            sqlPaginate: true,
            args: forwardConnectionArgs,
            orderBy: {
                id: 'desc',
            },
            sqlJoin: (categoryTable, authorTable) =>
                `${categoryTable}.auth_id = ${authorTable}.id`,
        },

        books: {
            type: BookConnection,
            sqlPaginate: true,
            args: forwardConnectionArgs,
            orderBy: {
                id: 'DESC',
            },
            sqlJoin: (categoryTable, bookTable) =>
                `${categoryTable}.book_id=${bookTable}.id`,
        },
    },
});

const { connectionType: CategoryConnection } = connectionDefinitions({
    nodeType: Category,
    connectionFields: {
        total: { type: GraphQLInt },
    },
});
module.exports = { Category, CategoryConnection };