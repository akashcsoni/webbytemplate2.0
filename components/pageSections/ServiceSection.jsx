"use client";

import PropTypes from "prop-types";
import ServiceGrid from "../common/service/service-grid";
import Link from "next/link";

export default function ServiceSection({
    title = "Our Services",
    link_button = null, // { label: string, href: string }
    list = [],
    sectionClassName = "",
    containerClassName = "",
    gridClassName = "",
}) {
    if (!list.length) {
        return null; // nothing to render if list empty
    }

    return (
        <section className={`xl:py-[35px] md:py-[30px] py-5 ${sectionClassName}`}>
            <div className="bg-blue-300 lg:py-[60px] md:py-[35px] sm:py-[30px] py-[20px]">
                <div className={`container mx-auto ${containerClassName}`}>
                    <div className="flex justify-between items-center mb-4 md:mb-7 sm:mb-6">
                        <h2>{title}</h2>
                        {link_button && link_button.href && link_button.label && (
                            <Link
                                href={link_button.href}
                                className="text-white bg-blue-700 px-4 py-2 rounded hover:bg-blue-800 transition"
                            >
                                {link_button.label}
                            </Link>
                        )}
                    </div>
                    <div
                        className={`grid md:grid-cols-2 grid-cols-1 xl:grid-cols-3 sm:gap-6 gap-5 ${gridClassName}`}
                    >
                        {list.map((category) => (
                            <ServiceGrid
                                key={category?.id || category?.name}
                                category={category}
                                link_button={link_button}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

ServiceSection.propTypes = {
    title: PropTypes.string,
    link_button: PropTypes.shape({
        label: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired,
    }),
    list: PropTypes.arrayOf(PropTypes.object),
    sectionClassName: PropTypes.string,
    containerClassName: PropTypes.string,
    gridClassName: PropTypes.string,
};
