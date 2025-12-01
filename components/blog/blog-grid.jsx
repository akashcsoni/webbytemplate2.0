import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

const BlogGrid = ({ blog }) => {
    // Safe data extraction with comprehensive fallbacks
    const blogData = blog || {};

    // Safe date formatting with error handling
    const formatDate = (dateString) => {
        try {
            if (!dateString) return "Recently";
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "Recently";
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (error) {
            console.warn('Date formatting error:', error);
            return "Recently";
        }
    };

    // Safe image URL extraction
    const getImageUrl = () => {
        try {
            return blogData?.image?.url || "/images/blog-banner-1.webp";
        } catch (error) {
            console.warn('Image URL error:', error);
            return "/images/blog-banner-1.webp";
        }
    };

    // Safe author image URL extraction
    const getAuthorImageUrl = () => {
        try {
            return blogData?.author?.image?.url || "/images/place_holder.png";
        } catch (error) {
            console.warn('Author image URL error:', error);
            return "/images/place_holder.png";
        }
    };

    // Safe author name extraction
    const getAuthorName = () => {
        try {
            return blogData?.author?.full_name || "Template Insight";
        } catch (error) {
            console.warn('Author name error:', error);
            return "Template Insight";
        }
    };

    // Safe title extraction
    const getTitle = () => {
        try {
            return blogData?.title || "Building Trust: The Impact of Customer Testimonials in Metals Marketing";
        } catch (error) {
            console.warn('Title error:', error);
            return "Building Trust: The Impact of Customer Testimonials in Metals Marketing";
        }
    };

    // Safe slug extraction
    const getSlug = () => {
        try {
            return blogData?.slug || "#";
        } catch (error) {
            console.warn('Slug error:', error);
            return "#";
        }
    };

    // Safe category extraction
    const getCategory = () => {
        try {
            return blogData?.blog_categories?.[0]?.title || null;
        } catch (error) {
            console.warn('Category error:', error);
            return null;
        }
    };

    try {
        return (
            <div className="group relative">
                <Link href={getSlug() ? `/blog/${getSlug()}` : "#"}>
                    <div className="cursor-pointer relative rounded-lg overflow-hidden lg:mb-[22px] md:mb-[18px] mb-[14px] transition-transform duration-300 group-hover:shadow-lg border border-primary/10">
                        <Image
                            alt={`${getTitle()} - Blog post by ${getAuthorName()}`}
                            width={270}
                            height={345}
                            className="w-full h-auto"
                            src={getImageUrl()}
                            style={{ color: "transparent" }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                            onError={(e) => {
                                console.warn('Image load error:', e);
                                e.target.src = "/images/blog-banner-1.webp";
                            }}
                        />
                    </div>
                </Link>
                <div>
                    {getCategory() && (
                        <div className="flex flex-wrap justify-start md:gap-[10px] gap-[8px] lg:mb-4 md:mb-[14px] mb-2">
                            <span className="flex items-center gap-2 btn btn-secondary md:!px-3 !px-2 !py-[3px] md:!text-sm !text-[13px]">
                                <span>{getCategory()}</span>
                            </span>
                        </div>
                    )}
                    <h2 className="1xl:mb-4 lg:mb-3 mb-[10px] h5 line-clamp-2">
                        <Link href={getSlug() ? `/blog/${getSlug()}` : "#"} className="hover:text-[#0156d5]">
                            {getTitle()}
                        </Link>
                    </h2>
                    <div className="flex items-center gap-[10px]">
                        <div className="1xl:w-8 1xl:h-8 lg:w-[30px] lg:h-[30px] w-7 h-7 rounded-full overflow-hidden">
                            <Image
                                src={getAuthorImageUrl()}
                                alt={`${getAuthorName()} profile picture`}
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                sizes="32px"
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                                onError={(e) => {
                                    console.warn('Author image load error:', e);
                                    e.target.src = "/images/place_holder.png";
                                }}
                            />
                        </div>
                        <p className="p2">
                            {getAuthorName()} - {formatDate(blogData?.createdAt)}
                        </p>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('BlogGrid render error:', error);
        // Fallback component in case of any rendering errors
        return (
            <div className="group relative">
                <div className="cursor-pointer relative rounded-lg overflow-hidden lg:mb-[22px] md:mb-[18px] mb-[14px] transition-transform duration-300 group-hover:shadow-lg border border-primary/10 bg-gray-200">
                    <div className="w-full h-[345px] flex items-center justify-center">
                        <span className="text-gray-500">Blog content unavailable</span>
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
}

export default BlogGrid