import styled from "styled-components";
import Link from "next/link";
import { Margin, MarginValue } from "./margin";
import React, { ReactNode } from "react";
import { TransparentBorderGradient } from "./common";

export const BaseLink = styled(Link)<{ $margin?: MarginValue }>`
  font-size: 1.1rem;
  font-weight: 600;
  padding: 15px 30px;
  --border-radius: 30px;
  border-radius: var(--border-radius);
  ${Margin}
`;

export const GradientLink = styled(BaseLink)`
  color: ${({ theme }) => theme.button.primary.text};
  background-image: ${({ theme }) => theme.gradient.primary.image};

  :hover {
    background-image: ${({ theme }) => theme.gradient.primary.image}, linear-gradient(#0006, #0006);
    background-blend-mode: hard-light;
  }
`;

const StyledGradientBorderLink = styled(BaseLink)`
  background-image: ${({ theme }) => theme.gradient.primary.image};
  -webkit-background-clip: text;
  color: transparent;

  position: relative;
  transform-style: preserve-3d;

  :hover {
    text-shadow: 0 0 0 rgb(0, 0, 0, 0.3);
  }
  :hover::before {
    inset: -2px;
  }
`;

export function GradientBorderLink({ children, href, ...rest }: { children: ReactNode; href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <StyledGradientBorderLink href={href} {...rest}>
      <TransparentBorderGradient />
      {children}
    </StyledGradientBorderLink>
  );
}
