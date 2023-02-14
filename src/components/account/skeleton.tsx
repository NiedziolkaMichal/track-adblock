import styled from "styled-components";
import { SideMenu } from "./sideMenu";
import { ReactElement, ReactNode } from "react";

const BaseStructure = styled.div`
  display: grid;
  grid-template: 1fr / 55px 1fr; // 55px is used in sideMenu and account/index
`;

const MainBackground = styled.div`
  background-color: ${({ theme }) => theme.background.secondary};
`;

const Main = styled.main`
  padding: 2rem 40px 0;
  // RequestsChart required fixed width in order to be resized correctly with the viewport
  width: calc(100vw - 55px); // 55px is width of a side menu
  max-width: 1280px;
  margin: 0 auto;
`;

export function AccountBase({ children }: { children: ReactNode }) {
  return (
    <BaseStructure>
      <SideMenu />
      <MainBackground>
        <Main>{children}</Main>
      </MainBackground>
    </BaseStructure>
  );
}

export function getAccountSharedLayout(page: ReactElement): ReactElement {
  return <AccountBase>{page}</AccountBase>;
}