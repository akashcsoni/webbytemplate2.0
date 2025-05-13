'use client';  // This marks the file as a client component

import { useState, useEffect } from 'react';
import { fetchStrapiData } from '@/lib/api/useStrapi';  // Import the fetch function we defined earlier

// 1. Custom hook to fetch data from Strapi
export const useStrapiData = ({ type, contentType, options, token }) => {
    // 2. State variables for storing the data, loading state, and errors
    const [data, setData] = useState(null);      // Stores the fetched data
    const [loading, setLoading] = useState(true); // Tracks loading state
    const [error, setError] = useState(null);    // Tracks any errors that occur during the fetch

    // 3. useEffect hook to run the API call when the component mounts or when dependencies change
    useEffect(() => {
        // 4. Define a function to fetch data from Strapi
        const fetchData = async () => {
            try {
                // 5. Call fetchStrapiData with the necessary parameters
                const result = await fetchStrapiData({
                    type,         // Type: 'collection' or 'single'
                    contentType,  // The content type (e.g., 'posts', 'homepage')
                    options,      // Query options like pagination, filters, etc.
                    token,        // Optional auth token if needed
                });

                // 6. Set the fetched data to state and change loading to false
                setData(result);
                setLoading(false);
            } catch (err) {
                // 7. If there's an error, set the error state and change loading to false
                setError(err);
                setLoading(false);
            }
        };

        // 8. Call the fetchData function to trigger the API request
        fetchData();
    }, [type, contentType, options, token]);  // Run when these dependencies change

    // 9. Return the data, loading state, and error so they can be used in the component
    return { data, loading, error };
};
