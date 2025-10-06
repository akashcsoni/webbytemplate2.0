/**
 * Canonical Image URL Utility
 * Ensures image URLs in JSON-LD are publicly accessible and canonical
 * Prefers CDN URLs and handles various image formats
 */

/**
 * Canonicalizes an image URL for JSON-LD structured data
 * @param {string|object} imageData - Image URL string or Strapi image object
 * @param {string} baseUrl - Base URL of the site
 * @param {object} options - Additional options
 * @returns {string|null} Canonical image URL or null
 */
export function getCanonicalImageUrl(imageData, baseUrl, options = {}) {
    if (!imageData) return null;

    let imageUrl = null;

    // Handle different image data formats
    if (typeof imageData === 'string') {
        imageUrl = imageData;
    } else if (typeof imageData === 'object' && imageData !== null) {
        // Strapi image object - prefer higher quality formats
        imageUrl = imageData.url || 
                  imageData.formats?.large?.url ||
                  imageData.formats?.medium?.url ||
                  imageData.formats?.small?.url ||
                  imageData.formats?.thumbnail?.url;
    }

    if (!imageUrl) return null;

    // Ensure URL is absolute
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }

    // Handle relative URLs
    if (imageUrl.startsWith('/')) {
        return `${baseUrl}${imageUrl}`;
    }

    // Handle Strapi upload URLs (usually start with /uploads/)
    if (imageUrl.startsWith('uploads/')) {
        return `${baseUrl}/${imageUrl}`;
    }

    // Default: prepend base URL
    return `${baseUrl}/${imageUrl}`;
}

/**
 * Canonicalizes an array of image URLs for JSON-LD
 * @param {Array} images - Array of image data
 * @param {string} baseUrl - Base URL of the site
 * @param {object} options - Additional options
 * @returns {Array} Array of canonical image URLs
 */
export function getCanonicalImageUrls(images, baseUrl, options = {}) {
    if (!Array.isArray(images) || images.length === 0) return [];

    const canonicalUrls = images
        .map(imageData => getCanonicalImageUrl(imageData, baseUrl, options))
        .filter(Boolean); // Remove null values

    // Remove duplicates while preserving order
    return [...new Set(canonicalUrls)];
}

/**
 * Gets the best image for JSON-LD (prefers high-quality, public images)
 * @param {Array|object} images - Image data
 * @param {string} baseUrl - Base URL of the site
 * @param {object} options - Additional options
 * @returns {string|null} Best canonical image URL
 */
export function getBestCanonicalImage(images, baseUrl, options = {}) {
    if (!images) return null;

    // If single image
    if (!Array.isArray(images)) {
        return getCanonicalImageUrl(images, baseUrl, options);
    }

    // If array, get all canonical URLs and return the first (usually highest quality)
    const canonicalUrls = getCanonicalImageUrls(images, baseUrl, options);
    return canonicalUrls.length > 0 ? canonicalUrls[0] : null;
}

/**
 * Creates ImageObject schema for JSON-LD
 * @param {string|object} imageData - Image data
 * @param {string} baseUrl - Base URL of the site
 * @param {string} alt - Alt text for the image
 * @param {object} options - Additional options
 * @returns {object|null} ImageObject schema or null
 */
export function createImageObjectSchema(imageData, baseUrl, alt = '', options = {}) {
    const canonicalUrl = getCanonicalImageUrl(imageData, baseUrl, options);
    
    if (!canonicalUrl) return null;

    return {
        "@type": "ImageObject",
        "url": canonicalUrl,
        "contentUrl": canonicalUrl,
        "description": alt || '',
        "encodingFormat": getImageFormat(canonicalUrl),
        "width": options.width || null,
        "height": options.height || null
    };
}

/**
 * Gets image format from URL
 * @param {string} url - Image URL
 * @returns {string} Image format
 */
function getImageFormat(url) {
    const extension = url.split('.').pop()?.toLowerCase();
    
    const formatMap = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'svg': 'image/svg+xml',
        'avif': 'image/avif'
    };

    return formatMap[extension] || 'image/jpeg';
}

/**
 * Validates if an image URL is publicly accessible
 * @param {string} url - Image URL
 * @returns {boolean} True if URL appears to be publicly accessible
 */
export function isPublicImageUrl(url) {
    if (!url || typeof url !== 'string') return false;

    // Check for common public URL patterns
    const publicPatterns = [
        /^https?:\/\//, // Absolute URLs
        /^\/uploads\//, // Strapi uploads
        /^\/images\//, // Common image directories
        /^\/assets\//, // Asset directories
        /^\/static\//, // Static directories
    ];

    return publicPatterns.some(pattern => pattern.test(url));
}

/**
 * Gets fallback image URL for JSON-LD
 * @param {string} baseUrl - Base URL of the site
 * @returns {string} Fallback image URL
 */
export function getFallbackImageUrl(baseUrl) {
    return `${baseUrl}/logo/webby-logo.svg`;
}
