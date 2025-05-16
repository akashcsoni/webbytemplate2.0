'use client';

import React, { useEffect, useState } from 'react';
import { strapiPost } from '@/lib/api/strapiClient';
import { themeConfig } from '@/config/theamConfig';
import { formatDate } from '@/lib/formatDate';

// Skeleton Loader
const SkeletonReview = () => (
    <div className="animate-pulse border-b border-primary/10 pb-4 space-y-2">
        <div className="flex items-start flex-wrap sm:gap-[30px] gap-3">
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
            <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-4 w-4 bg-gray-300 rounded"></div>
                        ))}
                    </div>
                    <div className="h-3 w-24 bg-gray-300 rounded"></div>
                </div>
                <div className="h-4 w-full bg-gray-300 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
            </div>
        </div>
    </div>
);

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
            d="M5.92852 5.18708L0.708518 5.94389C0.348514 6.0735 0.0709939 6.40657 0.0343874 6.54667C-0.00221917 6.68677 0.0379591 6.97355 0.256064 7.34053L4.0377 11.0215L3.14588 16.2211C3.12668 16.4558 3.22234 16.7296 3.50861 17.047C3.77104 17.1704 4.20474 17.151 4.33306 17.0834L9.00161 14.6289L13.6595 17.0834C14.0232 17.1906 14.445 17.0861 14.5575 16.9945C14.6701 16.9029 14.8073 16.6471 14.8475 16.2211L13.9549 11.0215L17.7382 7.33971C17.8931 7.15789 17.9529 7.02345 17.9752 6.88054C17.9975 6.73764 17.9815 6.59139 17.9289 6.45667C17.8762 6.32196 17.7888 6.20361 17.6756 6.11368L12.0641 5.18708L9.73061 0.457985C9.55856 0.205588 9.14945 0.00146484 8.9967 0.00146484C8.84395 0.00146484 8.43484 0.205588 8.26279 0.457985L5.92852 5.18708Z"
            fill="#F9BC60"
        />
    </svg>
);

const ReviewList = ({ slug }) => {
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchReviews = async () => {
            setLoading(true);
            try {
                const res = await strapiPost(`/product-review/${slug}`, {
                    token: themeConfig.TOKEN,
                });

                if (isMounted) {
                    setReviews(res?.data || []);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError('Failed to fetch reviews. Please try again.');
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchReviews();

        return () => {
            isMounted = false;
        };
    }, [slug]);

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <SkeletonReview key={i} />
                ))}
            </div>
        );
    }

    if (error) return <p className="text-red-500">{error}</p>;
    if (!reviews.length) return <p>No reviews found.</p>;

    return (
        <>
            <div className="flex items-center justify-between w-full gap-2 flex-wrap">
                <h3>{reviews?.length} Reviews of this product</h3>
            </div>
            <div className="space-y-4">
                {reviews.map((review, idx) => (
                    <div
                        key={review?.id || idx}
                        className="border-b border-primary/10 1xl:pb-6 sm:pb-4 pb-2"
                    >
                        <div className="flex items-start flex-wrap sm:gap-[30px] gap-3">
                            <h5 className="flex-shrink-0">
                                {review?.user?.full_name || 'Anonymous'}
                            </h5>
                            <div className="flex flex-col 1xl:gap-[15px] gap-[10px] w-full">
                                <div className="flex items-start justify-between gap-[30px]">
                                    <div className="flex items-center gap-1">
                                        {[...Array(Number(review?.rating || 0))].map((_, i) => (
                                            <StarIcon key={i} />
                                        ))}
                                    </div>
                                    <span className="p2 !text-primary">
                                        {review?.createdAt ? formatDate(review?.createdAt) : 'No date'}
                                    </span>
                                </div>
                                <p>{review?.review || 'No review text provided.'}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default ReviewList;