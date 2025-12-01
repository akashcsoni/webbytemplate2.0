'use client';

import Image from 'next/image';
import React from 'react';

const FeaturesGridSection = ({ features = [] }) => {
    const fallbackImage = '/images/404.png';

    if (!Array.isArray(features) || features.length === 0) {
        return null;
    }

    return (
        <section>
            <div className="container">
                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 2xl:gap-7 md:gap-6 gap-5">
                    {features.map((feature, index) => (
                        <div
                            key={feature?.id || index}
                            className="border border-primary/10 rounded-[9px] transition overflow-hidden hover:shadow-lg text-center"
                        >
                            {/* Feature Image */}
                            <div className="flex items-center justify-center text-gray-400 text-sm bg-gray-50">
                                {feature?.image?.url ? (
                                    <Image
                                        src={feature.image.url}
                                        alt={feature?.image?.alternativeText || feature?.title || 'Feature Image'}
                                        width={433}
                                        height={295}
                                        className="rounded-none !max-w-full !w-full !h-full object-contain"
                                    />
                                ) : (
                                    <Image
                                        src={fallbackImage}
                                        alt="No Image"
                                        width={433}
                                        height={295}
                                        className="rounded-none !max-w-full !w-full !h-full object-contain"
                                    />
                                )}
                            </div>
                            
                            {/* Feature Content */}
                            <div className="2xl:py-6 2xl:px-[30px] xl:py-6 xl:px-[26px] md:p-5 p-4">
                                {feature?.title && (
                                    <h3 className="mb-2 text-primary">{feature.title}</h3>
                                )}
                                {feature?.description && (
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesGridSection;

