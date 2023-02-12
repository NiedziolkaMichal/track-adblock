import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { THEME } from "../styles/themes";
import { GlobalStyle } from "../styles/global";
import { Header } from "../components/header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={THEME}>
        <GlobalStyle />
        <Header />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
