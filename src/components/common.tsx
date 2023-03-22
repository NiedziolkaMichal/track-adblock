import styled from "styled-components";
import { Margin, MarginValue } from "./margin";

// TODO image optimization
export const FullSizeImg = styled.img`
  display: block;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
`;

export const FillImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const P = styled.p<{ $margin: MarginValue }>`
  ${Margin}
`;

export const ButtonList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

export const TransparentBorderGradient = styled.div`
  position: absolute;
  inset: calc(-10px);
  border: calc(10px) solid #0000;
  border-radius: calc(10px + var(--border-radius));
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;

  ::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: var(--border-radius);
    background: ${({ theme }) => theme.gradient.primary.image};
    filter: blur(4px);
  }
`;
