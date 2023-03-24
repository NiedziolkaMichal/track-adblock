import "../../styles/fonts.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { THEME } from "../styles/themes";
import { GlobalStyle } from "../styles/global";
import { ComponentType, ReactElement } from "react";
import { SessionProvider } from "next-auth/react";
import { ChatBot } from "../components/chatBot";
import { SharedMetaData } from "../components/metadata";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const getSharedLayout = isPageSharingLayout(Component) ? Component.getSharedLayout : (page: ReactElement) => page;

  return (
    <>
      <SharedMetaData />
      <ThemeProvider theme={THEME}>
        <SessionProvider session={session} refetchOnWindowFocus={false} refetchWhenOffline={false} refetchInterval={43200}>
          <GlobalStyle />
          {getSharedLayout(<Component {...pageProps} />)}
        </SessionProvider>
      </ThemeProvider>
      <ChatBot />
    </>
  );
}

function isPageSharingLayout<P>(c: ComponentType<P>): c is PageSharingLayout<P> {
  return !!(c as PageSharingLayout<P>).getSharedLayout;
}

type PageSharingLayout<P> = {
  getSharedLayout(page: ReactElement): ReactElement;
} & ComponentType<P>;
