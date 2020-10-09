const { nodeField } = require('../../utils/node');

const resolvers = {
    Query: {
        node: {
            nodeField,
        },
    },
};

module.exports = { resolvers };