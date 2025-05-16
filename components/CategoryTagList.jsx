import React from 'react'
import CategoryTagCard from './product/category/tag/category-tag-card'

const CategoryTagList = ({ title, description, categories }) => {

    // If no categories, don't render
    if (!categories || categories.length === 0) {
        return null
    }

    return (
        <div className="bg-blue-300 md:py-[50px] sm:py-9 py-6">
            <div className="container">
                <h1 className="h2 mb-[10px]">{title}</h1>
                <p className="sm:mb-[30px] mb-5">{description}</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 sm:gap-4 gap-3 mb-4 html-categories">
                    {categories.map((category, index) => (
                        <CategoryTagCard key={index} category={category} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CategoryTagList
