export const THEME = {
  text: {
    heading: "#202124",
    primary: "#5F6368",
    secondary: "white",
    light: "#989898",
  },
  background: {
    primary: "white",
    secondary: "#F8F9FA",
  },
  border: {
    primary: "#DADCE0",
  },
  selected: {
    fore: "#1A73E8",
    light: "#F5F5F5",
    back: "white",
  },
  graph: {
    line: "#00000014",
    tick: "#a4a4a4",
    requests: {
      all: "black",
      ordinary: "#1a73e8",
      unblocked: "#37c8df",
    },
  },
};
type ThemeType = typeof THEME;

declare module "styled-components" {
  // We are merging declaration with DefaultTheme from `styled-components`, to provide types of THEME everywhere
  // eslint-disable-next-line
  export interface DefaultTheme extends ThemeType {}
}
