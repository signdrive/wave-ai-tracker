
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CanonicalUrl = () => {
  const location = useLocation();

  useEffect(() => {
    // Remove any existing canonical link
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Create new canonical link
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    
    // Map routes to their canonical URLs
    const baseUrl = 'https://www.wavementor.com';
    let canonicalPath = location.pathname;
    
    // Remove trailing slash except for root
    if (canonicalPath !== '/' && canonicalPath.endsWith('/')) {
      canonicalPath = canonicalPath.slice(0, -1);
    }
    
    canonical.href = `${baseUrl}${canonicalPath}`;
    
    // Add to document head
    document.head.appendChild(canonical);

    // Also update Open Graph URL if it exists
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', `${baseUrl}${canonicalPath}`);
    }

    return () => {
      // Cleanup on unmount
      const canonicalToRemove = document.querySelector('link[rel="canonical"]');
      if (canonicalToRemove) {
        canonicalToRemove.remove();
      }
    };
  }, [location.pathname]);

  return null;
};

export default CanonicalUrl;
