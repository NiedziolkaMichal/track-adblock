import styled from "styled-components";
//TODO rename
const Base = styled.div`
  width: 55px;
  height: 100%;
  background-color: ${({ theme }) => theme.background.secondary};
  border-right: 1px solid ${({ theme }) => theme.border.primary};
`;

export function SideMenu() {
  return <Base></Base>;
}
