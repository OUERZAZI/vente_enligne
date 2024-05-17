const Client = require('./client'); // Modèle du client

// Créer un nouveau client
const createClient = async (nom, description) => {
  const nouveauClient = new Client({ nom, description });
  return await nouveauClient.save(); // Sauvegarde dans la base de données
};

// Obtenir tous les clients
const getClients = async () => {
  return await Client.find(); // Obtenir tous les clients
};

// Obtenir un client par ID
const getClientById = async (id) => {
  return await Client.findById(id); // Trouver un client par son ID
};

// Exporter les services
module.exports = {
  createClient,
  getClients,
  getClientById,
};
