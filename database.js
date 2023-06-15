require('dotenv').config()

const { MongoClient } = require('mongodb')

const db = async () => {
  const { MONGO_URL: url } = process.env;
  const client = new MongoClient(url);
  await client.connect();

  return client.db();
};

module.exports = { db }
