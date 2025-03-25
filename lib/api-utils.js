/**
 * Global API utility function for making requests
 * @param {string} url - API endpoint URL
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {Object|FormData} data - Request data (body for POST, query params for GET)
 * @param {Object} headers - Request headers
 * @returns {Promise<any>} - API response data
 */
export async function apiRequest(url, method = "GET", data = null, headers = {}) {
    try {
        const isGet = method === "GET";
        const options = {
            method,
            headers: {
                ...(data && !isGet && !(data instanceof FormData) && { "Content-Type": "application/json" }),
                ...headers,
            },
            ...(data && !isGet && { body: data instanceof FormData ? data : JSON.stringify(data) })
        };

        const finalUrl = isGet && data
            ? `${url}?${new URLSearchParams(data)}`
            : url;

        const response = await fetch(finalUrl, options);
        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
        
        return response.json();
    } catch (error) {
        console.error("API request error:", error);
        throw error;
    }
}