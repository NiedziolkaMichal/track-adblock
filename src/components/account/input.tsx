import styled, { css } from "styled-components";
import { Margin, MarginValue } from "../margin";

export const Label = styled.label<{ $light?: boolean; $margin?: MarginValue }>`
  display: block;
  width: fit-content;
  font-size: 0.9rem;
  font-weight: ${({ $light }) => ($light ? 440 : 500)};
  ${Margin}
`;

export const TextField = styled.input<{ $margin?: MarginValue }>`
  color: ${({ theme, disabled }) => (disabled ? theme.text.disabled : "inherit")};
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: 4px;
  ${Margin}

  ${(props) =>
    props.type === "password" &&
    css`
      font-family: monospace;
    `}

  ${({ disabled }) =>
    !disabled &&
    css`
      :hover {
        outline: 2px solid ${({ theme }) => theme.border.intense};
        outline-offset: -2px;
      }
      :focus-visible {
        outline: 2px solid ${({ theme }) => theme.border.selected};
        outline-offset: -2px;
      }
    `}
`;

export const InvalidInput = styled.p<{ $margin?: MarginValue }>`
  color: ${({ theme }) => theme.text.invalid};
  font-size: 0.8rem;
  ${Margin}
`;
