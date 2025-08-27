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

export default ApiClient;