const { connectionFromArray } = require('graphql-relay');
const joinMonster = require('join-monster').default;

const db = require('../db/knex');

const options = { dialect: 'pg' };

const pagination = async(nameTable, args, context, resolveInfo) => {
    const [res] = await db(nameTable).count('*');
    const total = res.count;
    const data = await joinMonster(
        resolveInfo,
        context,
        (sql) => {
            return db.raw(sql);
        },
        options
    );
    console.log(data);
    const entity = { total, ...connectionFromArray(data, args) };
    return entity;
};

module.exports = { pagination };