"use client";

import { Button } from "@heroui/button";
import BlogGrid from "../blog/blog-grid";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { STRAPI_URL } from "@/config/theamConfig";

export default function BlogsList(props) {

    const {
        title,
        description,
        category,
        blog_categories,
    } = props;

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Validate STRAPI_URL
                if (!STRAPI_URL) {
                    throw new Error('STRAPI_URL is not configured');
                }

                const data = JSON.stringify({
                    "category": selectedCategory || ""
                });

                const config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${STRAPI_URL}/blog/filter`,
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    data: data,
                    timeout: 10000 // 10 second timeout
                };

                const response = await axios.request(config);
                
                // Safe response handling with multiple fallbacks
                let blogsData = [];
                
                try {
                    if (response?.data?.data?.blogs && Array.isArray(response.data.data.blogs)) {
                        blogsData = response.data.data.blogs;
                    } else if (response?.data?.blogs && Array.isArray(response.data.blogs)) {
                        blogsData = response.data.blogs;
                    } else if (Array.isArray(response?.data)) {
                        blogsData = response.data;
                    } else {
                        console.warn('Unexpected API response structure:', response?.data);
                        blogsData = [];
                    }
                } catch (parseError) {
                    console.error('Error parsing response data:', parseError);
                    blogsData = [];
                }

                // Validate blog data structure
                const validBlogs = blogsData.filter(blog => {
                    try {
                        return blog && typeof blog === 'object' && blog.id;
                    } catch (e) {
                        console.warn('Invalid blog item:', blog);
                        return false;
                    }
                });

                setBlogs(validBlogs);
                
            } catch (err) {
                console.error('Error fetching blogs:', err);
                
                // Provide user-friendly error messages
                let errorMessage = 'Failed to load blogs';
                
                if (err.code === 'ECONNABORTED') {
                    errorMessage = 'Request timeout - please try again';
                } else if (err.response?.status === 404) {
                    errorMessage = 'Blog service not found';
                } else if (err.response?.status >= 500) {
                    errorMessage = 'Server error - please try again later';
                } else if (err.message === 'STRAPI_URL is not configured') {
                    errorMessage = 'Configuration error';
                } else if (typeof navigator !== 'undefined' && !navigator.onLine) {
                    errorMessage = 'No internet connection';
                }
                
                setError(errorMessage);
                setBlogs([]); // Ensure empty state on error
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if component is mounted
        let isMounted = true;
        
        const safeFetchBlogs = async () => {
            try {
                await fetchBlogs();
            } catch (error) {
                if (isMounted) {
                    console.error('Unhandled error in fetchBlogs:', error);
                    setError('An unexpected error occurred');
                    setLoading(false);
                }
            }
        };

        safeFetchBlogs();

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, [selectedCategory]);

    const handleCategoryClick = (categorySlug) => {
        try {
            setSelectedCategory(categorySlug);
        } catch (error) {
            console.error('Error handling category click:', error);
        }
    };

    // Safe render with error boundary
    try {
        return (
        <div className="lg:py-12 md:py-10">
            <div className="container">
                {
                    title && (
                        <h3 className="lg:mb-6 mb-4">{title}</h3>
                    )
                }
                {
                    description && (
                        <p className="sm:mb-[30px] mb-5">{description}</p>
                    )
                }
                {
                    ((blog_categories && blog_categories?.length > 0) && (category === true)) && (
                        <div className="flex flex-wrap lg:gap-4 sm:gap-[10px] gap-2 2xl:mb-10 xl:mb-9 md:mb-8 mb-6">
                            <Button 
                                key="all"
                                className={`btn flex w-fit h-fit ${
                                    selectedCategory === "" 
                                        ? "btn-secondary" 
                                        : "black-btn"
                                }`}
                                onClick={() => handleCategoryClick("")}
                            >
                                All
                            </Button>
                            {
                                blog_categories?.map((category, index) => (
                                    <Button 
                                        key={index} 
                                        className={`btn flex w-fit h-fit ${
                                            selectedCategory === category?.slug 
                                                ? "btn-secondary" 
                                                : "black-btn"
                                        }`}
                                        onClick={() => handleCategoryClick(category?.slug)}
                                    >
                                        {category?.title}
                                    </Button>
                                ))
                            }

                        </div>
                    )
                }

                {/* Blog Section with dynamic data */}

                {loading && (
                    <div className="flex justify-center items-center py-10">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading blogs...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="flex justify-center items-center py-10">
                        <div className="text-center text-red-600">
                            <p>Error loading blogs: {error}</p>
                        </div>
                    </div>
                )}

                {!loading && !error && blogs && blogs.length > 0 && (
                    <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:gap-x-8 lg:gap-y-10 md:gap-x-7 gap-x-5 md:gap-y-[30px] gap-y-6">
                        {blogs.map((blog, index) => {
                            try {
                                return <BlogGrid key={blog?.id || index} blog={blog} />;
                            } catch (error) {
                                console.error(`Error rendering blog at index ${index}:`, error);
                                return (
                                    <div key={index} className="group relative">
                                        <div className="cursor-pointer relative rounded-lg overflow-hidden lg:mb-[22px] md:mb-[18px] mb-[14px] transition-transform duration-300 group-hover:shadow-lg border border-primary/10 bg-gray-200">
                                            <div className="w-full h-[345px] flex items-center justify-center">
                                                <span className="text-gray-500">Blog unavailable</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="1xl:mb-4 lg:mb-3 mb-[10px]">
                                                Content temporarily unavailable
                                            </h5>
                                            <div className="flex items-center gap-[10px]">
                                                <div className="1xl:w-8 1xl:h-8 lg:w-[30px] lg:h-[30px] w-7 h-7 rounded-full overflow-hidden bg-gray-300"></div>
                                                <p className="p2">Template Insight - Recently</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </div>
                )}

                {!loading && !error && (!blogs || blogs.length === 0) && (
                    <div className="flex justify-center items-center py-10">
                        <div className="text-center text-gray-600">
                            <p>No blogs found.</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
        );
    } catch (error) {
        console.error('BlogsList render error:', error);
        // Fallback UI in case of any rendering errors
        return (
            <div className="lg:py-12 md:py-10">
                <div className="container">
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold mb-4">Blogs temporarily unavailable</h3>
                            <p className="text-gray-600 mb-4">We're experiencing some technical difficulties.</p>
                            <button 
                                onClick={() => window.location.reload()} 
                                className="btn black-btn"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
