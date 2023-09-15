const config = require('config');
const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri = config.get('mongodb.connectionString');

const client = new MongoClient(uri);
const database = client.db('webhook-server');

async function insertTokens(tokens) {
  const tokenCollection = database.collection('yahooFantasyTokens');
  return tokenCollection.insertOne({date: new Date(), ...tokens });
}

async function getLatestTokens() {
  const tokenCollection = database.collection('yahooFantasyTokens');
  const documents = await tokenCollection.find({}).sort({date: -1}).limit(1).toArray();
  console.log(JSON.stringify(documents));
  return documents.pop();
}


module.exports = {insertTokens, getLatestTokens};