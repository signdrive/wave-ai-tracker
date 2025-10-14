import React from 'react';
import { Helmet } from 'react-helmet';

interface StructuredDataProps {
  type?: 'Organization' | 'WebSite' | 'Article' | 'Place';
  data?: Record<string, any>;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type = 'WebSite', data = {} }) => {
  const getStructuredData = () => {
    const baseUrl = 'https://www.wavementor.com';
    
    switch (type) {
      case 'Organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "WaveMentor",
          "url": baseUrl,
          "logo": `${baseUrl}/logo.png`,
          "description": "The Ultimate Surf Intelligence Platform - AI-powered surf forecasting, live cams, and expert coaching",
          "sameAs": [
            "https://twitter.com/wavementor",
            "https://facebook.com/wavementor",
            "https://instagram.com/wavementor"
          ],
          ...data
        };
      
      case 'WebSite':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "WaveMentor",
          "url": baseUrl,
          "description": "AI-powered surf forecasting platform with live cams, expert coaching, and global surf spot database",
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${baseUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          },
          ...data
        };
      
      case 'Article':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "publisher": {
            "@type": "Organization",
            "name": "WaveMentor",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/logo.png`
            }
          },
          ...data
        };
      
      case 'Place':
        return {
          "@context": "https://schema.org",
          "@type": "Place",
          "name": data.name || "Surf Spot",
          "description": data.description,
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": data.latitude,
            "longitude": data.longitude
          },
          ...data
        };
      
      default:
        return data;
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(getStructuredData())}
      </script>
    </Helmet>
  );
};

export default StructuredData;
