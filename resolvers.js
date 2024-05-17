const { ApolloError } = require('apollo-server');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load Protobuf definitions for client and produit services
const clientProtoPath = './client.proto';
const produitProtoPath = './produit.proto';

const clientProtoDefinition = protoLoader.loadSync(clientProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const produitProtoDefinition = protoLoader.loadSync(produitProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const clientProto = grpc.loadPackageDefinition(clientProtoDefinition).client;
const produitProto = grpc.loadPackageDefinition(produitProtoDefinition).produit;

// Initialize gRPC client connections
const clientClient = new clientProto.ClientService('localhost:50057', grpc.credentials.createInsecure());
const produitClient = new produitProto.ProduitService('localhost:50054', grpc.credentials.createInsecure());

const resolvers = {
  Query: {
    produit: async (_, { id }) => {
      try {
        const response = await new Promise((resolve, reject) => {
          produitClient.getProduit({ produit_id: id }, (err, res) => {
            if (err) {
              reject(new ApolloError('Error fetching produit from microservice'));
            } else {
              resolve(res.produit);
            }
          });
        });
        return response;
      } catch (error) {
        throw new ApolloError(`Error fetching produit: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    produits: async () => {
      try {
        const response = await new Promise((resolve, reject) => {
          produitClient.searchProduits({}, (err, res) => {
            if (err) {
              reject(new ApolloError('Error searching produits from microservice'));
            } else {
              resolve(res.produits);
            }
          });
        });
        return response;
      } catch (error) {
        throw new ApolloError(`Error searching produits: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    client: async (_, { id }) => {
      try {
        const response = await new Promise((resolve, reject) => {
          clientClient.getClient({ client_id: id }, (err, res) => {
            if (err) {
              reject(new ApolloError('Error fetching client from microservice'));
            } else {
              resolve(res.client);
            }
          });
        });
        return response;
      } catch (error) {
        throw new ApolloError(`Error fetching client: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    clients: async () => {
      try {
        const response = await new Promise((resolve, reject) => {
          clientClient.searchClients({}, (err, res) => {
            if (err) {
              reject(new ApolloError('Error searching clients from microservice'));
            } else {
              resolve(res.clients);
            }
          });
        });
        return response;
      } catch (error) {
        throw new ApolloError(`Error searching clients: ${error.message}`, "INTERNAL_ERROR");
      }
    },
  },
  Mutation: {
    createClient: async (_, { nom, description }) => {
      try {
        const response = await new Promise((resolve, reject) => {
          clientClient.createClient({ nom, description }, (err, res) => {
            if (err) {
              reject(new ApolloError('Error creating client via microservice'));
            } else {
              resolve(res.client);
            }
          });
        });
        return response;
      } catch (error) {
        throw new ApolloError(`Error creating client: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    deleteClient: async (_, { id }) => {
      try {
        await new Promise((resolve, reject) => {
          clientClient.deleteClient({ client_id: id }, (err, res) => {
            if (err) {
              reject(new ApolloError('Error deleting client via microservice'));
            } else {
              resolve();
            }
          });
        });
        return "Client deleted successfully";
      } catch (error) {
        throw new ApolloError(`Error deleting client: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    updateClient: async (_, { id, nom, description }) => {
      try {
        const response = await new Promise((resolve, reject) => {
          clientClient.updateClient({ client_id: id, nom, description }, (err, res) => {
            if (err) {
              reject(new ApolloError('Error updating client via microservice'));
            } else {
              resolve(res.client);
            }
          });
        });
        return response;
      } catch (error) {
        throw new ApolloError(`Error updating client: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    createProduit: async (_, { nom, description }) => {
      try {
        const response = await new Promise((resolve, reject) => {
          produitClient.createProduit({ nom, description }, (err, res) => {
            if (err) {
              reject(new ApolloError('Error creating produit via microservice'));
            } else {
              resolve(res.produit);
            }
          });
        });
        return response;
      } catch (error) {
        throw new ApolloError(`Error creating produit: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    deleteProduit: async (_, { id }) => {
      try {
        await new Promise((resolve, reject) => {
          produitClient.deleteProduit({ produit_id: id }, (err, res) => {
            if (err) {
              reject(new ApolloError('Error deleting produit via microservice'));
            } else {
              resolve();
            }
          });
        });
        return "Produit deleted successfully";
      } catch (error) {
        throw new ApolloError(`Error deleting produit: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    updateProduit: async (_, { id, nom, description }) => {
      try {
        const response = await new Promise((resolve, reject) => {
          produitClient.updateProduit({ produit_id: id, nom, description }, (err, res) => {
            if (err) {
              reject(new ApolloError('Error updating produit via microservice'));
            } else {
              resolve(res.produit);
            }
          });
        });
        return response;
      } catch (error) {
        throw new ApolloError(`Error updating produit: ${error.message}`, "INTERNAL_ERROR");
      }
    },
  },
};

module.exports = resolvers;
