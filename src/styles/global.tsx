import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  html {
    text-size-adjust: 100%;
  }
  body {
    margin: 0;
  }
  #__next {
    min-height: 100vh;
    display: grid;
    grid-template: 4rem / 1fr;
  }
  *, *::before, *::after {
    box-sizing: border-box;
  }
`;
