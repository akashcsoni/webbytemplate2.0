import Link from 'next/link';
import Image from 'next/image';
import React from 'react'

const SingleBlogPage = ({ data }) => {
    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    // Calculate reading time based on body content
    const calculateReadingTime = (body) => {
        if (!body) return '1 min read';
        try {
            // Remove HTML tags and count words
            const textContent = body.replace(/<[^>]*>/g, '');
            const wordCount = textContent.split(/\s+/).length;
            const readingTime = Math.ceil(wordCount / 200); // Average 200 words per minute
            return `${readingTime} min read`;
        } catch (error) {
            console.error('Error calculating reading time:', error);
            return '1 min read';
        }
    };

    if (!data) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-gray-500">No blog data available</div>
            </div>
        );
    }

    return (
        <div className="single-post-header">
            <div className="container mx-auto px-4 py-8">
                {/* Blog Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    {data?.title || 'Untitled Blog Post'}
                </h1>

                {/* Blog Categories */}
                {data?.blog_categories && Array.isArray(data.blog_categories) && data.blog_categories.length > 0 && (
                    <div className="tags flex flex-wrap gap-2 mb-6">
                        {data.blog_categories.map((category, index) => (
                            <span 
                                key={category?.id || index} 
                                className="text-primary bg-[#E6EFFB] py-[3px] px-3 rounded-[4px] text-sm"
                            >
                                {category?.title || 'Uncategorized'}
                            </span>
                        ))}
                    </div>
                )}

                {/* Author Info and Meta */}
                <div className="template-info flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        {/* Author Image */}
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                            {data?.author?.image?.url ? (
                                <Image
                                    src={data.author.image.url}
                                    alt={data?.author?.full_name || 'Author'}
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-gray-600 text-xs font-medium">
                                        {(data?.author?.full_name || 'A').charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        {/* Author Name and Meta */}
                        <div className="flex flex-col">
                            <h3 className="text-sm font-medium text-gray-900">
                                {data?.author?.full_name || 'Anonymous'}
                            </h3>
                            <div className="text-xs text-gray-500">
                                {formatDate(data?.publishedAt || data?.createdAt)} • {calculateReadingTime(data?.body)}
                            </div>
                        </div>
                    </div>

                    {/* Share Button */}
                    <Link 
                        href={`/blog/${data?.slug}`} 
                        className="btn btn-primary gap-2 text-sm px-4 py-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="17"
                            viewBox="0 0 16 17"
                            fill="none"
                        >
                            <path
                                d="M14.6654 8.50016V11.6113C14.6654 12.8559 14.6654 13.4781 14.4231 13.9535C14.2101 14.3716 13.8702 14.7115 13.452 14.9246C12.9767 15.1668 12.3544 15.1668 11.1098 15.1668H4.88759C3.64303 15.1668 3.02074 15.1668 2.54539 14.9246C2.12725 14.7115 1.78729 14.3716 1.57424 13.9535C1.33203 13.4781 1.33203 12.8559 1.33203 11.6113V8.50016M10.9616 4.79646L7.9987 1.8335M7.9987 1.8335L5.03574 4.79646M7.9987 1.8335V10.7224"
                                stroke="white"
                                strokeWidth="1.33333"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Share
                    </Link>
                </div>

                {/* Featured Image */}
                {data?.image?.url && (
                    <div className="mb-8">
                        <Image
                            src={data.image.url}
                            alt={data?.image?.alternativeText || data?.title || 'Blog featured image'}
                            width={800}
                            height={400}
                            className="w-full h-auto rounded-lg object-cover"
                            priority={true}
                        />
                    </div>
                )}

                {/* Blog Content */}
                {data?.body && (
                    <div 
                        className="prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: data.body }}
                    />
                )}
            </div>
        </div>
    )
}

export default SingleBlogPage