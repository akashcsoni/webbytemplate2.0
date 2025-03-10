"use client"

import { useState, useEffect } from "react"

export function RichText({ body, read_more, initialCharacterLimit = 500 }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [displayContent, setDisplayContent] = useState(body)
    const [showToggle, setShowToggle] = useState(false)

    useEffect(() => {
        // Only apply read more/less if the flag is true
        const shouldTruncate = read_more

        // Create a temporary div to strip HTML and count characters
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = body
        const textContent = tempDiv.textContent || tempDiv.innerText
        const isLongContent = textContent.length > initialCharacterLimit

        // Only show the toggle if content is long enough and read_more is true
        setShowToggle(shouldTruncate && isLongContent)

        // Function to truncate HTML content
        const truncateHTML = (html, limit) => {
            const tempDiv = document.createElement("div")
            tempDiv.innerHTML = html

            let charCount = 0
            let result = ""

            // Process each child node
            const processNode = (node) => {
                if (charCount >= limit) return false

                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent || ""
                    const remainingChars = limit - charCount

                    if (charCount + text.length <= limit) {
                        result += text
                        charCount += text.length
                        return true
                    } else {
                        result += text.substring(0, remainingChars) + "..."
                        charCount += remainingChars
                        return false
                    }
                }

                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node
                    const tagName = element.tagName.toLowerCase()
                    const openTag = `<${tagName}${Array.from(element.attributes)
                        .map((attr) => ` ${attr.name}="${attr.value}"`)
                        .join("")}>`

                    result += openTag

                    let allChildrenProcessed = true
                    for (const child of Array.from(element.childNodes)) {
                        if (!processNode(child)) {
                            allChildrenProcessed = false
                            break
                        }
                    }

                    result += `</${tagName}>`
                    return allChildrenProcessed
                }

                return true
            }

            for (const child of Array.from(tempDiv.childNodes)) {
                if (!processNode(child)) break
            }

            return result
        }

        // Get the display content based on expanded state and read_more flag
        if (shouldTruncate && !isExpanded && isLongContent) {
            setDisplayContent(truncateHTML(body, initialCharacterLimit))
        } else {
            setDisplayContent(body)
        }
    }, [body, read_more, initialCharacterLimit, isExpanded])

    return (
        <div className="rich-text-container">
            <div className="prose max-w-none text-secondary" dangerouslySetInnerHTML={{ __html: displayContent }} />

            {showToggle && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-4 inline-flex items-center text-primary font-medium hover:underline"
                >
                    {isExpanded ? (
                        <>
                            Read less
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="ml-1 h-4 w-4"
                            >
                                <path d="m18 15-6-6-6 6" />
                            </svg>
                        </>
                    ) : (
                        <>
                            Read more
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="ml-1 h-4 w-4"
                            >
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </>
                    )}
                </button>
            )}
        </div>
    )
}

