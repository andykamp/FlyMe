import React from "react";

// ---------------------------------------------
// Helper functions
// ---------------------------------------------

export function addAlpha(color: string, opacity: number) {
  // coerce values so ti is between 0 and 1.
  var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
}

// ---------------------------------------------
// Colors
// ---------------------------------------------

// font
export const fontFamily = "Poppins";
export const fontSizeTitle = "22px";
export const fontSize = "16px";

// accent
export const accentBlue = "#189FFB";
export const accentPink = "#F531B3";
export const accentPurple = "#7B61FF";
export const accentGreen = "#31c9c9";
export const accentYellow = "#FDFF9F";

// success, warning and error
export const success = "#03DAC5";
export const successBg = addAlpha(success, 0.3);
export const warning = "#FDFF9F";
export const warningBg = addAlpha(warning, 0.3);
export const error = "#ED7498";
export const errorBg = addAlpha(error, 0.3);

// header
export const headerBg = "#000000";

// list
export const listBg = "#151A1E";
export const listBgLT = "#151A1E";
export const listItemAltBg = "#1D2125";
export const listItemAltBgLT = "#1D2125";

// panel
export const panelBg = "#151A1E";
export const panelBgLT = "#151A1E";

// general
export const appBorderRadius = 0;
export const appGapSize = 8;

export const bg = "#070B0D";
export const bgLT = "#FFFFFF";

export const titleColor = "#E8EBED";
export const titleColorLT = "#5E6067";

export const textColor = "#A4A8AD";
export const textColorLT = "#5E6067";

// ---------------------------------------------
// Actual theme interface and theme
// ---------------------------------------------

export interface ThemeInterface {
  // name of theme
  base: string;
  //
  accent: {
    blue: string;
    pink: string;
    purple: string;
    green: string;
    yellow: string;
  };
  status: {
    success: string;
    successBg: string;
    warning: string;
    warningBg: string;
    error: string;
    errorBg: string;
  };
  header: {
    headerBg: string;
  };
  list: {
    listBg: string;
    listItemAltB: string;
  };
  general: {
    fontFamily: string;
    fontSize: string;
    fontSizeTitle: string;
    bg: string;
    panelBg: string;
    titleColor: string;
    textColor: string;
  };
}

export const themeNew = {
  // name of theme
  base: "dark",
  //
  accent: {
    blue: accentBlue,
    pink: accentPink,
    purple: accentPurple,
    green: accentGreen,
    yellow: accentYellow,
  },
  status: {
    success,
    successBg,
    warning,
    warningBg,
    error,
    errorBg,
  },
  header: {
    headerBg,
  },
  list: {
    listBg,
    listItemAltBg,
  },
  general: {
    fontFamily,
    fontSize,
    fontSizeTitle,
    bg,
    panelBg,
    titleColor,
    textColor,
  },
};

export const themeNewLT = Object.assign({}, themeNew, {
  // name of theme
  base: "light",
  //
  list: {
    listBg: listBgLT,
    listItemAltBg: listItemAltBgLT,
  },
  general: {
    fontFamily,
    fontSize,
    fontSizeTitle,
    bg: bgLT,
    panelBg: panelBgLT,

    titleColor: titleColorLT,
    textColor: textColorLT,
  },
});

// ---------------------------------------------
// Theme function
// ---------------------------------------------

export const availableThemes = {
  dark: themeNew,
  light: themeNewLT,
};

// Function to obtain the intended theme
export const getTheme = (themeName: "dark" | "light") => {
  if (!availableThemes[themeName]) throw "Theme does not exist...";
  return availableThemes[themeName];
};

export const ThemeContext = React.createContext(
  availableThemes.dark // default value
);
