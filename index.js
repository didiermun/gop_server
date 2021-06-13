const { createServer } = require("http");
const { PubSub} = require("apollo-server")
const mongoose = require("mongoose");
const pubsub = new PubSub();
const express = require("express");
const { ApolloServer} = require("apollo-server-express");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
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
      return await jwt.verify(token, "SecretKey");
    } catch (e) {
      return
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    introspection: true,
    context: async ({ req, connection }) => {
      let token = "";
      if (connection && connection.context.token) {
        token = connection.context.token;
      }
      else if(req && req.headers.token){
        token = req.headers.token;
      }
      const codeData = await verifiedToken(token);
      return {
        codeData,
        pubsub,
        token
      };
    },
    tracing: true
  });
  
  server.applyMiddleware({ app, path: "/graphql" })
  
const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);
const PORT = process.env.PORT || 5000;
const {DATABASE_URL} = require("./config/database")
mongoose
  .connect(DATABASE_URL, {
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