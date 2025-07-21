'use client';

import React from 'react'
import FeatureProductGrid from '../feature-product-grid';

const FeatureProduct = ({ title = '', grid_section = [] }) => {
    return (
        <div className='container'>
            <div className="container">
                <section className="1xl:py-[35px] py-[30px]">
                    <div className="">
                        {title && <h2 className="mb-[30px]">{title}</h2>}
                        {(Array.isArray(grid_section) && grid_section.length > 0) && (
                            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 2xl:gap-7 md:gap-6 gap-5">
                                {grid_section.map((item, i) => (
                                    item?.link ? (
                                        <FeatureProductGrid
                                            key={i}
                                            link={item?.link}
                                            image={item?.image}
                                            title={item?.title}
                                            description={item?.description}
                                        />
                                    ) : null
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default FeatureProduct
