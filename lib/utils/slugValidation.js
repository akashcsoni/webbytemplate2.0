/**
 * Slug validation utility to prevent invalid URLs from being crawled and indexed
 * This ensures all slugs follow a consistent format and prevents SEO issues
 * 
 * Valid slug format:
 * - Only lowercase letters, numbers, hyphens, and underscores
 * - Cannot start or end with hyphen or underscore
 * - Cannot contain consecutive special characters (--, __, -_, _-)
 * - Cannot contain special characters like +, *, etc.
 * 
 * @param {string} slug - The slug to validate
 * @returns {boolean} - Returns true if the slug is valid, false otherwise
 */
export function isValidSlug(slug) {
    if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
        return false;
    }

    // Normalize to lowercase for validation (URLs are case-insensitive)
    const normalizedSlug = slug.toLowerCase().trim();

    // Valid slug pattern: only lowercase letters, numbers, hyphens, and underscores
    // Pattern breakdown:
    // ^[a-z0-9]+ - Must start with one or more alphanumeric characters
    // (?:[_-][a-z0-9]+)* - Followed by zero or more groups of (hyphen/underscore + alphanumeric)
    const validSlugPattern = /^[a-z0-9]+(?:[_-][a-z0-9]+)*$/;
    
    // Check if slug matches the pattern
    if (!validSlugPattern.test(normalizedSlug)) {
        return false;
    }

    // Additional checks: no leading/trailing hyphens or underscores
    if (normalizedSlug.startsWith('-') || normalizedSlug.startsWith('_') || 
        normalizedSlug.endsWith('-') || normalizedSlug.endsWith('_')) {
        return false;
    }

    // Check for consecutive special characters
    if (normalizedSlug.includes('--') || normalizedSlug.includes('__') || 
        normalizedSlug.includes('-_') || normalizedSlug.includes('_-')) {
        return false;
    }

    return true;
}

/**
 * Validates multiple slugs at once
 * Useful for routes with multiple dynamic segments
 * 
 * @param {...string} slugs - One or more slugs to validate
 * @returns {boolean} - Returns true if all slugs are valid, false otherwise
 */
export function areValidSlugs(...slugs) {
    return slugs.every(slug => isValidSlug(slug));
}

