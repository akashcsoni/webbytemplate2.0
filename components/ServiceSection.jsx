"use client"

import ServiceGrid from "./common/service/service-grid"

export default function ServiceSection({ title, link_button, list }) {
    return (
        <>
            <section className="xl:py-[35px] sm:py-[30px] py-5">
                <div className="bg-blue-300 lg:py-[60px] sm:py-[35px] py-[30px]">
                <div className="container mx-auto ">
                    <h2 className="sm:mb-7 mb-5">{title}</h2>
                    <div className="grid md:grid-cols-2 grid-cols-1 xl:grid-cols-3 sm:gap-6 gap-5">
                        {list.map((category) => (
                            <ServiceGrid key={category?.id} category={category} link_button={link_button} />
                        ))}
                    </div>
                </div>
                </div>
            </section>
        </>
    )
}

