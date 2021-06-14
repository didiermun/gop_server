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
  const options = (limit,pageCount) =>{
    return {
      sort: { createdAt: -1 },
      page: pageCount || 1,
      limit: limit || 10,
      populate: 'reporter'
    }
  }
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
      group: async(_,{id},{group})=>{
        const g = await Group.findOne({_id: id});
        if(!g){
          return new ApolloError("Group not found","GROUP_NOT_FOUND");
        }

        return g;
      },
      report: async(_,{id},{group})=>{
        if(!await isAuthenticated(group)){
          return new AuthenticationError("Login required")
        }
        const report = await Report.findOne({_id: id}).populate('reporter');
        if(!report){
          return new ApolloError("Report not found","REPORT_NOT_FOUND");
        }

        return report;
      },
      groups: async(_,{},{group})=>{
        if(!await isAuthenticated(group)){
          return new AuthenticationError("Login required")
        }
        const groups = await Group.find();
        return groups;
      },
      reports: async(_,{limit,page},{group})=>{
        if(!await isAuthenticated(group)){
          return new AuthenticationError("Login required")
        }
        const reports = await Report.paginate({},options(limit,page));
        return reports.docs;
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
      newGroup: async(_,{data},{group})=>{
        if(!await isAuthenticated(group)){
          return new AuthenticationError("Login required")
        }
        let exists = await Group.findOne({code: data.code});
        if(exists){
          return new ApolloError("Code taken","DUPLICATE_CODE");
        }

        let user = await Group.findOne({leader: data.leader});
        if(user){
          return new ApolloError("User leads another group","DUPLICATE_LEADER")
        }
        const g = new Group(data);
        const saved = await g.save();

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
      updateGroup: async(_,{id,data},{group})=>{
        if(!await isAuthenticated(group)){
          return new AuthenticationError("Login required")
        }
        let g = await Group.findOne({_id: id});

        if(!g){
          return new ApolloError("Group not found","GROUP_NOT_FOUND");
        }
        g = Object.assign(g,data);
        let updated = await group.save();

        return updated;
      }
    }
      
  };