import { createTheme } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "Quicksand, sans-serif",
    fontWeightLight: 200, // Corresponds to <weight> 200
    fontWeightRegular: 500, // Corresponds to <weight> 400
    fontWeightBold: 700, // Corresponds to <weight> 700
  },
  palette: {
    primary: { main: "#02B2AF" },
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "contained", disableElevation: true },
          style: {
            color: "white",
          },
        },
      ],
    },
  },
});

export const generatePalette = (count, baseColor = null) => {
  let hue;
  let saturation = 100;

  // If no base color is provided, generate a random hue between 0 and 359
  if (!baseColor) {
    hue = Math.floor(Math.random() * 360); // Random hue between 0 and 359
  } else {
    // Convert the provided base HEX color to HSL to get the hue
    const baseHSL = hexToHsl(baseColor);
    hue = baseHSL.h;
    saturation = baseHSL.s;
  }

  let lightness = 40;
  const palette = [];

  for (let i = 0; i < count; i++) {
    // Add the HSL color to the palette
    palette.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);

    // Increment lightness by 10%
    lightness += 10;

    if (lightness >= 80) {
      lightness = 70;
      hue = (hue - 10 + 360) % 360; // Ensure hue stays between 0 and 359
    }
  }

  return palette;
};

// Helper function to convert HEX to HSL
const hexToHsl = (hex) => {
  hex = hex.replace(/^#/, "");

  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  r /= 255;
  g /= 255;
  b /= 255;

  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
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
      default:
        break;
    }
    h *= 60;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

export default theme;
