import { ReactElement, ReactNode } from "react";
import styled from "styled-components";
import Image from "next/image";

const Container = styled.div`
  display: flow-root;
  position: relative;
  height: fit-content;
`;

//TODO use image optimization with AVIF or use <picture>
const Background = styled(Image)`
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  min-width: calc(100vw - var(--scrollbar-width));
  min-height: 100vh;
  object-fit: cover;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin: 100px auto 0;

  @media (max-height: 640px) {
    margin: 20px auto 0;
  }
`;

export function AuthAndAccountSharedLayout({ children }: { children: ReactNode }) {
  return (
    <Container>
      <Background src="/img/bg/login.webp" width={2109} height={2422} sizes="100vw" alt="" quality={100} loading="eager" priority={true} />
      {children}
    </Container>
  );
}

export function getAuthSharedLayout(page: ReactElement): ReactElement {
  return (
    <AuthAndAccountSharedLayout>
      <Main>{page}</Main>
    </AuthAndAccountSharedLayout>
  );
}
