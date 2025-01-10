const mongoose = require('mongoose');

// Define a schema for storing tokens
const tokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '1h' } // Token expires in 1 hour
});

// Create a model based on the schema
const TokenModel = mongoose.model('Token', tokenSchema);
module.exports= TokenModel;