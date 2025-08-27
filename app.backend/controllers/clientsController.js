const Client = require('../models/Client');
const { validationResult } = require('express-validator');

class ClientsController {
  // Get all clients with filtering and pagination
  static async getClients(req, res) {
    try {
      const filters = {
        search: req.query.search || '',
        tip_client: req.query.tip_client || '',
        status: req.query.status || '',
        oras: req.query.oras || '',
        judet: req.query.judet || '',
        categorie: req.query.categorie || '',
        agent_vanzari: req.query.agent_vanzari || '',
        sortBy: req.query.sortBy || 'nume',
        sortOrder: req.query.sortOrder || 'asc',
        limit: parseInt(req.query.limit) || 50,
        offset: parseInt(req.query.offset) || 0
      };

      const result = await Client.getAll(filters);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error fetching clients:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la încărcarea clienților'
      });
    }
  }

  // Get single client by ID
  static async getClient(req, res) {
    try {
      const clientId = req.params.id;
      const client = await Client.getById(clientId);

      if (!client) {
        return res.status(404).json({
          success: false,
          error: 'Clientul nu a fost găsit'
        });
      }

      res.json({
        success: true,
        data: client
      });
    } catch (error) {
      console.error('Error fetching client:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la încărcarea clientului'
      });
    }
  }

  // Create new client
  static async createClient(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.error('Client create validation errors:', errors.array());
        return res.status(400).json({
          success: false,
          error: 'Date invalide',
          details: errors.array(),
          code: 'VALIDATION_ERROR'
        });
      }

      // Check for duplicate email
      if (req.body.email) {
        const existingClientByEmail = await Client.getByEmail(req.body.email);
        if (existingClientByEmail) {
          return res.status(400).json({
            success: false,
            error: 'Un client cu această adresă de email există deja'
          });
        }
      }

      // Check for duplicate CUI (for companies)
      if (req.body.cui) {
        const existingClientByCUI = await Client.getByCUI(req.body.cui);
        if (existingClientByCUI) {
          return res.status(400).json({
            success: false,
            error: 'Un client cu acest CUI există deja'
          });
        }
      }

      // Check for duplicate CNP (for individuals)
      if (req.body.cnp) {
        const existingClientByCNP = await Client.getByCNP(req.body.cnp);
        if (existingClientByCNP) {
          return res.status(400).json({
            success: false,
            error: 'Un client cu acest CNP există deja'
          });
        }
      }

      const client = await Client.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Clientul a fost creat cu succes',
        data: client
      });
    } catch (error) {
      console.error('Error creating client:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la crearea clientului'
      });
    }
  }

  // Update client
  static async updateClient(req, res) {
    try {
      console.log('Client update request body:', JSON.stringify(req.body, null, 2));
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.error('Client update validation errors:', errors.array());
        return res.status(400).json({
          success: false,
          error: 'Date invalide',
          details: errors.array(),
          code: 'VALIDATION_ERROR'
        });
      }

      const clientId = req.params.id;

      // Check if client exists
      const existingClient = await Client.getById(clientId);
      if (!existingClient) {
        return res.status(404).json({
          success: false,
          error: 'Clientul nu a fost găsit'
        });
      }

      // Check for duplicate email (excluding current client)
      if (req.body.email && req.body.email !== existingClient.email) {
        const clientWithSameEmail = await Client.getByEmail(req.body.email);
        if (clientWithSameEmail) {
          return res.status(400).json({
            success: false,
            error: 'Un client cu această adresă de email există deja'
          });
        }
      }

      // Check for duplicate CUI (excluding current client)
      if (req.body.cui && req.body.cui !== existingClient.cui) {
        const clientWithSameCUI = await Client.getByCUI(req.body.cui);
        if (clientWithSameCUI) {
          return res.status(400).json({
            success: false,
            error: 'Un client cu acest CUI există deja'
          });
        }
      }

      // Check for duplicate CNP (excluding current client)
      if (req.body.cnp && req.body.cnp !== existingClient.cnp) {
        const clientWithSameCNP = await Client.getByCNP(req.body.cnp);
        if (clientWithSameCNP) {
          return res.status(400).json({
            success: false,
            error: 'Un client cu acest CNP există deja'
          });
        }
      }

      const updatedClient = await Client.update(clientId, req.body);

      res.json({
        success: true,
        message: 'Clientul a fost actualizat cu succes',
        data: updatedClient
      });
    } catch (error) {
      console.error('Error updating client:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la actualizarea clientului'
      });
    }
  }

  // Delete client
  static async deleteClient(req, res) {
    try {
      const clientId = req.params.id;

      // Check if client exists
      const existingClient = await Client.getById(clientId);
      if (!existingClient) {
        return res.status(404).json({
          success: false,
          error: 'Clientul nu a fost găsit'
        });
      }

      await Client.delete(clientId);

      res.json({
        success: true,
        message: 'Clientul a fost șters cu succes'
      });
    } catch (error) {
      console.error('Error deleting client:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la ștergerea clientului'
      });
    }
  }

  // Get client statistics
  static async getStatistics(req, res) {
    try {
      const statistics = await Client.getStatistics();
      
      res.json({
        success: true,
        data: statistics
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la încărcarea statisticilor'
      });
    }
  }

  // Get related data for dropdowns
  static async getRelatedData(req, res) {
    try {
      const relatedData = await Client.getRelatedData();
      
      res.json({
        success: true,
        data: relatedData
      });
    } catch (error) {
      console.error('Error fetching related data:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la încărcarea datelor asociate'
      });
    }
  }

  // Bulk update client status
  static async bulkUpdateStatus(req, res) {
    try {
      const { clientIds, status } = req.body;

      if (!clientIds || !Array.isArray(clientIds) || clientIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Lista de ID-uri de clienți este necesară'
        });
      }

      if (!status || !['activ', 'inactiv', 'suspendat'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Status invalid'
        });
      }

      const updatedClients = await Client.bulkUpdateStatus(clientIds, status);

      res.json({
        success: true,
        message: `${updatedClients.length} clienți au fost actualizați cu succes`,
        data: updatedClients
      });
    } catch (error) {
      console.error('Error bulk updating clients:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la actualizarea clienților'
      });
    }
  }
}

module.exports = ClientsController;