// API Configuration for ContIQ Frontend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  
  // User Profile
  PROFILE: `${API_BASE_URL}/api/profile`,
  UPDATE_USER_DETAILS: `${API_BASE_URL}/api/profile/details`,
  UPDATE_COMPANY_DATA: `${API_BASE_URL}/api/profile/company`,
  
  // Admin
  ADMIN_USERS: `${API_BASE_URL}/api/admin/users`,
  ADMIN_ACTIVATE_USER: (userId) => `${API_BASE_URL}/api/admin/users/${userId}/activate`,
  
  // Products
  PRODUCTS: `${API_BASE_URL}/api/products`,
  PRODUCTS_STATISTICS: `${API_BASE_URL}/api/products/statistics`,
  PRODUCTS_RELATED_DATA: `${API_BASE_URL}/api/products/related-data`,
  PRODUCTS_BULK_STATUS: `${API_BASE_URL}/api/products/bulk-status`,
  PRODUCT_BY_ID: (id) => `${API_BASE_URL}/api/products/${id}`,
  
  // Categories
  CATEGORIES: `${API_BASE_URL}/api/categories`,
  CATEGORIES_PARENT: `${API_BASE_URL}/api/categories/parent`,
  CATEGORY_BY_ID: (id) => `${API_BASE_URL}/api/categories/${id}`,
  
  // Brands
  BRANDS: `${API_BASE_URL}/api/brands`,
  BRANDS_ACTIVE: `${API_BASE_URL}/api/brands/active`,
  BRAND_BY_ID: (id) => `${API_BASE_URL}/api/brands/${id}`,
  
  // Suppliers
  SUPPLIERS: `${API_BASE_URL}/api/suppliers`,
  SUPPLIERS_ACTIVE: `${API_BASE_URL}/api/suppliers/active`,
  SUPPLIER_BY_ID: (id) => `${API_BASE_URL}/api/suppliers/${id}`,
  
  // Clients
  CLIENTS: `${API_BASE_URL}/api/clients`,
  CLIENTS_STATISTICS: `${API_BASE_URL}/api/clients/statistics`,
  CLIENTS_RELATED_DATA: `${API_BASE_URL}/api/clients/related-data`,
  CLIENTS_BULK_STATUS: `${API_BASE_URL}/api/clients/bulk-status`,
  CLIENT_BY_ID: (id) => `${API_BASE_URL}/api/clients/${id}`,
  
  // Documents
  DOCUMENTS: `${API_BASE_URL}/api/documents`,
  DOCUMENTS_STATISTICS: `${API_BASE_URL}/api/documents/statistics`,
  DOCUMENTS_RELATED_DATA: `${API_BASE_URL}/api/documents/related-data`,
  DOCUMENTS_NEXT_NUMBER: `${API_BASE_URL}/api/documents/next-number`,
  DOCUMENTS_BULK_STATUS: `${API_BASE_URL}/api/documents/bulk-status`,
  DOCUMENT_BY_ID: (id) => `${API_BASE_URL}/api/documents/${id}`,
  DOCUMENT_DUPLICATE: (id) => `${API_BASE_URL}/api/documents/${id}/duplicate`,
  DOCUMENT_STATUS: (id) => `${API_BASE_URL}/api/documents/${id}/status`,
  DOCUMENT_PAYMENT_STATUS: (id) => `${API_BASE_URL}/api/documents/${id}/payment-status`,
  DOCUMENTS_BY_CLIENT: (clientId) => `${API_BASE_URL}/api/documents/client/${clientId}`,
  
  // Document Files
  DOCUMENT_FILES: `${API_BASE_URL}/api/document-files`,
  DOCUMENT_FILES_UPLOAD: `${API_BASE_URL}/api/document-files/upload`,
  DOCUMENT_FILE_BY_ID: (id) => `${API_BASE_URL}/api/document-files/${id}`,
  DOCUMENT_FILE_DOWNLOAD_URL: (id) => `${API_BASE_URL}/api/document-files/${id}/download-url`,
};

// HTTP Client with authentication
export class ApiClient {
  static getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  static async request(url, options = {}) {
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Log detailed validation errors
        if (data.code === 'VALIDATION_ERROR' && data.details) {
          console.error('Validation errors:', data.details);
          const errorMessages = data.details.map(detail => `${detail.field}: ${detail.message}`).join(', ');
          throw new Error(`Validation failed: ${errorMessages}`);
        }
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  static async get(url) {
    return this.request(url, { method: 'GET' });
  }

  static async post(url, body) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  static async put(url, body) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  static async delete(url) {
    return this.request(url, { method: 'DELETE' });
  }
}

// Authentication helpers
export const AuthService = {
  login: async (email, password) => {
    const response = await ApiClient.post(API_ENDPOINTS.LOGIN, { email, password });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  register: async (userData) => {
    const response = await ApiClient.post(API_ENDPOINTS.REGISTER, userData);
    
    // Don't auto-login after registration since account needs activation
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  isActivated: () => {
    const user = AuthService.getCurrentUser();
    return user ? user.activated : false;
  }
};

// User Profile Service
export const UserService = {
  getProfile: async () => {
    return ApiClient.get(API_ENDPOINTS.PROFILE);
  },

  updateUserDetails: async (details) => {
    return ApiClient.put(API_ENDPOINTS.UPDATE_USER_DETAILS, details);
  },

  updateCompanyData: async (companyData) => {
    return ApiClient.put(API_ENDPOINTS.UPDATE_COMPANY_DATA, companyData);
  }
};

// Products Service
export const ProductsService = {
  getProducts: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    const url = `${API_ENDPOINTS.PRODUCTS}?${params.toString()}`;
    const response = await ApiClient.get(url);
    return response.data;
  },

  getProduct: async (id) => {
    const response = await ApiClient.get(API_ENDPOINTS.PRODUCT_BY_ID(id));
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await ApiClient.post(API_ENDPOINTS.PRODUCTS, productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await ApiClient.put(API_ENDPOINTS.PRODUCT_BY_ID(id), productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await ApiClient.delete(API_ENDPOINTS.PRODUCT_BY_ID(id));
    return response.data;
  },

  getStatistics: async () => {
    const response = await ApiClient.get(API_ENDPOINTS.PRODUCTS_STATISTICS);
    return response.data;
  },

  getRelatedData: async () => {
    const response = await ApiClient.get(API_ENDPOINTS.PRODUCTS_RELATED_DATA);
    return response.data;
  },

  bulkUpdateStatus: async (productIds, status) => {
    const response = await ApiClient.post(API_ENDPOINTS.PRODUCTS_BULK_STATUS, {
      productIds,
      status
    });
    return response.data;
  }
};

// Categories Service
export const CategoriesService = {
  getCategories: async () => {
    const response = await ApiClient.get(API_ENDPOINTS.CATEGORIES);
    return response.data;
  },

  getCategory: async (id) => {
    const response = await ApiClient.get(API_ENDPOINTS.CATEGORY_BY_ID(id));
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await ApiClient.post(API_ENDPOINTS.CATEGORIES, categoryData);
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await ApiClient.put(API_ENDPOINTS.CATEGORY_BY_ID(id), categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await ApiClient.delete(API_ENDPOINTS.CATEGORY_BY_ID(id));
    return response.data;
  },

  getParentCategories: async () => {
    const response = await ApiClient.get(API_ENDPOINTS.CATEGORIES_PARENT);
    return response.data;
  }
};

// Brands Service
export const BrandsService = {
  getBrands: async () => {
    const response = await ApiClient.get(API_ENDPOINTS.BRANDS);
    return response.data;
  },

  getBrand: async (id) => {
    const response = await ApiClient.get(API_ENDPOINTS.BRAND_BY_ID(id));
    return response.data;
  },

  createBrand: async (brandData) => {
    const response = await ApiClient.post(API_ENDPOINTS.BRANDS, brandData);
    return response.data;
  },

  updateBrand: async (id, brandData) => {
    const response = await ApiClient.put(API_ENDPOINTS.BRAND_BY_ID(id), brandData);
    return response.data;
  },

  deleteBrand: async (id) => {
    const response = await ApiClient.delete(API_ENDPOINTS.BRAND_BY_ID(id));
    return response.data;
  },

  getActiveBrands: async () => {
    const response = await ApiClient.get(API_ENDPOINTS.BRANDS_ACTIVE);
    return response.data;
  }
};

// Suppliers Service
export const SuppliersService = {
  getSuppliers: async () => {
    const response = await ApiClient.get(API_ENDPOINTS.SUPPLIERS);
    return response.data;
  },

  getSupplier: async (id) => {
    const response = await ApiClient.get(API_ENDPOINTS.SUPPLIER_BY_ID(id));
    return response.data;
  },

  createSupplier: async (supplierData) => {
    const response = await ApiClient.post(API_ENDPOINTS.SUPPLIERS, supplierData);
    return response.data;
  },

  updateSupplier: async (id, supplierData) => {
    const response = await ApiClient.put(API_ENDPOINTS.SUPPLIER_BY_ID(id), supplierData);
    return response.data;
  },

  deleteSupplier: async (id) => {
    const response = await ApiClient.delete(API_ENDPOINTS.SUPPLIER_BY_ID(id));
    return response.data;
  },

  getActiveSuppliers: async () => {
    const response = await ApiClient.get(API_ENDPOINTS.SUPPLIERS_ACTIVE);
    return response.data;
  }
};

// Clients Service
export const ClientsService = {
  getClients: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    const url = `${API_ENDPOINTS.CLIENTS}?${params.toString()}`;
    const response = await ApiClient.get(url);
    return response.data;
  },

  getClient: async (id) => {
    const response = await ApiClient.get(API_ENDPOINTS.CLIENT_BY_ID(id));
    return response.data;
  },

  createClient: async (clientData) => {
    const response = await ApiClient.post(API_ENDPOINTS.CLIENTS, clientData);
    return response.data;
  },

  updateClient: async (id, clientData) => {
    const response = await ApiClient.put(API_ENDPOINTS.CLIENT_BY_ID(id), clientData);
    return response.data;
  },

  deleteClient: async (id) => {
    const response = await ApiClient.delete(API_ENDPOINTS.CLIENT_BY_ID(id));
    return response.data;
  },

  getStatistics: async () => {
    const response = await ApiClient.get(API_ENDPOINTS.CLIENTS_STATISTICS);
    return response.data;
  },

  getRelatedData: async () => {
    const response = await ApiClient.get(API_ENDPOINTS.CLIENTS_RELATED_DATA);
    return response.data;
  },

  bulkUpdateStatus: async (clientIds, status) => {
    const response = await ApiClient.post(API_ENDPOINTS.CLIENTS_BULK_STATUS, {
      clientIds,
      status
    });
    return response.data;
  }
};

// Documents Service
export const DocumentsService = {
  getDocuments: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    const url = `${API_ENDPOINTS.DOCUMENTS}?${params.toString()}`;
    const response = await ApiClient.get(url);
    return response.data;
  },

  getDocument: async (id) => {
    const response = await ApiClient.get(API_ENDPOINTS.DOCUMENT_BY_ID(id));
    return response.data;
  },

  createDocument: async (documentData) => {
    const response = await ApiClient.post(API_ENDPOINTS.DOCUMENTS, documentData);
    return response.data;
  },

  updateDocument: async (id, documentData) => {
    const response = await ApiClient.put(API_ENDPOINTS.DOCUMENT_BY_ID(id), documentData);
    return response.data;
  },

  deleteDocument: async (id) => {
    const response = await ApiClient.delete(API_ENDPOINTS.DOCUMENT_BY_ID(id));
    return response.data;
  },

  duplicateDocument: async (id) => {
    const response = await ApiClient.post(API_ENDPOINTS.DOCUMENT_DUPLICATE(id));
    return response.data;
  },

  updateDocumentStatus: async (id, status) => {
    const response = await ApiClient.put(API_ENDPOINTS.DOCUMENT_STATUS(id), { status });
    return response.data;
  },

  updatePaymentStatus: async (id, status_plata, suma_platita = null) => {
    const response = await ApiClient.put(API_ENDPOINTS.DOCUMENT_PAYMENT_STATUS(id), { 
      status_plata, 
      suma_platita 
    });
    return response.data;
  },

  getNextDocumentNumber: async (tip_document, serie_document = '') => {
    const params = new URLSearchParams({ tip_document });
    if (serie_document) {
      params.append('serie_document', serie_document);
    }
    const url = `${API_ENDPOINTS.DOCUMENTS_NEXT_NUMBER}?${params.toString()}`;
    const response = await ApiClient.get(url);
    return response.data;
  },

  getStatistics: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    const url = `${API_ENDPOINTS.DOCUMENTS_STATISTICS}?${params.toString()}`;
    const response = await ApiClient.get(url);
    return response.data;
  },

  getRelatedData: async () => {
    const response = await ApiClient.get(API_ENDPOINTS.DOCUMENTS_RELATED_DATA);
    return response.data;
  },

  bulkUpdateStatus: async (documentIds, status) => {
    const response = await ApiClient.post(API_ENDPOINTS.DOCUMENTS_BULK_STATUS, {
      documentIds,
      status
    });
    return response.data;
  },

  getDocumentsByClient: async (clientId, tip_document = '', limit = 20) => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (tip_document) {
      params.append('tip_document', tip_document);
    }
    const url = `${API_ENDPOINTS.DOCUMENTS_BY_CLIENT(clientId)}?${params.toString()}`;
    const response = await ApiClient.get(url);
    return response.data;
  }
};

export default ApiClient;

// Document Files Service (multipart uploads)
export const DocumentFilesService = {
  list: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
    });
    const url = `${API_ENDPOINTS.DOCUMENT_FILES}?${query.toString()}`;
    return ApiClient.get(url).then(r => r.data);
  },

  upload: async (files, meta = {}) => {
    const token = localStorage.getItem('token');
    const form = new FormData();
    Array.from(files).forEach(f => form.append('files', f));
    Object.entries(meta).forEach(([k, v]) => {
      if (v !== undefined && v !== null) form.append(k, v);
    });

    const resp = await fetch(API_ENDPOINTS.DOCUMENT_FILES_UPLOAD, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || 'Upload failed');
    return data.data;
  },

  getDownloadUrl: async (id) => {
    const resp = await ApiClient.get(API_ENDPOINTS.DOCUMENT_FILE_DOWNLOAD_URL(id));
    return resp.data.url;
  },

  update: async (id, data) => {
    const resp = await ApiClient.put(API_ENDPOINTS.DOCUMENT_FILE_BY_ID(id), data);
    return resp.data;
  },

  remove: async (id) => {
    const resp = await ApiClient.delete(API_ENDPOINTS.DOCUMENT_FILE_BY_ID(id));
    return resp.data;
  }
};