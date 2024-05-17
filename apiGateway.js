const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('grpc');
const produitProto = require('./produit_pb');
const produitService = require('./produit_grpc_pb');
const clientProto = require('./client_pb');
const clientService = require('./client_grpc_pb');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Connexion aux services gRPC
const produitClient = new produitService.ProduitServiceClient('localhost:50054', grpc.credentials.createInsecure());
const clientClient = new clientService.ClientServiceClient('localhost:50055', grpc.credentials.createInsecure());

// Endpoints pour les produits
app.get('/produit', (req, res) => {
  const request = new produitProto.GetProduitsRequest();
  produitClient.getProduits(request, (err, response) => {
    if (err) {
      return res.status(500).send("Erreur lors de la recherche des produits: " + err.message);
    }
    res.json(response.toObject());
  });
});

app.get('/produit/:id', (req, res) => {
  const request = new produitProto.GetProduitByIdRequest();
  request.setId(req.params.id);
  produitClient.getProduitById(request, (err, response) => {
    if (err) {
      return res.status(500).send("Erreur lors de la recherche du produit: " + err.message);
    }
    res.json(response.toObject());
  });
});

app.post('/produit', (req, res) => {
  const { nom, description } = req.body;
  const request = new produitProto.CreateProduitRequest();
  request.setNom(nom);
  request.setDescription(description);
  produitClient.createProduit(request, (err, response) => {
    if (err) {
      return res.status(500).send("Erreur lors de la création du produit: " + err.message);
    }
    res.json(response.toObject());
  });
});

app.delete('/produit/:id', (req, res) => {
  const request = new produitProto.DeleteProduitRequest();
  request.setId(req.params.id);
  produitClient.deleteProduit(request, (err, response) => {
    if (err) {
      return res.status(500).send("Erreur lors de la suppression du produit: " + err.message);
    }
    res.json({ message: "Produit supprimé avec succès" });
  });
});

app.put('/produit/:id', (req, res) => {
  const { nom, description } = req.body;
  const request = new produitProto.UpdateProduitRequest();
  request.setId(req.params.id);
  request.setNom(nom);
  request.setDescription(description);
  produitClient.updateProduit(request, (err, response) => {
    if (err) {
      return res.status(500).send("Erreur lors de la mise à jour du produit: " + err.message);
    }
    res.json(response.toObject());
  });
});

// Endpoints pour les clients
app.get('/client', (req, res) => {
  const request = new clientProto.GetClientsRequest();
  clientClient.getClients(request, (err, response) => {
    if (err) {
      return res.status(500).send("Erreur lors de la recherche des clients: " + err.message);
    }
    res.json(response.toObject());
  });
});

app.get('/client/:id', (req, res) => {
  const request = new clientProto.GetClientByIdRequest();
  request.setId(req.params.id);
  clientClient.getClientById(request, (err, response) => {
    if (err) {
      return res.status(500).send("Erreur lors de la recherche du client: " + err.message);
    }
    res.json(response.toObject());
  });
});

app.post('/client', (req, res) => {
  const { nom, description } = req.body;
  const request = new clientProto.CreateClientRequest();
  request.setNom(nom);
  request.setDescription(description);
  clientClient.createClient(request, (err, response) => {
    if (err) {
      return res.status(500).send("Erreur lors de la création du client: " + err.message);
    }
    res.json(response.toObject());
  });
});

app.delete('/client/:id', (req, res) => {
  const request = new clientProto.DeleteClientRequest();
  request.setId(req.params.id);
  clientClient.deleteClient(request, (err, response) => {
    if (err) {
      return res.status(500).send("Erreur lors de la suppression du client: " + err.message);
    }
    res.json({ message: "Client supprimé avec succès" });
  });
});

app.put('/client/:id', (req, res) => {
  const { nom, description } = req.body;
  const request = new clientProto.UpdateClientRequest();
  request.setId(req.params.id);
  request.setNom(nom);
  request.setDescription(description);
  clientClient.updateClient(request, (err, response) => {
    if (err) {
      return res.status(500).send("Erreur lors de la mise à jour du client: " + err.message);
    }
    res.json(response.toObject());
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway opérationnel sur le port ${port}`);
});
