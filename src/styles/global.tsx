import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  html {
    text-size-adjust: 100%;
  }
  * {
    font-family: MonserratMini, sans-serif;
  }
  body, p {
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
  p {
    font-size: 0.9rem;
    font-weight: 440;
  }
  a {
    text-decoration: none;
  }
  strong {
    font-weight: 620;
  }
  button {
    cursor: pointer;
    border: none;
    padding: 0;
    background: none;
  }
`;
