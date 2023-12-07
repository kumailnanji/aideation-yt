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
  const svg = await promisifiedParseString(svgContent);
  if (svg?.svg?.defs && svg.svg.defs[0]?.style) {
    svg.svg.defs[0].style[0] = setColorInStyle(svg.svg.defs[0].style[0], color);
  }
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
  const builder = new Builder();
  return builder.buildObject(svg);
};

export const generateAllVersions = async (svgMapping) => {
  const keys = Object.keys(svgMapping);
  let results = {};

  for (let key of keys) {
    results[`${key}_white`] = await changeSVGColor(svgMapping[key], "#FFFFFF");
    results[`${key}_black`] = await changeSVGColor(svgMapping[key], "#000000");
    results[`${key}_color`] = svgMapping[key];  // original color version
  }
  
  return results;
};

export const extractSVGColors = async (svgContent) => {
  const svg = await promisifiedParseString(svgContent);
  let colors = [];

  const collectColorsFromStyle = (style) => {
    const fillMatches = style.match(/fill:([^;]+);/);
    const strokeMatches = style.match(/stroke:([^;]+);/);

    if (fillMatches && fillMatches[1] && fillMatches[1] !== "none") {
      addUniqueColor(fillMatches[1]);
    }
    if (strokeMatches && strokeMatches[1]) {
      addUniqueColor(strokeMatches[1]);
    }
  };

  const addUniqueColor = (color) => {
    if (!colors.includes(color)) {
      colors.push(color);
    }
  };

  if (svg?.svg?.defs && svg.svg.defs[0]?.style) {
    collectColorsFromStyle(svg.svg.defs[0].style[0]);
  }

  if (svg?.svg?.path) {
    svg.svg.path.forEach((path) => {
      if (path.$.fill && path.$.fill !== "none") {
        addUniqueColor(path.$.fill);
      }
      if (path.$.stroke) {
        addUniqueColor(path.$.stroke);
      }
      if (path.$.style) {
        collectColorsFromStyle(path.$.style);
      }
    });
  }

  colors = colors.filter(color => /^#[0-9A-Fa-f]{3,6}$/.test(color));

  return colors;
};

