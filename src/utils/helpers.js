/**
 * Utility functions for Building Navigation App
 * Coordinate conversion, text processing, etc.
 */

/**
 * Check if text looks like a room identifier
 * Converted from Python is_room_text function
 */
export const isRoomText = (text, fontSize = 0) => {
  if (!text || text.length < 1) {
    return false;
  }

  // Skip area measurements and metadata
  if (/^\d+\.\d+m2$/i.test(text)) return false;
  if (/^(Area|Type|Room \d+\.\d+m2):/i.test(text)) return false;
  if (/^\d+\.\d+$/.test(text) && text.length > 6) return false;
  if (/^(width|height|scale|rotation|metadata|properties)$/i.test(text)) return false;

  // Accept room formats - more permissive patterns
  if (/^[A-Z0-9]{1,4}[-._][A-Z0-9]{1,4}/i.test(text)) return true; // Format like "PH-D1", "A-01"
  if (/^\d{2}_\d{2}$/.test(text)) return true; // Format like "01_02"
  if (/^[A-Z]\.\d\.\d{2}$/i.test(text)) return true; // Format like "A.1.01"
  if (/^PH-D\d+\.?\d*_?\d*$/i.test(text)) return true; // Format like "PH-D1.11_01"
  if (/^[A-Z]{1,2}\d{2,4}$/i.test(text)) return true; // Format like "A101", "AB123"
  if (/^\d{2,4}[A-Z]?$/i.test(text)) return true; // Format like "101", "202A"
  if (/^[A-Z0-9]{2,8}$/i.test(text)) return true; // Short alphanumeric codes

  // Be more inclusive - accept most alphanumeric combinations that could be room numbers
  if (/^[A-Z0-9.\-_]{2,10}$/i.test(text)) {
    // But exclude obvious non-rooms
    if (!/^[\d.]+$/.test(text)) { // Not just numbers and dots
      return true;
    }
  }

  return false;
};

/**
 * Check if text indicates an entrance
 */
export const isEntranceText = (text) => {
  return text.toLowerCase().includes('indgang');
};

/**
 * Normalize coordinates to 0-1 range
 */
export const normalizeCoordinates = (x, y, pageWidth, pageHeight) => {
  return {
    x: x / pageWidth,
    y: y / pageHeight,
  };
};

/**
 * Calculate Euclidean distance between two points
 */
export const calculateDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

/**
 * Find nearest entrance from a list of entrances to a room position
 */
export const findNearestEntrance = (roomX, roomY, entrances) => {
  if (!entrances || entrances.length === 0) {
    return null;
  }

  let minDistance = Infinity;
  let nearestEntrance = null;

  for (const entrance of entrances) {
    const distance = calculateDistance(roomX, roomY, entrance.x, entrance.y);
    
    if (distance < minDistance) {
      minDistance = distance;
      nearestEntrance = entrance;
    }
  }

  return nearestEntrance;
};

/**
 * Format building name for display
 */
export const formatBuildingName = (buildingName) => {
  return buildingName.charAt(0).toUpperCase() + buildingName.slice(1);
};

/**
 * Format floor name for display
 */
export const formatFloorName = (floorName) => {
  if (floorName === 'stue') return 'Stueetage';
  if (floorName.includes('_sal')) {
    return floorName.replace('_sal', '. sal');
  }
  return floorName;
};

/**
 * Validate room query input
 */
export const validateRoomQuery = (query) => {
  if (!query || typeof query !== 'string') {
    return { valid: false, error: 'Indtast venligst et lokale nummer' };
  }

  const trimmedQuery = query.trim();
  
  if (trimmedQuery.length === 0) {
    return { valid: false, error: 'Lokale nummer kan ikke være tomt' };
  }

  if (trimmedQuery.length > 20) {
    return { valid: false, error: 'Lokale nummer er for langt' };
  }

  return { valid: true, normalizedQuery: trimmedQuery.toUpperCase() };
};

/**
 * Calculate PDF display dimensions maintaining aspect ratio
 */
export const calculatePDFDisplayDimensions = (pdfWidth, pdfHeight, containerWidth, containerHeight) => {
  const pdfAspectRatio = pdfWidth / pdfHeight;
  const containerAspectRatio = containerWidth / containerHeight;
  
  let displayWidth, displayHeight, offsetX = 0, offsetY = 0;
  
  if (pdfAspectRatio > containerAspectRatio) {
    // PDF is wider than container
    displayWidth = containerWidth;
    displayHeight = containerWidth / pdfAspectRatio;
    offsetY = (containerHeight - displayHeight) / 2;
  } else {
    // PDF is taller than container
    displayHeight = containerHeight;
    displayWidth = containerHeight * pdfAspectRatio;
    offsetX = (containerWidth - displayWidth) / 2;
  }

  return {
    displayWidth,
    displayHeight,
    offsetX,
    offsetY,
  };
};

/**
 * Convert normalized coordinates to screen coordinates
 */
export const convertToScreenCoordinates = (normalizedX, normalizedY, displayWidth, displayHeight, offsetX, offsetY) => {
  return {
    x: offsetX + (normalizedX * displayWidth),
    y: offsetY + (normalizedY * displayHeight),
  };
};

/**
 * Debounce function for search input
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Constants used throughout the app
 */
export const APP_CONSTANTS = {
  // iPhone 13 Pro dimensions
  SCREEN_WIDTH: 375,
  SCREEN_HEIGHT: 812,
  
  // Colors (matching Python prototype)
  COLORS: {
    PRIMARY: '#007AFF',
    BACKGROUND: '#f8f9fa',
    TEXT_PRIMARY: '#1c1c1e',
    TEXT_SECONDARY: '#8e8e93',
    ROOM_MARKER: '#4CAF50',
    ROOM_MARKER_STROKE: '#2E7D32',
    ENTRANCE_MARKER: '#FF9800',
    ENTRANCE_MARKER_STROKE: '#F57C00',
    WHITE: '#FFFFFF',
    ERROR: '#FF3B30',
  },
  
  // Marker sizes
  MARKER_SIZE: 8,
  
  // Font sizes
  FONT_SIZES: {
    TITLE: 28,
    SUBTITLE: 18,
    BUTTON: 18,
    BODY: 16,
    CAPTION: 14,
  },
  
  // Animation durations
  ANIMATION_DURATION: 300,
  
  // Search debounce delay
  SEARCH_DEBOUNCE_DELAY: 300,
};