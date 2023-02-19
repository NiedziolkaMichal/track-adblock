import styled from "styled-components";
import { ReactNode } from "react";

const Container = styled.div`
  display: flex;
`;

const Hr = styled.hr`
  flex: 1 1 auto;
  border: none;
  border-top: 1px solid #dadce0;
`;

const ContentContainer = styled.div`
  padding: 0 10px;
`;

export function HrWithContent({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <Container className={className}>
      <Hr />
      <ContentContainer>{children}</ContentContainer>
      <Hr />
    </Container>
  );
}
