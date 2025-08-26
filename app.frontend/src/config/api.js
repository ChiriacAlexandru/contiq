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

export default ApiClient;