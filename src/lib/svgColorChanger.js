// lib/svgColorChanger.js

import { parseString, Builder } from "xml2js";
import { promisify } from "util";

// Promisify parseString from xml2js
const promisifiedParseString = promisify(parseString);

const setColorInStyle = (style, color) => {
  return style
    .replace(/(fill:)[^;]+;/g, `$1${color};`)
    .replace(/(stroke:)[^;]+;/g, `$1${color};`);
};

export const changeSVGColor = async (svgContent, color) => {
  // Parse the SVG content string into a JS object
  const svg = await promisifiedParseString(svgContent);

  // Modify the color of elements using style tags
  if (svg?.svg?.defs && svg.svg.defs[0]?.style) {
    svg.svg.defs[0].style[0] = setColorInStyle(svg.svg.defs[0].style[0], color);
  }

  // Check and change colors in paths
  if (svg?.svg?.path) {
    svg.svg.path.forEach((path) => {
      if (path.$.fill && path.$.fill !== "none") {
        path.$.fill = color;
      }
      if (path.$.stroke) {
        path.$.stroke = color;
      }
      if (path.$.style) {
        path.$.style = setColorInStyle(path.$.style, color);
      }
    });
  }

  // Convert the modified SVG JS object back to string representation
  const builder = new Builder();
  return builder.buildObject(svg);
};

export const generateBWVersions = async (svgContent) => {
  const blackVersion = await changeSVGColor(svgContent, "#000000");
  const whiteVersion = await changeSVGColor(svgContent, "#FFFFFF");
  const extractedColor = await extractSVGColors(svgContent);
  //   console.log("extractedColor", extractedColor)

  return {
    original: svgContent,
    black: blackVersion,
    white: whiteVersion,
    extractedColor: extractedColor,
  };
};

export const extractSVGColors = async (svgContent) => {
  const svg = await promisifiedParseString(svgContent);
  let colors = new Set(); // Using a Set ensures unique values

  const collectColorsFromStyle = (style) => {
    const fillMatches = style.match(/fill:([^;]+);/);
    const strokeMatches = style.match(/stroke:([^;]+);/);

    if (fillMatches && fillMatches[1] && fillMatches[1] !== "none") {
      colors.add(fillMatches[1]);
    }
    if (strokeMatches && strokeMatches[1]) {
      colors.add(strokeMatches[1]);
    }
  };

  // Collect colors from style tags
  if (svg?.svg?.defs && svg.svg.defs[0]?.style) {
    collectColorsFromStyle(svg.svg.defs[0].style[0]);
  }

  // Collect colors from paths
  if (svg?.svg?.path) {
    svg.svg.path.forEach((path) => {
      if (path.$.fill && path.$.fill !== "none") {
        colors.add(path.$.fill);
      }
      if (path.$.stroke) {
        colors.add(path.$.stroke);
      }
      if (path.$.style) {
        collectColorsFromStyle(path.$.style);
      }
    });
  }

  //   // Convert the Set back to an array
  //   return Array.from(colors).filter((color) =>
  //     /^#[0-9A-Fa-f]{3,6}$/.test(color)
  //   );

  // Filter the Set in-place to retain only hex color values
  for (let color of colors) {
    if (!/^#[0-9A-Fa-f]{3,6}$/.test(color)) {
      colors.delete(color);
    }
  }

  return colors;
};
