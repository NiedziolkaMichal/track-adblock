import styled from "styled-components";
import { LinkSecondary } from "./button";

export const H1 = styled.h1`
  font-size: 1.25rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text.heading};
  margin-bottom: 30px;
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
