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
        const options = {
            method,
            headers: {
                ...headers,
            },
        }

        // Handle different request types
        if (method === "GET" && data) {
            // For GET requests, convert data to query parameters
            const params = new URLSearchParams()
            Object.entries(data).forEach(([key, value]) => {
                params.append(key, value)
            })
            url = `${url}?${params.toString()}`
        } else if (data) {
            // For POST, PUT, etc.
            if (data instanceof FormData) {
                // FormData is already properly formatted for multipart/form-data
                options.body = data
            } else {
                // JSON data
                options.headers["Content-Type"] = "application/json"
                options.body = JSON.stringify(data)
            }
        }

        const response = await fetch(url, options)

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error("API request error:", error)
        throw error
    }
}