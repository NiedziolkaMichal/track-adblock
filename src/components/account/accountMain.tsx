import styled from "styled-components";
import { ReactNode } from "react";

const Main = styled.main`
  background-color: ${({ theme }) => theme.background.secondary};
`;
export function AccountMain({ children }: { children: ReactNode }) {
  return <Main>{children}</Main>;
}
