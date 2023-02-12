export const THEME = {
  background: {
    primary: "white",
    secondary: "#F8F9FA",
  },
  border: {
    primary: "#DADCE0",
  },
};
type ThemeType = typeof THEME;

declare module "styled-components" {
  // We are merging declaration with DefaultTheme from `styled-components`, to provide types of THEME everywhere
  // eslint-disable-next-line
  export interface DefaultTheme extends ThemeType {}
}
