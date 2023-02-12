export const THEME = {
  text: {
    primary: "#5F6368",
    secondary: "white",
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
};
type ThemeType = typeof THEME;

declare module "styled-components" {
  // We are merging declaration with DefaultTheme from `styled-components`, to provide types of THEME everywhere
  // eslint-disable-next-line
  export interface DefaultTheme extends ThemeType {}
}
