  // const { PrismaClient } = require('@prisma/client')
  // const prisma = new PrismaClient()
  const {Group} = require("../models/Group")
  const {Report} = require("../models/Report")
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
  const generateToken = async(group) => {
    const token = await jwt.sign(
      {
        id: group._id,
        name: group.name,
        password: group.password,
        code: group.code
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '5h' }
    )
    return token
  }
module.exports = {
    Query: { 
      me: async(_,{},{group}) => {
        const success = await isAuthenticated(group);

        return {success,group: group}
      },
      group: async(_,{id},{})=>{
        const group = await Group.findOne({_id: id});
        if(!group){
          return new ApolloError("Group not found","NOT_FOUND");
        }

        return group;
      },
      report: async(_,{id},{})=>{
        const group = await Report.findOne({_id: id});
        if(!group){
          return new ApolloError("Group not found","NOT_FOUND");
        }

        return group;
      },
      groups: async(_,{},{})=>{
        const groups = await Group.find();
        return groups;
      }
    },
    Mutation:{
      login: async(_,{loginData},{})=>{
        const group = await Group.findOne({code: loginData.code,password: loginData.password});
        if(!group){
          return {token: '',success: false}
        }

        const token = await generateToken(group);

        return {token,success: true}

      },
      newGroup: async(_,{data},{})=>{
        const group = new Group(data);
        const saved = await group.save();

        return saved;
      },
      newGroup: async(_,{data},{})=>{
        const report = new Report(data);
        const saved = await report.save();

        return saved;
      },
      updateGroup: async(_,{id,data},{})=>{
        let group = await Group.findOne({_id: id});

        if(!group){
          return new ApolloError("Group not found","NOT_FOUND");
        }
        group = Object.assign(group,data);
        let updated = await group.save();

        return updated;
      }
    }
      
  };