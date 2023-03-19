export const THEME = {
  gradient: {
    primary: {
      color_1: "#341bc1",
      color_2: "#b921ad",
      image: "linear-gradient(164deg, #341bc1, #b921ad)",
    },
  },
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
    glass: "#ffffff57",
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
    negligible: {
      text: "#5F6368",
      textHover: "#444444",
    },
    gitHub: {
      background: "#303030",
      backgroundHover: "#444444",
      focusVisibleOutline: "#28f946",
      text: "white",
    },
    google: {
      background: "white",
      backgroundHover: "#F8F9FA",
      text: "#202124",
    },
    trackAdBlock: {
      background: "#ffd346",
      backgroundHover: "#ffca2e",
      text: "#202124",
    },
  },
  selected: {
    fore: "#F9AB00",
    foreHover: "#ffb31a",
    light: "#e7e7e7",
    back: "white",
  },
  errorBlock: {
    background: "crimson",
    text: "white",
  },
  errorInline: {
    text: "crimson",
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
