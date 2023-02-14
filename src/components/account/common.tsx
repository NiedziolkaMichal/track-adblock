import styled from "styled-components";

export const H1 = styled.h1`
  font-size: 1.25rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text.heading};
  margin-bottom: 30px;
`;
