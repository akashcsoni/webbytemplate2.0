import { strapiGet } from './strapiClient';  // Import the strapiGet method
import { buildStrapiQuery } from './queryBuilder';  // Import the query builder helper

// 1. A function to fetch Strapi data for both collection and single types
export const fetchStrapiData = async ({
    type = 'collection', // By default, we'll fetch a collection type
    contentType,         // This is the "name" of your Strapi content type (e.g., 'posts', 'homepage')
    options = {},        // This object can include things like filters, pagination, sort, populate
    token = null,        // Optional authentication token (for protected routes)
}) => {

    // 2. Build the dynamic query string from the options passed (pagination, filters, etc.)
    const query = buildStrapiQuery(options);

    // 3. Set the correct endpoint based on the type (single or collection)
    const endpoint = type === 'collection' ? `/${contentType}` : `/${contentType}`;

    // 4. Append the query string to the endpoint
    const url = `${endpoint}?${query.toString()}`;

    // 5. Make the API call using strapiGet and return the data
    return await strapiGet(url, { token });
};
