const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
} = require('graphql');
const { GraphQLDateTime } = require('graphql-iso-date');
const { connectionDefinitions, globalIdField } = require('graphql-relay');

const { Author } = require('./Author');
const { nodeInterface } = require('./Node');

const Book = new GraphQLObjectType({
    name: 'Book',
    sqlTable: 'books',
    uniqueKey: 'id',
    interfaces: [nodeInterface],
    fields: {
        id: {
            ...globalIdField('book'),
            sqlDeps: ['id'],
        },

        name: {
            type: GraphQLString,
            sqlColumn: 'name',
        },

        author: {
            type: GraphQLString,
            sqlColumn: 'author',
        },

        authId: {
            type: GraphQLInt,
            sqlColumn: 'auth_id',
        },

        createdAt: {
            type: GraphQLDateTime,
            sqlColumn: 'created_at',
        },

        updateAt: {
            type: GraphQLDateTime,
            sqlColumn: 'update_at',
        },

        authors: {
            type: new GraphQLList(Author),
            sqlJoin(bookTable, authorTable) {
                return `${bookTable}.auth_id = ${authorTable}.id`;
            },
        },
    },
});

const { connectionType: BookConnection } = connectionDefinitions({
    nodeType: Book,
    connectionFields: {
        total: { type: GraphQLInt },
    },
});

console.log(BookConnection._typeConfig.fields);

module.exports = { Book, BookConnection };