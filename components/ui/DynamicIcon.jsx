"use client"

export default function DynamicIcon({ icon, className = "w-5 h-5" }) {
    if (!icon) return null

    // Check if it's an SVG string
    const isSvgString = typeof icon === "string" && icon.trim().startsWith("<svg")

    if (isSvgString) {
        // Replace JSX-style attributes with HTML attributes
        const cleanedSvg = icon
            .replace(/width=\{(\d+)\}/g, 'width="$1"')
            .replace(/height=\{(\d+)\}/g, 'height="$1"')
            .replace(/viewBox=\{(["'])(.+?)\1\}/g, 'viewBox="$2"')
            .replace(/strokeWidth=\{(\d+)\}/g, 'strokeWidth="$1"')

        return <span className={className} dangerouslySetInnerHTML={{ __html: cleanedSvg }} />
    }

    // Handle image URLs
    return <img src={icon || "/placeholder.svg"} alt="icon" className={`${className} object-contain`} />
}
