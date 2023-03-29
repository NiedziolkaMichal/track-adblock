import Script from "next/script";
import { createGlobalStyle } from "styled-components";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function ChatBot() {
  const router = useRouter();
  const pageHasFooter = !router.pathname.match(/^\/[a-z]/i);
  const closeToFooter = useIsCloseToFooter();
  return (
    <>
      <Styles $adjustForFooter={pageHasFooter && closeToFooter} />
      <Script strategy="afterInteractive" src={process.env.NEXT_PUBLIC_TIDIO_URL} async />
    </>
  );
}

function useIsCloseToFooter() {
  const [closeToFooter, setCloseToFooter] = useState(false);

  useEffect(() => {
    const listener = () => {
      const fullHeight = document.body.clientHeight;
      const bottomScrollPosition = window.scrollY + window.innerHeight;
      const newCloseToFooter = fullHeight - bottomScrollPosition < 100;
      if (closeToFooter !== newCloseToFooter) {
        enableTransitions();
        setCloseToFooter(newCloseToFooter);
      }
    };
    addEventListener("scroll", listener);
    return () => removeEventListener("scroll", listener);
  }, [closeToFooter, setCloseToFooter]);

  return closeToFooter;
}

/**
 * Removes `transition: none 0s ease 0s !important;` declaration from the chat iframe
 */
function enableTransitions() {
  const chat = document.querySelector<HTMLIFrameElement>("#tidio-chat-iframe");
  if (chat) {
    chat.style.transition = "all";
  }
}

const Styles = createGlobalStyle<{ $adjustForFooter: boolean }>`
  #tidio-chat-iframe {
    transition: bottom 0.5s ease-out !important;
    bottom: ${({ $adjustForFooter }) => ($adjustForFooter ? "75px" : "20px")} !important;
  }
`;
