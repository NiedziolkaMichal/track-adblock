import styled from "styled-components";
import { ReactNode } from "react";

export const CardDiv = styled.div`
  background-color: ${({ theme }) => theme.background.primary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: 8px;
  color: ${({ theme }) => theme.text.heading};
`;
export function Card({ children }: { children: ReactNode }) {
  return <CardDiv>{children}</CardDiv>;
}
