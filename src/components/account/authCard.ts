import styled, { css } from "styled-components";
import { Card } from "./card";
import { ButtonPrimary } from "./button";
import { HrWithContent } from "../hrWithContent";

export const AuthCard = styled(Card)`
  display: flex;
  flex-wrap: wrap;
  gap: 35px;
  width: max-content;

  background: ${({ theme }) => theme.background.glass};
  --horizontal-padding: 45px;
  padding: 30px var(--horizontal-padding);
  margin: 0 10px;

  @media (max-width: calc(12rem + 188px)) {
    --horizontal-padding: 20px;
  }
  @media (max-width: calc(12.5rem + 130px)) {
    --horizontal-padding: 10px;
  }
  @media (max-width: calc(19rem + 600px)) {
    width: min-content;
    gap: 20px;
  }
`;

export const AuthCardContent = styled.div<{ $center?: boolean }>`
  max-width: 20rem;
  width: calc(100vw - var(--horizontal-padding) * 2 - var(--scrollbar-width) - 2px);
  ${({ $center }) =>
    $center &&
    css`
      margin-block: auto;
      text-align: center;
    `}
  }
`;

export const AuthCardButton = styled(ButtonPrimary)`
  width: 100%;
  margin-bottom: 15px;
  height: 3.1rem;
`;

export const AuthCardHrWithContent = styled(HrWithContent)`
  margin: 20px 0;
  color: ${({ theme }) => theme.text.primary};
`;
