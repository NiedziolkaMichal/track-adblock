import styled, { DefaultTheme } from "styled-components";
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

export const SkewedSection = styled.section<{ $bgColor: (theme: DefaultTheme) => string; $skew: string }>`
  display: flow-root;

  position: relative;
  ::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background-color: ${({ theme, $bgColor }) => $bgColor(theme)};
    transform: skewY(${({ $skew }) => $skew});
  }

  @media (max-width: calc(31.5rem + 56px)) {
    ::before {
      transform: initial;
    }
  }
`;
