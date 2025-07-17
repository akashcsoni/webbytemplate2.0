'use client';

import React from 'react'
import DynamicIcon from './ui/DynamicIcon';

const DigitalSales = ({ title = '', grid_section }) => {
    // Ensure grid_section is always an array
    const safeGridSection = Array.isArray(grid_section) ? grid_section : [];
    const hasContent = title || safeGridSection.length > 0;

    if (!hasContent) {
        // Fallback UI if no data is available
        return (
            <section className="py-[35px]">
                <div className="container text-center py-10">
                    <p className="text-gray-500">No sales data available.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-[35px]">
            <div className="bg-blue-300 1xl:py-[60px] lg:py-[50px] md:py-[45px] sm:py-[35px] py-[25px]">
                <div className="container">
                    {title && (
                        <h2 className="1xl:mb-[53px] sm:mb-8 mb-5 sm:text-start text-center">
                            {title}
                        </h2>
                    )}
                    {safeGridSection.length > 0 && (
                        <div className="flex lg:flex-nowrap flex-wrap sm:justify-between justify-center gap-7">
                            {safeGridSection.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col items-center justify-start gap-[26px] 2xl:px-[60px] 1xl:px-[45px] xl:px-[33px] lg:px-[11px] px-4 py-[18px] relative md:w-full sm:w-[35%]"
                                >
                                    <div className="z-10">
                                        {item?.image ? <DynamicIcon icon={item.image} /> : <span className="text-gray-400">No Icon</span>}
                                    </div>
                                    <h4 className="text-center leading-8 font-normal">
                                        {item?.title || 'No Title'}
                                    </h4>
                                    <div className="rectangle"></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default DigitalSales
