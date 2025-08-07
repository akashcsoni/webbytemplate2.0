// ✅ 1. Import axios for HTTP requests
import { STRAPI_URL } from '@/config/theamConfig';
import axios from 'axios';

// ✅ 2. Set the base URL for Strapi API (can be configured via environment variables)
const STRAPIURL = process.env.NEXT_PUBLIC_STRAPI_URL || STRAPI_URL;

// ✅ 3. Create a pre-configured Axios instance with Strapi base URL
const strapi = axios.create({
    baseURL: STRAPIURL,
    // Optional: You can set common headers or timeout here if needed
    // timeout: 10000,
});

// ✅ 4. Helper function to attach Authorization token (if provided)
const withAuthHeader = (token) => {
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ 5. Generic GET request
/**
 * Fetch data from a Strapi endpoint
 * @param {string} endpoint - e.g. 'pages/home'
 * @param {object} options - Optional { params, token }
 * @returns {Promise<any>} - Response data
 */
export const strapiGet = async (endpoint, { params = {}, token } = {}) => {
    const headers = withAuthHeader(token);
    const response = await strapi.get(endpoint, { params, headers });
    return response.data;
};

// ✅ 6. Generic POST request
/**
 * Create data on a Strapi endpoint
 * @param {string} endpoint - e.g. 'articles'
 * @param {object} data - e.g. { data: { title: 'Post title' } }
 * @param {string} token - Optional Bearer token
 */
export const strapiPost = async (endpoint, data = {}, token) => {
    const headers = withAuthHeader(token);
    const response = await strapi.post(endpoint, data, { headers });
    return response.data;
};  

// ✅ 7. Generic PUT request
/**
 * Update existing data on a Strapi endpoint
 * @param {string} endpoint - e.g. 'articles/1'
 * @param {object} data - Updated data
 * @param {string} token - Optional Bearer token
 */
export const strapiPut = async (endpoint, data = {}, token) => {
    const headers = withAuthHeader(token);
    const response = await strapi.put(endpoint, data, { headers });
    return response.data;
};

// ✅ 8. Generic DELETE request
/**
 * Delete data from a Strapi endpoint
 * @param {string} endpoint - e.g. 'articles/1'
 * @param {string} token - Optional Bearer token
 */
export const strapiDelete = async (endpoint, token) => {
    const headers = withAuthHeader(token);
    const response = await strapi.delete(endpoint, { headers });
    return response.data;
};
