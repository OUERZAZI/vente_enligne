const { gql } = require('@apollo/server');

const typeDefs = `#graphql

  type Produit {
    id: String!
    nom: String!
    description: String!
  }
  type Client {
  id: String!
  nom: String!
  description: String!
}


  type Query {
    produit(id: String!): Produit
    produits: [Produit]
    client(id: String!): Client
    clients: [Client]
  }
  type Mutation {
 
  createProduit(nom: String!, description: String!): Produit
  deleteProduit(id: String!): String
  updateProduit(id: String!, nom: String!, description: String!): Produit
  createClient(nom: String!,  description:String!): Client
  deleteClient(id: String!): String
  updateClient(id: String!, nom: String!,  description: String!): Client
}

`;

module.exports = typeDefs;
