require('dotenv').config()

const Router = require('@koa/router')
const { db } = require('./database')
const { koaBody } = require('koa-body')
const { ObjectId } = require('mongodb')

const instrumentRouter = new Router({
  prefix: '/'
});

instrumentRouter
  .get('/', async (ctx) => {
    try {
      const instruments = await db().then((v) =>
        v.collection('instruments').find().toArray()
      );
      ctx.body = { message: 'OK', data: instruments };
    } catch (e) {
      console.log(e);
      ctx.body = { message: 'Err', error: e };
      ctx.status = 400;
    }
  })
  .post('/', koaBody({ multipart: true }), async (ctx) => {
    const { body: instrument } = ctx.request;

    try {
      await db().then((v) =>
        v.collection('instruments').insertOne({
          ...instrument,
          createdDate: Date.now().toString(),
          updatedDate: ''
        })
      );
      ctx.body = { message: 'OK', data: [] };
    } catch (e) {
      console.log(e);
      ctx.body = { message: 'Err', error: e };
      ctx.status = 400;
    }
  })
  .get('/:id', async (ctx) => {
    const { id } = ctx.params;
    const objectId = new ObjectId(id);

    try {
      const instrument = await db().then((v) =>
        v.collection('instruments').findOne({ _id: { $eq: objectId } })
      );
      ctx.body = { message: 'OK', data: [instrument] };
    } catch (e) {
      console.log(e);
      ctx.body = { message: 'Err', error: e };
      ctx.status = 400;
    }
  })
  .put('/:id', koaBody({ multipart: true }), async (ctx) => {
    const { body: instrument } = ctx.request;
    const { id } = ctx.params;
    const objectId = new ObjectId(id);

    try {
      const newInstrument = await db().then((v) =>
        v.collection('instruments').findOneAndUpdate(
          { _id: objectId },
          {
            $set: { ...instrument, updatedDate: Date.now().toString(), _id: objectId }
          },
          {
            returnDocument: 'after'
          }
        )
      );
      ctx.body = { message: 'OK', data: [newInstrument] };
    } catch (e) {
      console.log(e);
      ctx.body = { message: 'Err', error: e };
      ctx.status = 400;
    }
  })
  .del('/:id', async (ctx) => {
    const { id } = ctx.params;
    const objectId = new ObjectId(id);

    try {
      const deletedInstrument = await db().then((v) =>
        v.collection('instruments').findOneAndDelete({ _id: objectId })
      );
      ctx.body = { message: 'OK', data: [deletedInstrument] };
    } catch (e) {
      console.log(e);
      ctx.body = { message: 'Err', error: e };
      ctx.status = 400;
    }
  });

module.exports = { instrumentRouter };
