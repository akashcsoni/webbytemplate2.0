'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const FeatureProductGrid = ({ link = '', image = {}, title = '', description = '' }) => {

    const fallbackImage = '/images/404.png';

    return (
        <Link
            href={link}
            className="border border-primary/10 rounded-[9px] transition overflow-hidden"
        >
            <div className="flex items-center justify-center text-gray-400 text-sm digital-products">
                {image && image.url ? (
                    <Image
                        src={image.url}
                        alt={title || 'Product Image'}
                        width={468}
                        height={237}
                        className="rounded-none !max-w-full !w-full !h-full object-contain"
                    />
                ) : (
                    <Image
                        src={fallbackImage}
                        alt="No Image"
                        width={468}
                        height={237}
                        className="rounded-none !max-w-full !w-full !h-full object-contain"
                    />
                )}
            </div>
            <div className="2xl:py-6 2xl:px-[30px] xl:py-6 xl:px-[26px] md:p-5 p-4">
                {title && <h3 className="mb-2">{title}</h3>}
                {description && <p className="">{description}</p>}
            </div>
        </Link>
    )
}

export default FeatureProductGrid