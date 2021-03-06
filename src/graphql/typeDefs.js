const {gql} = require("apollo-server");

module.exports = gql`
  type Query {
      me: verifier!
      group(id: ID!): Group!
      groups(limit: Int,page: Int): [Group]!
      report(id: ID!): Report!
      reports(limit: Int,page: Int): [Report]!
      bookmarks(limit: Int,page: Int): Bookmarks!
      work(limit: Int,page: Int): [Report]!
      isbookmarked(id: ID!): bookResponse!
      overallStats(range: String): [statistics]!
      compareGroups(g1: String!,g2: String!): [compareStatistics]!
      stats: [statsData]!
      latest_stats: [statsData]!
  }
  type Mutation{ 
      login(data: LoginInput!): token
      newGroup(data: NewGroup!):Group!
      updateGroup(data: NewGroup!,id: ID!):Group!
      newReport(data: NewReport!): ReportCreated!
      updateReport(data: NewReport!,id: ID!): ReportCreated!
      bookReport(id: ID!): bookResponse!
      # removeBook(id: ID!): bookResponse!
  }
  type statistics{
    id: String!
    name: String!
    code: String!
    leader: String!
    createdAt: String
    updatedAt: String
    reports: Int!
  }
  type compareStatistics{
    d1: groupData!
    d2: groupData!
  }
  type statsData{
      year: Int!
      month: Int!
      numberOfReports: Int!
  }
  type groupData{
    group: Group!
    reports: [timeReports]
  }
  type timeReports{
    name: String!
    reportNumber: String!
  }
  input NewReport{
    timing: TimingInput!
    baseInfo: baseInfoInput!
    budget: budgetInput!
    interaction: interactionInput!
    touristActivity: touristActivityInput!
    health: healthInput!
  }

  type Bookmarks{
    user: Group
    bookmarks: [Report]
  }

  type bookResponse{
    success: Boolean!
    message: String!
  }

  type Report{
    _id: ID!
    reporter: Group
    timing: Timing!
    baseInfo: baseInfo!
    budget: budget!
    interaction: interaction!
    touristActivity: touristActivity!
    health: health!
  }
  type ReportCreated{
    _id: ID!
    reporter: String!
    timing: Timing!
    baseInfo: baseInfo!
    budget: budget!
    interaction: interaction!
    touristActivity: touristActivity!
    health: health!
  }


  input TimingInput{
    start: String!
    end: String!
    date: String!
  }

  input baseInfoInput{
    family: String!
    habituated: String!
    village: String!
    distance: String!
    location: String!
    individuals: Int!
    Oindividuals: Int!
  }
  input budgetInput{
    feeding: [String!]!
    distance: String!
    period: String!
  }
  input interactionInput{
    distance: String!
    reaction: [String]!
    observation: [String]!
    behaviour: [String]
  }

  input touristActivityInput{
    tourist: Int!
    period: String!
    behaviour: [String]
  }

  input healthInput{
    sick: Boolean!
    signs: [String]
  }
  
   type Timing{
    start: String!
    end: String!
    date: String!
  }

  type baseInfo{
    family: String!
    habituated: String!
    village: String!
    distance: String!
    location: String!
    individuals: Int!
    Oindividuals: Int!
  }
  type budget{
    feeding: [String!]!
    distance: String!
    period: String
  }
  type interaction{
    distance: String!
    reaction: [String]!
    observation: [String]!
    behaviour: [String]
  }

  type touristActivity{
    tourist: Int!
    period: String!
    behaviour: [String]
  }

  type health{
    sick: Boolean!
    signs: [String]
  }
  type token{
      success: Boolean!
      token: String
  }

  input LoginInput{
    password: String!
    code: String!

  }

  type Group{
    id: String!
    name: String!
    code: String!
    leader: String!
    createdAt: String
    updatedAt: String
  }
  input NewGroup{
    name: String!
    code: String!
    password: String!
    leader: String!
  }
  type verifier{
      success: Boolean!
      group: Group
  }
`