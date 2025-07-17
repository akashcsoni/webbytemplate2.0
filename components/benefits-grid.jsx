import React from 'react'
import DynamicIcon from './ui/DynamicIcon'

const BenefitsGrid = ({ image, title, description }) => {
    return (
        <div
            className="2xl:p-[30px] 1xl:p-[25px] sm:p-5 p-4 border border-primary/10 rounded-[10px]"
        >
            {image && (
                <div className="1xl:w-14 1xl:h-14 w-12 h-12 1xl:mb-[25px] mb-4">
                    <DynamicIcon icon={image} />
                </div>
            )}
            {title && <h3 className="1xl:mb-[15px] mb-2">{title}</h3>}
            {description && <p>{description}</p>}
        </div>
    )
}

export default BenefitsGrid
