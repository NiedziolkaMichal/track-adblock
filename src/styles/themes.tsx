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
  hero: {
    wordColors: ["#341bc1", "#383096", "#573096", "#9921b9", "#9321b9", "#b921ad"],
  },
  text: {
    heading: "#303030",
    primary: "#5F6368",
    secondary: "white",
    disabled: "#626262",
    invalid: "red",
  },
  background: {
    base: "linear-gradient(88deg, #F1F6F7, #f5efff)",
    baseLine: "#efe8ff",
    account: "#f1f6f7",
  },
  section: {
    explanation: {
      bg: "#efefef",
    },
    adBlocks: {
      bg: "#d72d2d",
      text: "#fff",
    },
    howItWorks: {
      text: "#d72d2d",
      liMarkerColor: "#f3f2fb",
      liMarkerBorder: "#d72d2d",
    },
    compatibility: {
      bg: "#303030",
      text: "#fff",
    },
    pricing: {
      text: "#303030",
    },
  },
  pricingCard: {
    ordinary: {
      text: "#303030",
      background: "#ffffff52",
      lightText: "#5f6368",
    },
    special: {
      text: "#fff",
      lightText: "#ffffffc0",
      link: {
        text: "#fff",
        bg: "#520856",
        bgHover: "#3b053d",
        focusVisible: "#fff",
      },
    },
    waistedHeading: {
      bg: "#c9c9c947",
    },
  },
  card: {
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
      focusVisible: "#b921ad",
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
  positionedLink: {
    focusVisible: "#fff",
  },
  textField: {
    background: "rgb(255,255,255,0.3)",
  },
  codeBlock: {
    background: "rgb(255,255,255,0.3)",
  },
  mobileMenuHr: "#f2d3ff",
  sideMenu: {
    background: "#edf1f4",
    hover: "#d9dddd",
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
  footer: {
    background: "#303030",
    text: "#d1d1d1",
  },
};
type ThemeType = typeof THEME;

declare module "styled-components" {
  // We are merging declaration with DefaultTheme from `styled-components`, to provide types of THEME everywhere
  // eslint-disable-next-line
  export interface DefaultTheme extends ThemeType {}
}
