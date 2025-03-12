import React from 'react'
import CategoryTagCard from './product/category/tag/category-tag-card'

const CategoryTagList = ({ title, description, categories }) => {

    // If no categories, don't render
    if (!categories || categories.length === 0) {
        return null
    }

    return (
        <div className="bg-[#e6effb] py-16">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl font-bold text-[#000000] mb-2">{title}</h1>
                <p className="text-[#505050] mb-8">{description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {categories.map((category, index) => (
                        <CategoryTagCard key={index} category={category} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CategoryTagList
