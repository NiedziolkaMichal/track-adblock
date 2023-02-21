import styled from "styled-components";
import { ReactNode } from "react";
import { Margin, MarginValue } from "../margin";

const Base = styled.div<{ $margin?: MarginValue }>`
  background-color: ${({ theme }) => theme.background.primary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: 8px;
  color: ${({ theme }) => theme.text.heading};
  ${Margin}
`;

export function Card({ className, $margin, children }: { className?: string; $margin?: MarginValue; children: ReactNode }) {
  return (
    <Base className={className} $margin={$margin}>
      {children}
    </Base>
  );
}

const Heading = styled.h2`
  padding: 20px 25px;
  margin: 0;
  border-bottom: 1px solid ${({ theme }) => theme.border.primary};
  font-size: 1rem;
  font-weight: 600;
`;

const InnerPadding = styled.div`
  padding: 20px 25px 25px;
`;

export function CardH2({ className, headingContent, innerPadding, $margin, children }: { className?: string; headingContent: ReactNode; innerPadding?: boolean; $margin?: MarginValue; children: ReactNode }) {
  return (
    <Base className={className} $margin={$margin}>
      <Heading>{headingContent}</Heading>
      {innerPadding && <InnerPadding>{children}</InnerPadding>}
      {!innerPadding && children}
    </Base>
  );
}

export const CardCodeBlock = styled.pre<{ $margin?: MarginValue }>`
  background-color: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  padding: 10px;
  border-radius: 4px;
  ${Margin}
`;
