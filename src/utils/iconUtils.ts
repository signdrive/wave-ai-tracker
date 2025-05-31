
import L from 'leaflet';
import { safeCreateIcon } from '@/lib/leafletUtils';

export const createSafeMentorIcon = (
  isAvailable: boolean, 
  certifications: string[], 
  avatarUrl?: string
): L.Icon | null => {
  try {
    const color = isAvailable ? '#10B981' : '#EF4444';
    const hasISA = certifications.some(cert => cert.includes('ISA'));
    const hasVDWS = certifications.some(cert => cert.includes('VDWS'));
    
    let badge = '👨‍🏫';
    if (hasISA) badge = '🏆';
    else if (hasVDWS) badge = '⭐';

    // Create safe SVG without btoa encoding issues
    const iconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
        <text x="12" y="16" text-anchor="middle" font-size="10" fill="white">${badge}</text>
      </svg>
    `;

    // Use safe data URL encoding
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(iconSvg)}`;

    return safeCreateIcon({
      iconUrl: dataUrl,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
    });
  } catch (error) {
    console.error('Error creating mentor icon:', error);
    return null;
  }
};

export const createSafeAvatarUrl = (avatarUrl: string): string => {
  if (!avatarUrl || typeof avatarUrl !== 'string') {
    return '/default-mentor.png';
  }

  try {
    // Validate URL format
    new URL(avatarUrl);
    return avatarUrl;
  } catch {
    return '/default-mentor.png';
  }
};
