// 1. Function to build dynamic query string from the options object
export const buildStrapiQuery = (query = {}) => {
    // Create a new URLSearchParams object which will hold the query parameters
    const params = new URLSearchParams();

    // 2. Loop through each key-value pair in the `query` object
    Object.entries(query).forEach(([key, value]) => {

        // 3. Handle nested objects (e.g., filtering by multiple conditions)
        if (typeof value === 'object') {
            // Convert the nested object into a JSON string (Strapi expects JSON)
            params.append(key, JSON.stringify(value));
        } else {
            // 4. Handle simple key-value pairs (e.g., pagination or sort)
            params.append(key, value);
        }
    });

    // 5. Return the params as a URLSearchParams object (which is easy to append to the endpoint URL)
    return params;
};
