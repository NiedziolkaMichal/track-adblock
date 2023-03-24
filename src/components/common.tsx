import styled, { DefaultTheme } from "styled-components";
import { Margin, MarginValue } from "./margin";

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

export const BigP = styled.p<{ $margin?: MarginValue }>`
  font-size: 1.1rem;
  font-weight: 480;
  color: ${({ theme }) => theme.text.heading};
  line-height: 1.7;
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

export const BigOrderedList = styled.ol<{ $color: (theme: DefaultTheme) => string; $borderColor: (theme: DefaultTheme) => string; $size: string; $weight: string }>`
  padding: 0;
  list-style-type: none;
  counter-reset: index;
  > li {
    display: grid;
    grid-template-columns: ${({ $size }) => $size} 1fr;

    counter-increment: index 1;
  }
  > li::before {
    content: counter(index, decimal);
    font-size: ${({ $size }) => $size};
    font-weight: ${({ $weight }) => $weight};
    color: ${({ theme, $color }) => $color(theme)};
    --border-color: ${({ theme, $borderColor }) => $borderColor(theme)};
    text-shadow: 1px 1px 1px var(--border-color), -1px 1px 1px var(--border-color), -1px -1px 1px var(--border-color), 1px -1px 1px var(--border-color);
  }
`;
