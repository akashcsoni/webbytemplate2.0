import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    // Check if it's an Odoo Apps Store URL
    if (!url.includes('apps.odoo.com')) {
      return NextResponse.json({ imageUrl: null });
    }

    // Fetch the page HTML
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      return NextResponse.json({ imageUrl: null });
    }

    const html = await response.text();
    
    // Extract the background-image URL from loempia_app_cover div
    const regex = /<div[^>]*class="[^"]*loempia_app_cover[^"]*"[^>]*style="[^"]*background-image:\s*url\(([^)]+)\)/i;
    let match = html.match(regex);
    
    // If not found, try a more flexible pattern
    if (!match) {
      const flexibleRegex = /loempia_app_cover[^>]*style="[^"]*background-image:\s*url\(([^)]+)\)/i;
      match = html.match(flexibleRegex);
    }
    
    // Try to find the div and extract from any style attribute
    if (!match) {
      const divRegex = /<div[^>]*class="[^"]*loempia_app_cover[^"]*"[^>]*>/i;
      const divMatch = html.match(divRegex);
      if (divMatch) {
        const divContent = divMatch[0];
        const styleMatch = divContent.match(/style="([^"]*)"/i);
        if (styleMatch && styleMatch[1]) {
          const styleContent = styleMatch[1];
          const urlMatch = styleContent.match(/background-image:\s*url\(([^)]+)\)/i);
          if (urlMatch) {
            match = urlMatch;
          }
        }
      }
    }
    
    if (match && match[1]) {
      let imageUrl = match[1]
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
      
      // Remove quotes if present
      imageUrl = imageUrl.replace(/^["']|["']$/g, '');
      
      // Add protocol if missing
      if (imageUrl.startsWith('//')) {
        imageUrl = 'https:' + imageUrl;
      }
      
      return NextResponse.json({ imageUrl });
    }
    
    return NextResponse.json({ imageUrl: null });
  } catch (error) {
    console.error('Error fetching Odoo app cover:', error);
    return NextResponse.json({ imageUrl: null });
  }
}

