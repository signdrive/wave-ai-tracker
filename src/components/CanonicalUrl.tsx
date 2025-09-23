
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
    
    // Map routes to their canonical URLs and metadata
    const baseUrl = 'https://www.wavementor.com';
    let canonicalPath = location.pathname;
    
    // Handle search queries properly to avoid soft 404s
    if (canonicalPath === '/search') {
      // Always keep search as /search regardless of query params
      canonicalPath = '/search';
    }
    
    // Force canonical domain consistency
    if (canonicalPath === '/map') {
      canonicalPath = '/map';
    }
    
    if (canonicalPath === '/surf-log') {
      canonicalPath = '/surf-log';
    }
    
    // Remove trailing slash except for root and normalize path
    if (canonicalPath !== '/' && canonicalPath.endsWith('/')) {
      canonicalPath = canonicalPath.slice(0, -1);
    }
    
    // Ensure path starts with /
    if (!canonicalPath.startsWith('/')) {
      canonicalPath = '/' + canonicalPath;
    }
    
    canonical.href = `${baseUrl}${canonicalPath}`;
    
    // Route-specific metadata for SEO
    const routeMetadata: Record<string, { title: string; description: string }> = {
      '/': {
        title: 'Wave Mentor - AI-Powered Surf Forecasting & Community',
        description: 'Get real-time surf conditions, AI-powered wave predictions, and connect with the global surfing community. Premium surf forecasting tools for surfers worldwide.'
      },
      '/live-spots': {
        title: 'Live Surf Spots - Real-Time Conditions | Wave Mentor',
        description: 'View live surf conditions from cameras around the world. Real-time wave height, wind, and weather data for the best surf spots globally.'
      },
      '/map': {
        title: 'Interactive Surf Spot Map - Global Locations | Wave Mentor',
        description: 'Explore surf spots worldwide with our interactive map. Find wave conditions, local crowds, and detailed forecasts for thousands of locations.'
      },
      '/surf-log': {
        title: 'Surf Session Log & Analytics - Track Your Progress | Wave Mentor',
        description: 'Log your surf sessions and track your progress with AI-powered analytics. Get personalized insights and improve your surfing performance.'
      },
      '/book-sessions': {
        title: 'Book Surf Lessons & Coaching Sessions | Wave Mentor',
        description: 'Book professional surf lessons and coaching sessions with certified instructors. Improve your skills with personalized mentorship programs.'
      },
      '/surf-blog': {
        title: 'World\'s Best Surf Spots - Epic Wave Guides | Wave Mentor',
        description: 'Discover the most epic surf spots on the planet. Complete guides to legendary breaks, from perfect barrels to massive swells worldwide.'
      },
      '/privacy-policy': {
        title: 'Privacy Policy | Wave Mentor',
        description: 'Learn how Wave Mentor protects your privacy and handles your personal data. Complete privacy policy and data protection information.'
      },
      '/search': {
        title: 'Search Surf Spots - Find Perfect Waves | Wave Mentor',
        description: 'Search for surf spots by location, wave type, or conditions. Find the perfect waves for your next surf session with detailed forecasts.'
      }
    };

    const metadata = routeMetadata[canonicalPath] || routeMetadata['/'];
    
    // Update page title
    document.title = metadata.title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', metadata.description);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', metadata.description);
      document.head.appendChild(metaDescription);
    }
    
    // Add to document head
    document.head.appendChild(canonical);

    // Update Open Graph URL and title
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', `${baseUrl}${canonicalPath}`);
    } else {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      ogUrl.setAttribute('content', `${baseUrl}${canonicalPath}`);
      document.head.appendChild(ogUrl);
    }
    
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', metadata.title);
    } else {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      ogTitle.setAttribute('content', metadata.title);
      document.head.appendChild(ogTitle);
    }
    
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', metadata.description);
    } else {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      ogDescription.setAttribute('content', metadata.description);
      document.head.appendChild(ogDescription);
    }

    // Add structured data for better SEO
    const existingSchema = document.querySelector('script[type="application/ld+json"]');
    if (existingSchema) {
      existingSchema.remove();
    }

    const schemaMarkup = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": metadata.title,
      "description": metadata.description,
      "url": `${baseUrl}${canonicalPath}`,
      "isPartOf": {
        "@type": "WebSite",
        "name": "Wave Mentor",
        "url": baseUrl
      }
    };

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.textContent = JSON.stringify(schemaMarkup);
    document.head.appendChild(schemaScript);

    return () => {
      // Cleanup on unmount
      const canonicalToRemove = document.querySelector('link[rel="canonical"]');
      if (canonicalToRemove) {
        canonicalToRemove.remove();
      }
      const schemaToRemove = document.querySelector('script[type="application/ld+json"]');
      if (schemaToRemove) {
        schemaToRemove.remove();
      }
    };
  }, [location.pathname]);

  return null;
};

export default CanonicalUrl;
