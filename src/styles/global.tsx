import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  html {
    text-size-adjust: 100%;
    scrollbar-gutter: stable;
  }
  * {
    font-family: MonserratMini, sans-serif;
  }
  body, p {
    margin: 0;
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
  
  html {
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.gradient.primary.color_1} transparent;
    --scrollbar-width: 0px;
  }
  @supports (selector(::-webkit-scrollbar)) {
    html {
      --scrollbar-width: 7px;
    }
  }
  ::-webkit-scrollbar {
    width: 7px;
  }
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, ${({ theme }) => theme.gradient.primary.color_1}, ${({ theme }) => theme.gradient.primary.color_2});
  }
`;

export const BaseBackground = createGlobalStyle`
  body {
    --body-bg-line: ${({ theme }) => theme.background.baseLine};
    --body-bg: ${({ theme }) => theme.background.base};
    background: repeating-linear-gradient(178deg, var(--body-bg-line) 1px, transparent 2px 83px, var(--body-bg-line) 84px), repeating-linear-gradient(88deg, var(--body-bg-line) 1px, transparent 2px 83px, var(--body-bg-line) 84px), var(--body-bg);
  }
`;

export const AccountBackground = createGlobalStyle`
  body {
    --body-bg: ${({ theme }) => theme.background.account};
  }
`;
