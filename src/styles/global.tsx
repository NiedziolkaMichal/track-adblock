import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  html {
    text-size-adjust: 100%;
    font-family: OpenSansMini, sans-serif;//TODO pick more appropriate fallbacks
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
  a {
    text-decoration: none;
  }
  
  @font-face {
    src: url("/font/OpenSansVar.ttf");
    font-family: OpenSansMini;
    font-weight: 1 1000;
    font-stretch: 1% 200%;
    font-style: normal;
    font-display: block;
  }
`;
