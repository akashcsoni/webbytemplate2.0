"use client"

import { useState } from "react"
import Link from "next/link"

export default function FAQSection({ title, label, button, list }) {
    const [openQuestion, setOpenQuestion] = useState(list[0]?.id || null)

    const toggleQuestion = (id) => {
        if (openQuestion === id) {
            setOpenQuestion(null)
        } else {
            setOpenQuestion(id)
        }
    }

    const handleKeyDown = (e, id) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            toggleQuestion(id)
        }
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-3xl font-bold text-[#000000] mb-4">{title}</h2>
                    <p className="text-[#505050] mb-8">{label}</p>
                    <Link href={button.link}>
                        <button className="bg-[#0156d5] text-white px-6 py-3 rounded-md font-medium hover:bg-[#00193e] transition-colors">
                            {button.label}
                        </button>
                    </Link>
                </div>

                <div className="space-y-4">
                    {list.map((item, index) => (
                        <div key={item.id} className="border-b border-gray-200 pb-4">
                            <div
                                role="button"
                                tabIndex={0}
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleQuestion(item.id)}
                                onKeyDown={(e) => handleKeyDown(e, item.id)}
                                aria-expanded={openQuestion === item.id}
                                aria-controls={`faq-content-${item.id}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-[#0156d5] font-medium">Q{index + 1}.</span>
                                    <h3 className="text-lg font-medium">{item.title}</h3>
                                </div>
                                <span className="text-gray-500 p-1" aria-hidden="true">
                                    {openQuestion === item.id ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-5 w-5"
                                        >
                                            <path d="M18 6 6 18" />
                                            <path d="m6 6 12 12" />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-5 w-5"
                                        >
                                            <path d="M5 12h14" />
                                            <path d="M12 5v14" />
                                        </svg>
                                    )}
                                </span>
                            </div>

                            {openQuestion === item.id && (
                                <div id={`faq-content-${item.id}`} className="mt-3 pl-8 pr-4 text-[#505050]">
                                    <p>{item.label}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}