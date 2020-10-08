const Koa = require('koa');
const KoaRouter = require('koa-router');
const graphqlHTTP = require('koa-graphql');
const mount = require('koa-mount');
const koaBody = require('koa-bodyparser');

const schema = require('./graphql');
const loginRouter = require('./api/login');

const app = new Koa();
const router = new KoaRouter();

app.use(koaBody());

const context = (ctx, next) => {
    const { authorization: token } = ctx.headers;
    const userVerified = jwt.verify(token, secret);
    return { userVerified };
};

app.use(
    mount(
        '/',
        graphqlHTTP(async(ctx) => ({
            schema,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                //token: context(ctx),
            },
        }))
    )
);

app.use(loginRouter.routes());

const port = 3000;
app.listen(port, () =>
    console.log(`server listening at http://localhost:${port}`)
);