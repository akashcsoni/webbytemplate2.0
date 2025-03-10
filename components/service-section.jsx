"use client"

import ServiceGrid from "./common/service/service-grid"

export default function ServiceSection({ title, link_button, list }) {
    return (
        <>
            <section className="bg-[#e6effb]">
                <div className="container mx-auto px-4 py-12">
                    <h1 className="text-3xl font-bold mb-8 text-[#000000]">{title}</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {list.map((category) => (
                            <ServiceGrid key={category?.id} category={category} link_button={link_button} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

