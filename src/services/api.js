/**
 * Base API configuration and helper functions
 */
import env from '../config/env';

// API base URL from environment config
const API_URL = env.API_URL;

/**
 * Get authentication token from localStorage
 * @returns {string|null} The JWT token or null if not found
 */
const getToken = () => {
  const user = localStorage.getItem('currentUser');
  if (user) {
    const parsedUser = JSON.parse(user);
    return parsedUser.token;
  }
  return null;
};

/**
 * Default headers for API requests
 * @param {boolean} includeAuth - Whether to include Authorization header
 * @returns {Object} Headers object
 */
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

/**
 * Generic API request function
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {Object} data - Request body
 * @param {boolean} includeAuth - Whether to include auth token
 * @returns {Promise} Response promise
 */
const apiRequest = async (endpoint, method = 'GET', data = null, includeAuth = true) => {
  const url = `${API_URL}${endpoint}`;
  
  const options = {
    method,
    headers: getHeaders(includeAuth),
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'API request failed');
    }
    
    return result;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

export default {
  // Base request methods
  get: (endpoint, includeAuth = true) => apiRequest(endpoint, 'GET', null, includeAuth),
  post: (endpoint, data, includeAuth = true) => apiRequest(endpoint, 'POST', data, includeAuth),
  put: (endpoint, data, includeAuth = true) => apiRequest(endpoint, 'PUT', data, includeAuth),
  patch: (endpoint, data, includeAuth = true) => apiRequest(endpoint, 'PATCH', data, includeAuth),
  delete: (endpoint, includeAuth = true) => apiRequest(endpoint, 'DELETE', null, includeAuth),
  
  // Helper methods
  getBaseUrl: () => API_URL,
};
