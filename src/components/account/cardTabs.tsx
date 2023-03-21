import styled, { css } from "styled-components";
import React, { ReactNode } from "react";

export const CardTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export function CardTab({ title, value, roundedBottom = false, valueColor }: { title: ReactNode; value: ReactNode; roundedBottom?: boolean; valueColor: string }) {
  return (
    <StyledCardTab roundedBottom={roundedBottom}>
      <CardTabTitle>{title}</CardTabTitle>
      <CardTabValue color={valueColor}>{value}</CardTabValue>
    </StyledCardTab>
  );
}

const StyledCardTab = styled.div<{ roundedBottom?: boolean }>`
  color: ${({ theme }) => theme.text.primary};
  padding: 20px;
  font-size: 0.9rem;
  font-weight: 500;

  ${({ roundedBottom }) =>
    roundedBottom &&
    css`
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    `}

  :first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  :hover {
    background-color: ${({ theme }) => theme.card.tab};
  }
`;

const CardTabTitle = styled.div`
  line-height: 1.5;
`;

const CardTabValue = styled.div<{ color: string }>`
  font-size: 1.4rem;
  margin-top: 7px;
  color: ${({ theme }) => theme.graph.requests.all};
`;
