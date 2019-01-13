const { ApolloServer, AuthenticationError } = require('apollo-server');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

/**
 * import typeDefs and resolvers
 */
const filePath = path.join(__dirname, 'typeDefs.gql');
const typeDefs = fs.readFileSync(filePath, 'utf-8');
const resolvers = require('./resolvers');

/**
 * import Environment Variables and Mongoose Model
 */
require('dotenv').config({ path: 'variables.env' });
const User = require('./models/User');
const Post = require('./models/Post');

/**
 * Connect to MLab Data
 */
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log('DB connected'))
  .catch(err => console.log(err));

// Verify JWT Token passed from client
const getUser = async token => {
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError('Your session has ended. Please sign in again.');
    }
  }
};

/**
 * Create Apollo/GraphQl Server using typeDefs, resolvers and context object
 */
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: ({ name, message }) => ({ name, message: message.replace('Context creation failed:', '') }),
  context: async ({ req }) => {
    const token = req.headers.authorization;
    return { User, Post, currentUser: await getUser(token) }
  }
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server listening on ${url}`)
});
