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
export const fontFamily = "Roboto";
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

export const grey1 = "#4A4B52";
export const grey1LT = "#DADADA";

export const grey2 = addAlpha(grey1, 0.4);
export const grey2LT = addAlpha(grey1LT, 0.1);

export const greySelection = addAlpha(grey1, 0.3);
export const greySelectionLT = addAlpha(grey1LT, 0.1);

export const greySelectionHover = addAlpha(grey1, 0.2);
export const greySelectionHoverLT = addAlpha(grey1, 0.05);

export const greyDisabled = addAlpha("#B1B1B4", 0.5);
export const greyDisabledLT = "#B1B1B4";

export const textColorContrast = "#FFFFFF";
export const textColorContrastLT = "#000000";

// mouse
export const mouseBG = "#000000";
export const mouseBorder = "#FFFFFF";

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
    appBorderRadius: string;
    appGapSize: string;
    bg: string;
    panelBg: string;
    titleColor: string;
    textColor: string;
    grey1: string;
    grey2: string;
    greySelection: string;
    greySelectionHover: string;
    greyDisabled: string;
    textColorContrast: string;
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
    appBorderRadius,
    appGapSize,
    bg,
    panelBg,
    titleColor,
    textColor,
    grey1,
    grey2,
    greySelection,
    greySelectionHover,
    greyDisabled,
    textColorContrast,
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
    appBorderRadius,
    appGapSize,
    bg: bgLT,
    panelBg: panelBgLT,

    titleColor: titleColorLT,
    textColor: textColorLT,
    grey1: grey1LT,
    grey2: grey2LT,
    greySelection: greySelectionLT,
    greySelectionHover: greySelectionHoverLT,
    greyDisabled: greyDisabledLT,
    textColorContrast: textColorContrastLT,
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
