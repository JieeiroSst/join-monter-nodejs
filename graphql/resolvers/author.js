const { pagination } = require('../../utils/joinMonter');
const db = require('../../db/knex');

const resolvers = {
    Query: {
        authors: (parent, args, context, info) => {
            try {
                const nameTable = 'authors';
                const data = pagination(nameTable, args, context, info);
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
        insertAuthor: async(parent, args, context, info) => {
            try {
                const { name } = args;
                const data = await db('authors')
                    .insert({ name })
                    .returning('*');
                return {
                    result: data,
                };
            } catch (error) {
                return {
                    result: null,
                };
            }
        },

        updateAuthor: async(parent, args, context, info) => {
            try {
                const { id, name } = args;
                const data = await db('authors')
                    .where({ id })
                    .update({ name })
                    .returning('*');
                return {
                    result: data,
                };
            } catch (error) {
                return {
                    result: null,
                };
            }
        },

        deleteAuthor: async(parent, args, context, info) => {
            try {
                const { id } = args;
                const data = await db('authors')
                    .del()
                    .where({ id });
                return {
                    result: data,
                };
            } catch (error) {
                return { result: null };
            }
        },
    },
    Author: {
        createdAt: (parent) => {
            return parent.created_at;
        },
        updateAt: (parent) => {
            return parent.update_at;
        },
    },
};

module.exports = { resolvers };