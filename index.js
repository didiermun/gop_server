const { createServer } = require("http");
const { PubSub} = require("apollo-server")
const mongoose = require("mongoose");
const pubsub = new PubSub();
const express = require("express");
const { ApolloServer} = require("apollo-server-express");
const typeDefs = require("./src/graphql/typeDefs");
const resolvers = require("./src/graphql/resolvers");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const jwt = require("jsonwebtoken");

app.use(cors());
dotenv.config()
app.get("/", (req, res) => {
    const response =
      "<h1 style='text-align: center; margin-top: 8%; font-size: 60px; font-family: sans-serif'>WELCOME</h1><br> <p style='text-align: center;font-family: sans-serif'> EXPLORE THE BACKEND <a href='/graphql'>PLAYGROUND</a></p>";
    res.status(200).send(response);
  });
  
const verifiedToken = async (token) => {
    try {
      return await jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (e) {
      return
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    introspection: true,
    formatError: (error) => {
      console.log({ error })
      if (error.message === 'VALIDATION_ERROR') {
        const extensions = {
          code: 'VALIDATION_ERROR',
          errors: [],
        }

        Object.keys(error.extensions.invalidArgs).forEach(key => {
          const constraints = []
          Object.keys(error.extensions.invalidArgs[key].constraints).forEach(
            _key => {
              constraints.push(
                error.extensions.invalidArgs[key].constraints[_key],
              )
            },
          )

          extensions.errors.push({
            field: error.extensions.invalidArgs[key].property,
            errors: constraints,
          })
        })

        const graphQLFormattedError = {
          message: 'VALIDATION_ERROR',
          extensions: extensions,
        }

        return graphQLFormattedError
      }
      else if (error.extensions.code === 'GROUP_NOT_FOUND') {
        return {
          status: 404,
          message: 'Job is not found',
          error: 'notfound',
        }
      }
      else if (error.extensions.code === 'REPORT_NOT_FOUND') {
        return {
          status: 404,
          message: 'Report is not found',
          error: 'notfound',
        }
      }
      else if (error.extensions.code === 'NO_BOOK') {
        return {
          status: 404,
          message: 'You havent bookmarked anything yet',
          error: 'notfound',
        }
      }
      else if (error.extensions.code === 'DUPLICATE_CODE') {
        return {
          status: 403,
          message: 'Code found, it already exists',
          error: 'duplicates',
        }
      }
      else if (error.extensions.code === 'FORBIDEN') {
        return {
          status: 403,
          message: 'Access denied',
          error: 'unauthorized',
        }
      }
      else if (error.extensions.code === 'DUPLICATE_LEADER') {
        return {
          status: 403,
          message: 'Leader leaders another group',
          error: 'duplicates',
        }
      } else if (error.extensions.code === 'UNAUTHENTICATED') {
        return {
          status: 401,
          message: 'Not authenticated',
          error: 'Unauthenticated',
        }
      } 
      else if (error.extensions.code === 'LOGIN_FAILED') {
        return {
          status: 404,
          message: 'Login failed',
          error: 'invalid_credentials',
        }
      } else if (!error.path) {
        return {
          message: error.message,
          status: 400,
        }
      } else {
        if (error.extensions.exception.name === 'JsonWebTokenError') {
          const graphQLFormattedError = {
            status: 404,
            message: 'Invalid token',
            error: 'Unauthorized',
          }
          return graphQLFormattedError
        } else if (error.extensions.exception.code === 'P2002') {
          const field = error.extensions.exception.meta.target[0]
          const graphQLFormattedError = {
            status: 404,
            message: 'Invalid Data',
            error: `${field} Already exists`,
          }
          return graphQLFormattedError
        } else {
          return error.extensions?.exception?.response
        }
      }
    },
    context: async ({ req, connection }) => {
      let token = "";
      if (connection && connection.context.token) {
        token = connection.context.token;
      }
      else if(req && req.headers.token){
        token = req.headers.token;
      }
      const group = await verifiedToken(token);
      return {
        group,
        pubsub,
        token
      };
    },
    tracing: true
  });
  
  server.applyMiddleware({ app, path: "/graphql" })
  
const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);
const PORT = process.env.PORT || 4000;
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
httpServer.listen(PORT , () =>{
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}\n`)
})
})
.catch((err) => console.log("err", err));