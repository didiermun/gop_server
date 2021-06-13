const {gql} = require("apollo-server");

module.exports = gql`
  type Query {
    #   patrouilles: [Patrouille]
    #   codes:[coded]
    #   code: coded
      me: verifier!
      group(id: ID!): Group!
      groups: [Group]
    #   records(patrouille_id: ID!): [Record]
    #   patrouille(id: ID!): PatrouillePopulated
  }
  type Mutation{ 
    #   newPatrouille(patrouille: NewPatrouille!): Patrouille
    #   newRecord(record: NewRecord!): Record
    #   newCode(code: NewCode!): coded
    #   deleteCode(id: ID!): coded
    #   deletePatrouille(id: ID!): Patrouille
    #   deleteRecord(id: ID!): Record
      login(code: String!): token
      newGroup(data: newGroup!):Group!
      updateGroup(data: newGroup!,id: ID!):Group!
      
  }
  type token{
      success: Boolean!
      token: String
  }

  type Group{
    id: String!
    name: String!
    code: String!
    password: String!
    createdAt: String
    updatedAt: String
  }
  input newGroup{
    name: String!
    code: String!
    password: String!
  }
  type Patrouille{ 
      id: String!
      date: String!
      type: String!
      sector: Int!
      family: String!
      path: String!
      composition: String!
      nTeamMembers: Int!
      names: [String!]!
      teamLeader: String!
      gpsNO: Int!
      feuilleNO: Int!

  }
  type PatrouillePopulated{ 
      patrouille: Patrouille!
      records: [Record]!
  }
  type Record{ 
      id: String!
      p_id: String!
      time: String!
      wpt: Int!
      easting: Float!
      northing: Float!
      observation: String!
      otype: String!
      number: Int!
      sitename: String!
      remarks: [String!]!
  }
  input NewCode{
      code: String!
      level: String
  }
  type verifier{
      success: Boolean!
      code: baseCode
  }

  type baseCode{
    code: String
    level: String
  }
  type coded{
      _id: ID
      code: String!
      level: String!
      createdAt: String
      updatedAt: String
  }
  input NewRecord{ 
      p_id: String!
      time: String!
      wpt: Int!
      easting: Float!
      northing: Float!
      observation: String!
      otype: String!
      number: Int!
      sitename: String!
      remarks: [String!]!
  }
  input NewPatrouille{
      date: String!
      type: String!
      sector: Int!
      family: String!
      path: String!
      composition: String!
      nTeamMembers: Int!
      names: [String!]!
      teamLeader: String!
      gpsNO: Int!
      feuilleNO: Int!
  }
`