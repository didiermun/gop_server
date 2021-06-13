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
      },
      codes: async(_,{},{codeData}) =>{
        if(!await isAuthorized(codeData,"ADMIN")){
          return new ForbiddenError("Not Authorized");
        }
        const codes = await Code.find().sort({createdAt: -1})
        return codes;
      },
      code: async(_,{id},{codeData}) =>{
        if(!await isAuthorized(codeData,"ADMIN")){
          return new ForbiddenError("Not Authorized");
        }
        const code = await Codes.findOne({_id: id})
        if(!code){
          return new ApolloError("CODE NOT FOUND","N'EXIST")
        }
        return code;
      },
      patrouilles: async(_,{},{codeData}) =>{
        const patrouilles = await Patrouille.find({status:{ $ne:"DELETED"}}).sort({createdAt: -1})
        return patrouilles;
      },
      records: async(_,{patrouille_id},{codeData}) =>{
        const records = await Record.find({p_id: patrouille_id,status:{ $ne:"DELETED"}}).sort({createdAt: -1})
        return records;
      },
      patrouille: async(_,{id},{codeData}) =>{
        const patrouille = await Patrouille.findOne({_id: id})
        if(!patrouille){
          return new ApolloError("Patrouille n’existe pas","N'EXIST")
        }
        const records = await Record.find({p_id: id})
        const fullpatrouille = {
          patrouille: patrouille,
          records: records
        }
        return fullpatrouille;
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
      newRecord: async(_,{record},{codeData})=>{
        if(!await isAuthenticated(codeData,"ADMIN")){
          return new AuthenticationError("Not Authenticated");
        }
        const patrouille = await Patrouille.findOne({_id: record.p_id});
        if(!patrouille){
          return new ApolloError(`Patrouille n’existe pas ${record.p_id}`,"N'EXIST")
        }
        const newRecord = new Record(record)
        const recordCreated  = await newRecord.save();
        return recordCreated;
      },
      newCode: async(_,{code},{codeData})=>{
        if(!await isAuthorized(codeData,"ADMIN")){
          return new ForbiddenError("Not Authorized");
        }
        const newCode =  new Code(code);
        const createCode = await newCode.save();
        return createCode;
      },
      deleteCode: async(_,{id},{codeData})=>{
        if(!await isAuthorized(codeData,"ADMIN")){
          return new ForbiddenError("Not Authorized");
        }
        const code = await Code.findOne({_id: id});
        if(!code){
          return new ApolloError("CODE NOT FOUND","N'EXIST")
        }
        await Code.findByIdAndDelete(id);
        return code;
      },
      newPatrouille: async(_,{patrouille},{codeData}) => {
        if(!await isAuthenticated(codeData,"ADMIN")){
          return new AuthenticationError("Not Authenticated");
        }
        const newPatrouille = new Patrouille(patrouille)
        const patrouilleSaved = await newPatrouille.save();
        return patrouilleSaved;
      },
      deletePatrouille: async(_,{id},{codeData}) => {
        if(!await isAuthorized(codeData,"ADMIN")){
          return new ForbiddenError("Not Authorized");
        }
        let patrouille = await Patrouille.findOne({_id: id});
        if(!patrouille){
          return new ApolloError("CODE NOT FOUND","N'EXIST")
        }
        patrouille.status = "DELETED";
        const deleted = await patrouille.save();
        return deleted;
      },
      deleteRecord: async(_,{id},{codeData}) => {
        if(!await isAuthenticated(codeData,"ADMIN")){
          return new AuthenticationError("Not Authenticated");
        }
        let record = await Record.findOne({_id: id});
        if(!record){
          return new ApolloError("CODE NOT FOUND","N'EXIST")
        }
        record.status = "DELETED";
        const deleted = await record.save();
        return deleted;
      }
    }
  };