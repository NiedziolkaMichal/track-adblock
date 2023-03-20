import styled from "styled-components";
import { Margin, MarginValue } from "../margin";

export const H1 = styled.h1<{ $margin?: MarginValue }>`
  font-size: min(6vw, 1.5rem);
  line-height: 1.5;
  font-weight: 510;
  color: ${({ theme }) => theme.text.heading};
  ${Margin}
`;

export const MeasurementCardSides = styled.div`
  display: flex;
  justify-content: space-between;
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

export const ButtonList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;
