export const THEME = {
  gradient: {
    primary: {
      color_1: "#341bc1",
      color_2: "#b921ad",
      image: "linear-gradient(164deg, #341bc1, #b921ad)",
      text: "white",
      focusVisible: "#b921ad",
    },
  },
  text: {
    heading: "#303030",
    primary: "#5F6368",
    secondary: "white",
    disabled: "#626262",
    invalid: "red",
  },
  background: {
    secondary: "#F8F9FA",
    glass: "#ffffff57",
    tab: "#a6aac310",
  },
  border: {
    primary: "#DADCE0",
    intense: "#6c6c6c",
    selected: "#1A73E8",
  },
  button: {
    primary: {
      background: "#48349f",
      backgroundHover: "#2c1b75",
      text: "#F8F9FA",
      focusVisible: "#48349f",
    },
    secondary: {
      background: "#b921ad",
      backgroundHover: "#93148d",
      text: "#F8F9FA",
      focusVisible: "#b921ad",
    },
    anchor: {
      text: "#1A73E8",
      textHover: "#0a4ba8",
      focusVisible: "#1A73E8",
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
  textField: {
    background: "rgb(255,255,255,0.3)",
  },
  codeBlock: {
    background: "rgb(255,255,255,0.3)",
  },
  sideMenu: {
    background: "#edf1f4",
    hover: "#d9dddd",
    focusVisible: "#303030",
  },
  errorBlock: {
    background: "crimson",
    text: "white",
  },
  errorInline: {
    text: "crimson",
  },
  tooltip: {
    background: "rgb(255,255,255,0.92)",
  },
  graph: {
    line: "#00000014",
    tick: "#a4a4a4",
    requests: {
      all: "black",
      ordinary: "#041db9",
      unblocked: "#008aff",
    },
  },
};
type ThemeType = typeof THEME;

declare module "styled-components" {
  // We are merging declaration with DefaultTheme from `styled-components`, to provide types of THEME everywhere
  // eslint-disable-next-line
  export interface DefaultTheme extends ThemeType {}
}
