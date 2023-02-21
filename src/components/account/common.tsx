import styled from "styled-components";
import { LinkSecondary } from "./button";
import { Margin, MarginValue } from "../margin";

export const H1 = styled.h1<{ $margin?: MarginValue }>`
  font-size: 1.25rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text.heading};
  ${Margin}
`;

export const MeasurementCardSides = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const QuestionLink = styled(LinkSecondary)`
  margin-left: auto;

  :first-child {
    margin-top: -10px;
  }
`;

export const ErrorBox = styled.div<{ $margin?: MarginValue }>`
  background-color: ${({ theme }) => theme.errorBlock.background};
  color: ${({ theme }) => theme.errorBlock.text};
  padding: 8px;
  text-align: center;
  border-radius: 5px;
  font-size: 0.85rem;
  font-weight: 550;
  ${Margin}
`;

export const ErrorInline = styled.strong`
  color: ${({ theme }) => theme.errorInline.text};
  font-size: 0.8rem;
`;
