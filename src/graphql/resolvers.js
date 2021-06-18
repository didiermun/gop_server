  // const { PrismaClient } = require('@prisma/client')
  // const prisma = new PrismaClient()
  const {Group} = require("../models/Group")
  const {Report} = require("../models/Report")
  const {Bookmark} = require("../models/Bookmark")
  const jwt = require('jsonwebtoken')
  const bcrypt = require('bcrypt')
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

  const salt = 12;
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
        code: group.code,
        leader: group.leader
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
      bookmarks: async(_,{},{group})=>{

        if(!await isAuthenticated(group)){
          return new AuthenticationError("Login required")
        }
        const books = await Bookmark.paginate({user: group.id},{populate:['user','bookmarks.reporter']})

        return books.docs;

      },
      work: async(_,{},{})=>{
        if(!await isAuthenticated(group)){
          return new AuthenticationError("Login required")
        }
        const reports = await Report.paginate({reporter: group.id},options(limit,page));
        return reports.docs;
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
        const group = await Group.findOne({code: data.code});
        if(!group){
          return new ApolloError("Credentails failed u","LOGIN_FAILED")
        }

        if(!await bcrypt.compare(data.password,group.password)){
          return new ApolloError("Credentails failed u","LOGIN_FAILED")
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
        const hashed_password = await bcrypt.hash(data.password,salt);
        data.password = hashed_password;
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
      bookReport: async(_,{id},{group})=>{
        if(!await isAuthenticated(group)){
          return new AuthenticationError("Login required")
        }
        let bookmark = await Bookmark.findOne({_id: id});
        if(!bookmark){
          const book = new Bookmark({
            user: group.id,
            bookmarks: [id]
          })
          await book.save();
          return {success : true, message: 'Report Bookmarked'}
        }
        if(bookmark.bookmarks.includes(id)){
          return {success : true, message: 'Already Bookmarked'}
        }

        bookmark.bookmarks = [...bookmark.bookmarks,id];

        await bookmark.save();
        return {success : true, message: 'Report Bookmarked'}
      },
      removeBook: async(_,{id},{group})=>{
        if(!await isAuthenticated(group)){
          return new AuthenticationError("Login required")
        }
        let bookmark = await Bookmark.findOne({_id: id});
        if(!bookmark){
         return {success : false, message: 'Bookmark not found'}
        }
        if(!bookmark.bookmarks.includes(id)){
          return {success : false, message: 'Bookmark not found'}
        }
        var filtered = bookmark.bookmarks.filter(function(value, index, arr){ 
          return value != id;
        });

        bookmark.bookmarks = filtered;

        await bookmark.save();
        return {success : true, message: 'Boomark removed'}
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