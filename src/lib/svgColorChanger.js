// utils/svgColorChanger.js

import { parseString, Builder } from "xml2js";

const setColorInStyle = (style, color) => {
  return style
    .replace(/fill:.*?;/, `fill:${color};`)
    .replace(/stroke:.*?;/, `stroke:${color};`);
};

export const changeSVGColor = async (svgContent, color) => {
  const parser = new parseString.Promise();

  const svg = await parser(svgContent);

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

  // Convert back to string representation
  const builder = new Builder();
  return builder.buildObject(svg);
};

export const generateBWVersions = async (svgContent) => {
  const blackVersion = await changeSVGColor(svgContent, "#000000");
  const whiteVersion = await changeSVGColor(svgContent, "#FFFFFF");

  return {
    original: svgContent,
    black: blackVersion,
    white: whiteVersion,
  };
};
