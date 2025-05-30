
// Validate coordinates
export const isValidCoordinate = (lat: number, lon: number): boolean => {
  return !isNaN(lat) && !isNaN(lon) && 
         lat >= -90 && lat <= 90 && 
         lon >= -180 && lon <= 180 &&
         (lat !== 0 || lon !== 0); // Exclude null island
};

// Safely format numbers for display
export const safeToFixed = (value: any, decimals: number = 6): string => {
  try {
    const num = Number(value);
    return isNaN(num) ? 'N/A' : num.toFixed(decimals);
  } catch (error) {
    return 'N/A';
  }
};
