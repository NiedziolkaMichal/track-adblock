import styled from "styled-components";
import { ReactNode } from "react";

const Base = styled.div`
  background-color: ${({ theme }) => theme.background.primary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: 8px;
  color: ${({ theme }) => theme.text.heading};
`;

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <Base className={className}>{children}</Base>;
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

export function CardH2({ className, headingContent, innerPadding, children }: { className?: string; headingContent: ReactNode; innerPadding?: boolean; children: ReactNode }) {
  return (
    <Base className={className}>
      <Heading>{headingContent}</Heading>
      {innerPadding && <InnerPadding>{children}</InnerPadding>}
      {!innerPadding && children}
    </Base>
  );
}
