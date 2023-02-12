import styled from "styled-components";

const Base = styled.header`
  background-color: ${({ theme }) => theme.background.primary};
  border-bottom: 1px solid ${({ theme }) => theme.border.primary};
`;

export function Header() {
  return <Base></Base>;
}
