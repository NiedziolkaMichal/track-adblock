import styled from "styled-components";
import { ReactNode, useRef } from "react";
import { useOnHover } from "../hooks/webHooks";

export function Tooltip({ tooltip, className, children }: { tooltip: ReactNode; className?: string; children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useOnHover(
    containerRef,
    () => {
      if (containerRef.current && tooltipRef.current) {
        tooltipRef.current.style.display = "block";
      }
    },
    () => {
      if (containerRef.current && tooltipRef.current) {
        tooltipRef.current.style.display = "none";
      }
    }
  );

  return (
    <Container ref={containerRef} className={className}>
      {children}
      <StyledTooltip ref={tooltipRef}>
        <Box>{tooltip}</Box>
      </StyledTooltip>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
`;

const Box = styled.div`
  background-color: ${({ theme }) => theme.tooltip.background};
  padding: 9px 12px;
  border: 1px solid ${({ theme }) => theme.border.primary};
  box-shadow: 0 0 5px ${({ theme }) => theme.border.primary};
  font-size: 0.85rem;
`;

const StyledTooltip = styled.div`
  display: none;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: max-content;
  max-width: min(320px, 70vw);
`;

export const QuestionWithTooltip = styled(Tooltip)`
  width: fit-content;
  margin-left: auto;
`;
