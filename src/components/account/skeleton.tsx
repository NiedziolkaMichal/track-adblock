import styled from "styled-components";
import { SideMenu } from "./sideMenu";
import { ReactElement, ReactNode } from "react";
import { Header } from "../header";
import { AuthAndAccountSharedLayout } from "../auth";

const BaseStructure = styled.div`
  display: grid;
  grid-template: 1fr / 240px 1fr;

  @media (max-width: 1200px) {
    grid-template: 1fr / 55px 1fr;
  }
  // It's repeated in sideMenu.tsx
  @media (max-width: calc(29rem + 85px)) {
    display: block;
  }
`;

const MainBackground = styled.div`
  display: flex;
`;

const Main = styled.main`
  padding: 8px 40px 0;
  // RequestsChart required fixed width in order to be resized correctly with the viewport
  width: calc(100vw - 240px - var(--scrollbar-width));
  max-width: 1280px;
  margin-left: auto;

  @media (max-width: 1200px) {
    width: calc(100vw - 55px - var(--scrollbar-width));
  }
  @media (max-width: calc(29rem + 85px)) {
    width: 100%;
    padding: 8px 10px 0;
  }
`;

const UnevenMargin = styled.div`
  flex-grow: 0.7;
  @media (max-width: 1280px) {
    flex-grow: 0;
  }
`;

export function AccountBase({ children }: { children: ReactNode }) {
  return (
    <AuthAndAccountSharedLayout>
      <Header />
      <BaseStructure>
        <SideMenu />
        <MainBackground>
          <Main>{children}</Main>
          <UnevenMargin />
        </MainBackground>
      </BaseStructure>
    </AuthAndAccountSharedLayout>
  );
}

export function getAccountSharedLayout(page: ReactElement): ReactElement {
  return <AccountBase>{page}</AccountBase>;
}
