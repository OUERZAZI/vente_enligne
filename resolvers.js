//resolver.js 
const { ApolloError } = require('apollo-server');
const Produit = require('./produit');
const Client = require('./client');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { sendProduitMessage } = require('./ProduitProducer'); 
const { sendClientMessage } = require('./clientProducer'); 






const produitProtoPath = './produit.proto';
const clientProtoPath = './client.proto';




const produitProtoDefinition = protoLoader.loadSync(produitProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const clientProtoDefinition = protoLoader.loadSync(clientProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Obtenir les services gRPC
const produitProto = grpc.loadPackageDefinition(produitProtoDefinition).produit;
const clientProto = grpc.loadPackageDefinition(clientProtoDefinition).client;



const clientProduit = new produitProto.ProduitService(
  'localhost:50054',
  grpc.credentials.createInsecure()
);

const clientClient = new clientProto.ClientService(
  'localhost:50055',
  grpc.credentials.createInsecure()
);

const resolvers = {
  Query: {
    
    produit: async (_, { id }) => {
      try {
        return await Produit.findById(id); 
      } catch (error) {
        throw new ApolloError(`Erreur lors de la recherche du produit: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    
    produits: async () => {
      try {
        return await Produit.find(); 
      } catch (error) {
        throw new ApolloError(`Erreur lors de la recherche des produits: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    client: async (_, { id }) => {
      try {
        return await Client.findById(id); 
      } catch (error) {
        throw new ApolloError(`Erreur lors de la recherche du client: ${error.message}`, "INTERNAL_ERROR");
      }
    },
  
    clients: async () => {
      try {
        return await Client.find(); // Trouver tous les clients
      } catch (error) {
        throw new ApolloError(`Erreur lors de la recherche des clients: ${error.message}`, "INTERNAL_ERROR");
      }
    },
  },
  Mutation: {

    createClient: async (_, { nom, description }) => {
      try {
        const nouveauClient = new Client({ nom, description });
        const client = await nouveauClient.save(); // Sauvegarder le client
        
        // Envoyer un message Kafka pour l'événement de création de client
        await sendClientMessage('creation', { id: client._id, nom, description });
  
        return client; // Retourner le client créé
      } catch (error) {
        throw new ApolloError(`Erreur lors de la création du client: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    
    deleteClient: async (_, { id }) => {
      try {
        const client = await Client.findByIdAndDelete(id); // Supprimer par ID
        if (!client) {
          throw new ApolloError("Client non trouvé", "NOT_FOUND");
        }
    
        // Envoyer un message Kafka pour l'événement de suppression de client
        await sendClientMessage('suppression', { id });
    
        return "Client supprimé avec succès";
      } catch (error) {
        throw new ApolloError(`Erreur lors de la suppression du client: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    
    updateClient: async (_, { id, nom, description }) => {
      try {
        const client = await Client.findByIdAndUpdate(
          id,
          { nom, description },
          { new: true } // Retourner le client mis à jour
        );
        
        if (!client) {
          throw new ApolloError("Client non trouvé", "NOT_FOUND");
        }
    
        // Envoyer un message Kafka pour l'événement de modification de client
        await sendClientMessage('modification', { id: client._id, nom, description });
    
        return client; // Client mis à jour
      } catch (error) {
        throw new ApolloError(`Erreur lors de la mise à jour du client: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    createProduit: async (_, { nom, description }) => {
      try {
        const nouveauProduit = new Produit({ nom, description });
        const produit = await nouveauProduit.save(); // Sauvegarder le client
        
        // Envoyer un message Kafka pour l'événement de création de client
        await sendProduitMessage('creation', { id: produit._id, nom, description });
  
        return produit; // Retourner le client créé
      } catch (error) {
        throw new ApolloError(`Erreur lors de la création du produit: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    deleteProduit: async (_, { id }) => {
      try {
        const produit = await Produit.findByIdAndDelete(id); // Supprimer par ID
        if (!produit) {
          throw new ApolloError("Produit non trouvé", "NOT_FOUND");
        }
    
        // Envoyer un message Kafka pour l'événement de suppression de client
        await sendProduitMessage('suppression', { id });
    
        return "Produit supprimé avec succès";
      } catch (error) {
        throw new ApolloError(`Erreur lors de la suppression du Produit: ${error.message}`, "INTERNAL_ERROR");
      }
    },
    updateProduit: async (_, { id, nom, description }) => {
      try {
        const produit = await Produit.findByIdAndUpdate(
          id,
          { nom, description },
          { new: true } // Retourner le client mis à jour
        );
        
        if (!produit) {
          throw new ApolloError("Produit non trouvé", "NOT_FOUND");
        }
    
        // Envoyer un message Kafka pour l'événement de modification de client
        await sendProduitMessage('modification', { id: produit._id, nom, description });
    
        return produit; // produit mis à jour
      } catch (error) {
        throw new ApolloError(`Erreur lors de la mise à jour du produit: ${error.message}`, "INTERNAL_ERROR");
      }
    },
  },
};

module.exports = resolvers;
