"use client";

import React, { useState, useEffect } from "react";

// Link Thumbnail Preview Component (Client Component)
const LinkThumbnailPreviewServer = ({ data }) => {
  const { link } = data;
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!link) {
      setIsLoading(false);
      return;
    }

    const fetchThumbnail = async () => {
      try {
        // Generate thum.io thumbnail URL as default
        const getThumbnailUrl = (url) => {
          try {
            return `https://image.thum.io/get/${url}`;
          } catch (error) {
            return null;
          }
        };

        // Try to get Odoo app cover image first via API route
        let imageUrl = null;
        if (link.includes('apps.odoo.com')) {
          try {
            const response = await fetch(`/api/odoo-thumbnail?url=${encodeURIComponent(link)}`);
            if (response.ok) {
              const data = await response.json();
              imageUrl = data.imageUrl;
            }
          } catch (error) {
            console.error('Error fetching Odoo thumbnail:', error);
          }
        }

        // Use Odoo image if found, otherwise use thum.io
        const finalUrl = imageUrl || getThumbnailUrl(link);
        setThumbnailUrl(finalUrl);
      } catch (error) {
        console.error('Error setting thumbnail:', error);
        // Fallback to thum.io
        setThumbnailUrl(`https://image.thum.io/get/${link}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThumbnail();
  }, [link]);

  if (!link) return null;

  return (
    <div className="mb-6 !bg-[#E6EFFB] border border-primary/10 p-4 rounded-lg">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="block group relative overflow-hidden rounded-lg bg-white border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300"
        style={{ width: '815px', maxWidth: '100%', aspectRatio: '815/457' }}
      >
        {isLoading ? (
          <div className="relative w-full flex items-center justify-center" style={{ aspectRatio: '815/457', height: 'auto', minHeight: '457px' }}>
            <div className="text-gray-400">Loading preview...</div>
          </div>
        ) : thumbnailUrl ? (
          <div className="relative w-full" style={{ aspectRatio: '815/457', height: 'auto' }}>
            <img
              src={thumbnailUrl}
              alt={`Preview of ${link}`}
              className="w-full h-full object-contain"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              width={815}
              height={457}
              loading="lazy"
              onError={(e) => {
                // Fallback if image fails to load
                e.target.style.display = 'none';
              }}
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-primary px-4 py-2 rounded-md">
                  <span className="text-white font-medium text-sm">Visit Site</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </a>
    </div>
  );
};

export default LinkThumbnailPreviewServer;

