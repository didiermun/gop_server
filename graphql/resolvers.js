  // const { PrismaClient } = require('@prisma/client')
  // const prisma = new PrismaClient()
  const {Record} = require("../models/record.model")
  const {Patrouille} = require("../models/patrouille.model")
  const {Code} = require("../models/code.model")
  const jwt = require('jsonwebtoken')
  const {
    AuthenticationError,
    ForbiddenError,
    UserInputError,
    ApolloError,
  } = require("apollo-server-express");
const isAuthenticated = async(code)=>{
  if(!code){
    return false;
  }
  console.log(code);
  return true;
}

const isAuthorized = async(code,level) => {
  if(!await isAuthenticated(code)){
    return false;
  }
  if(code.level != level){
    return false;
  }

  return true;
}
  const generateToken = async(code) => {
    const token = await jwt.sign(
      {
        id: code._id,
        code: code.code,
        level: code.level
      },
      "SecretKey",
      { expiresIn: '5h' }
    )
    return token
  }
module.exports = {
    Query: { 
      me: async(_,{},{codeData}) => {
        const success = await isAuthenticated(codeData);

        return {success,code: codeData}
      }
    },
    Mutation:{
      login: async(_,{code},{codeData})=>{
        const codefound = await Code.findOne({code: code});
        if(!codefound){
          return {token: '',success: false}
        }

        const token = await generateToken(codefound);

        return {token,success: true}

      },
    }
      
  };