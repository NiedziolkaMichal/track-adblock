import styled from "styled-components";
import { Margin, MarginValue } from "./margin";

export const SectionContent = styled.div<{ $gap?: string; $margin?: MarginValue; $alignItems?: string; $wrapReverse?: boolean }>`
  display: flex;
  flex-wrap: ${({ $wrapReverse }) => ($wrapReverse ? "wrap-reverse" : "wrap")};
  justify-content: center;
  align-items: ${({ $alignItems }) => $alignItems || "center"};
  gap: ${({ $gap }) => $gap || 0};
  margin: auto;
  padding: 0 20px;
  ${Margin}
`;

export const Section = styled.section<{ $margin?: MarginValue }>`
  ${Margin}
`;
