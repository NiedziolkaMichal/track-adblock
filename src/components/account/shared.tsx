import styled from "styled-components";
import { SideMenu } from "./sideMenu";
import { AccountMain } from "./accountMain";
import { ReactNode } from "react";

const BaseStructure = styled.div`
  display: grid;
  grid-template: 1fr / 55px 1fr;
`;

export function AccountBase({ children }: { children: ReactNode }) {
  return (
    <BaseStructure>
      <SideMenu />
      <AccountMain>{children}</AccountMain>
    </BaseStructure>
  );
}
