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
