import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { THEME } from "../styles/themes";
import { GlobalStyle } from "../styles/global";
import { Header } from "../components/header";
import { ComponentType, ReactElement } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const getSharedLayout = isPageSharingLayout(Component) ? Component.getSharedLayout : (page: ReactElement) => page;

  return (
    <>
      <ThemeProvider theme={THEME}>
        <GlobalStyle />
        <Header />
        {getSharedLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </>
  );
}

function isPageSharingLayout<P>(c: ComponentType<P>): c is PageSharingLayout<P> {
  return !!(c as PageSharingLayout<P>).getSharedLayout;
}

type PageSharingLayout<P> = {
  getSharedLayout(page: ReactElement): ReactElement;
} & ComponentType<P>;
