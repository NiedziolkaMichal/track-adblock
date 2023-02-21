import { css } from "styled-components";

export const Margin = css<{ $margin?: MarginValue }>`
  ${({ $margin }) => $margin && processMargin($margin)}
`;

export type SingleValue = `${MarginPropertyAbbr}-${string}`;
/**
 * Allows to set margin of an element, by writing abbreviation of margin type, "-" and then expected value.
 * For example:
 * - `t-10px` is `margin-top: 10px`
 * - `bl-0` is `margin-block: 0`
 * - `in-auto r--10px` is `margin-inline: auto; margin-right: -10px`
 */
export type MarginValue = `${SingleValue}` | `${SingleValue} ${SingleValue}` | `${SingleValue} ${SingleValue} ${SingleValue}` | `${SingleValue} ${SingleValue} ${SingleValue} ${SingleValue}`;

type MarginPropertyAbbr = "t" | "r" | "b" | "l" | "in" | "bl";

function processMargin(margin: MarginValue) {
  return margin.split(" ").map((s) => parseSingleMarginProperty(s as SingleValue));
}

function parseSingleMarginProperty(margin: SingleValue) {
  const separatorIndex = margin.indexOf("-");

  const typeAbbr = margin.substring(0, separatorIndex) as MarginPropertyAbbr;
  const type = getMarginPropertyByAbbr(typeAbbr);
  const value = margin.substring(separatorIndex + 1);
  return `${type}: ${value};`;
}

function getMarginPropertyByAbbr(abbr: MarginPropertyAbbr) {
  switch (abbr) {
    case "t":
      return "margin-top";
    case "r":
      return "margin-right";
    case "b":
      return "margin-bottom";
    case "l":
      return "margin-left";
    case "bl":
      return "margin-block";
    case "in":
      return "margin-inline";
    default:
      throw new Error(`Invalid margin type "${abbr}"`);
  }
}
