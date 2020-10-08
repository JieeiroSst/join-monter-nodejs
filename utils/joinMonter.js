const { connectionFromArray } = require('graphql-relay');
const { default: joinMonster } = require('join-monster');

const db = require('../db/knex');

const pagination = async(nameTable, args, context, resolveInfo) => {
    const data = await joinMonster(
        resolveInfo,
        context,
        (sql) => {
            return db.raw(sql);
        }, { dialect: 'pg' }
    );
    const [res] = await db(nameTable).count('*');
    const total = res.count;
    const entity = { total, ...connectionFromArray(data, args) };
    return entity;
};

module.exports = { pagination };