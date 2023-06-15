const Koa = require('koa');
const cors = require('@koa/cors')
const logger = require('koa-logger')
const json = require('koa-json')
const { instrumentRouter } = require('./routes')

const app = new Koa();

app.use(logger())
app.use(cors())
app.use(json())

app.use(instrumentRouter.routes())
app.use(instrumentRouter.allowedMethods())

module.exports = { app }
