const joinMonster = require('join-monster');
const { makeExecutableSchema } = require('graphql-tools');
const joinMonsterAdapt = require('join-monster-graphql-tools-adapter');
const pg = require('pg');

const db = require('../../db/knex');
const typeDefs = require('../typeDefs');

const resolvers = {
    Query: {
        async book(parent, args, ctx, resolveInfo) {
            console.log(args);
            return joinMonster.default(
                resolveInfo,
                ctx,
                async(sql) => {
                    console.log(sql);
                    return await db.raw(sql);
                }, { dialect: 'pg' }
            );
        },
    },
};

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

joinMonsterAdapt(schema, {
    Query: {
        fields: {
            book: {
                where: (table, args) => {
                    console(table + '------');
                    return `${table}.id = ${args.id}`;
                },
            },
        },
    },
    Book: {
        name: 'Book',
        sqlTable: 'books',
        uniqueKey: 'id',
        fields: {
            name: {
                sqlColumn: 'name',
            },
            author: {
                sqlColumn: 'author',
            },
            createdAt: {
                sqlColumn: 'created_at',
            },
            updateAt: {
                sqlColumn: 'update_at',
            },
            authors: {
                sqlJoin: (bookTable, authorTable) =>
                    `${bookTable}.auth_id = ${authorTable}.id`,
            },
        },
    },
    Author: {
        name: 'Author',
        sqlTable: 'authors',
        uniqueKey: 'id',
        fields: {
            name: {
                sqlColumn: 'name',
            },
            createdAt: {
                sqlColumn: 'created_at',
            },
            updateAt: {
                sqlColumn: 'update_at',
            },
        },
    },
});

module.exports = schema;