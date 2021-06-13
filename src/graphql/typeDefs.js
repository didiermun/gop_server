const {gql} = require("apollo-server");

module.exports = gql`
  type Query {
      me: verifier!
      group(id: ID!): Group!
      groups: [Group]!
      report: Report!
      reports: ReportSample!
  }
  type Mutation{ 
      login(code: String!): token
      newGroup(data: NewGroup!):Group!
      updateGroup(data: NewGroup!,id: ID!):Group!
      newReport(data: NewReport!): Report!
      updateReport(data: NewReport!,id: ID!): Report!
      
  }

  input NewReport{
    timing: TimingInput!
    baseInfo: baseInfoInput!
    budget: budgetInput!
    interaction: interactionInput!
    touristActivity: touristActivityInput!
    health: healthInput!
  }

  type Report{
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

  type ReportSample{
    id: String
    group: Group!
    date: String!
    start: String!
    end: String!
    family: String!
    individuals: Int!
    Oindividuals: Int!
    sick: Boolean!
    reaction: [String]
  }
  type Group{
    id: String!
    name: String!
    code: String!
    password: String!
    createdAt: String
    updatedAt: String
  }
  input NewGroup{
    name: String!
    code: String!
    password: String!
  }
  type verifier{
      success: Boolean!
      group: Group
  }
`