const { pagination } = require('../../utils/joinMonter');
const db = require('../../db/knex');

const resolvers = {
    Query: {
        books: async(parent, args, context, resolveInfo) => {
            const nameTable = 'books';
            try {
                const data = await pagination(nameTable, args, context, resolveInfo);
                return {
                    error: null,
                    result: data,
                };
            } catch (error) {
                return {
                    error,
                    result: null,
                };
            }
        },
    },

    Mutation: {
        insertBook: async(parent, args, context, info) => {
            try {
                const { name, author, auth_id } = args;
                const entity = {
                    name,
                    author,
                    auth_id,
                };
                const data = await db('books')
                    .insert(entity)
                    .returning('*');
                return {
                    error: null,
                    result: data,
                };
            } catch (error) {
                return {
                    error,
                    result: null,
                };
            }
        },

        updateBook: async(parent, args, context, info) => {
            try {
                const { id, name, author, auth_id } = args;
                const entity = {
                    name,
                    author,
                    auth_id,
                };
                const data = await db('books')
                    .where({ id })
                    .update(entity)
                    .returning('*');
                return {
                    error: null,
                    result: data,
                };
            } catch (error) {
                return {
                    error,
                    result: null,
                };
            }
        },
        deleteBook: async(parent, args, context, info) => {
            try {
                const { id } = args;
                const data = await db('books')
                    .del()
                    .where({ id })
                    .returning('*');
                return {
                    error: null,
                    result: data,
                };
            } catch (error) {
                return {
                    error,
                    result: null,
                };
            }
        },
    },
};

module.exports = { resolvers };