// src/lib/colorUtils.ts

/**
 * Converts a hex color string to an HSL object.
 * @param hex - The hex color string (e.g., "#RRGGBB" or "#RGB").
 * @returns An object with h, s, l properties, or null if invalid hex.
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  if (!hex || typeof hex !== 'string') {
    return null;
  }

  let r = 0, g = 0, b = 0;

  // Handle #RGB format
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } 
  // Handle #RRGGBB format
  else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  } 
  else {
    return null; // Invalid hex format
  }

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return { h, s, l };
}

/**
 * Converts HSL values to a CSS HSL string (e.g., "200 80% 60%").
 * @param h - Hue (0-360).
 * @param s - Saturation (0-100).
 * @param l - Lightness (0-100).
 * @returns A string in "H S% L%" format.
 */
export function hslToString(h: number, s: number, l: number): string {
  return `${h} ${s}% ${l}%`;
}