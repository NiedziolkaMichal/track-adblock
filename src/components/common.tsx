import styled from "styled-components";

// TODO image optimization
export const FullSizeImg = styled.img`
  display: block;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
`;

export const MarginBottom = styled.div<{ $size: "small" | "medium" | string }>`
  margin-bottom: ${({ $size }) => ($size === "small" ? "10px" : $size === "medium" ? "20px" : $size)};
`;

export const MarginBlock = styled.div<{ $size: "small" | "medium" | string }>`
  margin-block: ${({ $size }) => ($size === "small" ? "10px" : $size === "medium" ? "20px" : $size)};
`;
