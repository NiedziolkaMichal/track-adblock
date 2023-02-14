export const THEME = {
  text: {
    heading: "#202124",
    primary: "#5F6368",
    secondary: "white",
    light: "#989898",
    disabled: "#626262",
    invalid: "red",
  },
  background: {
    primary: "white",
    secondary: "#F8F9FA",
  },
  border: {
    primary: "#DADCE0",
    intense: "#6c6c6c",
    selected: "#1A73E8",
  },
  button: {
    primary: {
      background: "#1A73E8",
      backgroundHover: "#1B66CA",
      text: "#F8F9FA",
    },
    secondary: {
      text: "#1A73E8",
      textHover: "#1B66CA",
      backgroundHover: "#F6FAFE",
    },
    valid: {
      background: "#3ba12f",
      backgroundHover: "#368c2b",
      text: "#F8F9FA",
    },
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
