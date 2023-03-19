import styled from "styled-components";
import { SideMenu } from "./sideMenu";
import { ReactElement, ReactNode } from "react";
import { Header } from "../header";
import { AuthAndAccountSharedLayout } from "../auth";

const BaseStructure = styled.div`
  display: grid;
  grid-template: 1fr / minmax(55px, 240px) 1fr; // 55px is used in sideMenu and account/index
`;

const MainBackground = styled.div`
  display: flex;
`;

const Main = styled.main`
  padding: 8px 40px 0 0;
  // RequestsChart required fixed width in order to be resized correctly with the viewport
  width: calc(100vw - 55px); // 55px is width of a side menu
  max-width: 1280px;
  margin-left: auto;
`;

const UnevenMargin = styled.div`
  flex-grow: 0.7;
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
