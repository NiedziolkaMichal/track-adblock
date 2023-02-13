import styled from "styled-components";
import { SideMenu } from "./sideMenu";
import { AccountMain } from "./accountMain";
import { ReactElement, ReactNode } from "react";

const BaseStructure = styled.div`
  display: grid;
  grid-template: 1fr / 55px 1fr; // 55px is used in sideMenu and account/index
`;

export function AccountBase({ children }: { children: ReactNode }) {
  return (
    <BaseStructure>
      <SideMenu />
      <AccountMain>{children}</AccountMain>
    </BaseStructure>
  );
}

export function getAccountSharedLayout(page: ReactElement): ReactElement {
  return <AccountBase>{page}</AccountBase>;
}
