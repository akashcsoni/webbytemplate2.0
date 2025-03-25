import Image from 'next/image'
import Link from 'next/link'

const ServiceGrid = ({ category, link_button }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-[#000000]">{category?.title}</h2>
                    <Image
                        src={`https://studio.webbytemplate.com${category?.image?.url}`}
                        alt="WordPress icon"
                        width={32}
                        height={32}
                        className="opacity-30"
                    />
                </div>

                <p className="text-[#505050] mb-4">
                    {category?.description}
                </p>

                <Link
                    href={`/category${category?.slug}`}
                    className="text-[#0156d5] font-medium inline-flex items-center hover:underline"
                >
                    {link_button?.label}
                    <Image
                        src={link_button?.image}
                        alt="arrow"
                        width={12}
                        height={10}
                        className="ml-1"
                    />
                </Link>
            </div>
        </div>
    )
}

export default ServiceGrid
