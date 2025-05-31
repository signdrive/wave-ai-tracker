
import L from 'leaflet';

export const createSafeMentorIcon = (isAvailable: boolean, certifications: string[], avatarUrl?: string) => {
  const color = isAvailable ? '#10B981' : '#EF4444';
  const hasISA = certifications.some(cert => cert.includes('ISA'));
  const hasVDWS = certifications.some(cert => cert.includes('VDWS'));
  
  let badge = '👨‍🏫';
  if (hasISA) badge = '🏆';
  else if (hasVDWS) badge = '⭐';

  // Safe SVG icon creation without btoa encoding
  const iconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
      <text x="12" y="16" text-anchor="middle" font-size="10" fill="white">${badge}</text>
    </svg>
  `;

  // Use data URL without btoa to avoid encoding issues
  const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(iconSvg)}`;

  return new L.Icon({
    iconUrl: dataUrl,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

export const createSafeAvatarUrl = (avatarUrl: string): string => {
  // Fallback for invalid URLs
  if (!avatarUrl || typeof avatarUrl !== 'string') {
    return '/default-mentor.png';
  }

  try {
    // Validate URL format
    new URL(avatarUrl);
    return avatarUrl;
  } catch {
    // Return fallback for invalid URLs
    return '/default-mentor.png';
  }
};
