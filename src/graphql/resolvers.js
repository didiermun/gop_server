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
const isAuthenticated = async(data)=>{
  if(!data){
    return false;
  }
  console.log(data);
  return true;
}

const isAuthorized = async(data,level) => {
  if(!await isAuthenticated(data)){
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
          return new ApolloError("Report not found","NOT_FOUND");
        }

        return group;
      },
      groups: async(_,{},{})=>{
        const groups = await Group.find();
        return groups;
      }
    },
    Mutation:{
      login: async(_,{data},{})=>{
        const group = await Group.findOne({code: data.code,password: data.password});
        if(!group){
          return {token: '',success: false}
        }

        const token = await generateToken(group);

        return {token,success: true}

      },
      newGroup: async(_,{data},{})=>{
        let exists = await Group.findOne({code: data.code});
        if(exists){
          return new ApolloError("Code taken","DUPLICATE_CODE");
        }

        let user = await Group.findOne({leader: data.leader});
        if(user){
          return new ApolloError("User leads another group","DUPLICATE_LEADER")
        }
        const group = new Group(data);
        const saved = await group.save();

        return saved;
      },
      newReport: async(_,{data},{group})=>{
        if(!await isAuthenticated(group)){
          return new AuthenticationError("Login required");
        }
        data.reporter = group.id;
        const report = new Report(data);
        const saved = await report.save();
        console.log(saved);

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