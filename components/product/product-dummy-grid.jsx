import React from 'react'

const ProductDummyGrid = () => {
    return (
        <div className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-[340px] mb-4"></div>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="bg-gray-200 rounded-full w-8 h-8 mr-3"></div>
                    <div>
                        <div className="bg-gray-200 h-4 w-24 rounded mb-2"></div>
                        <div className="bg-gray-200 h-3 w-16 rounded"></div>
                    </div>
                </div>
                <div className="bg-gray-200 h-4 w-16 rounded"></div>
            </div>
        </div>
    )
}

export default ProductDummyGrid
