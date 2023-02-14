import styled, { css } from "styled-components";

export const Label = styled.label`
  display: block;
  width: fit-content;
  font-size: 0.9rem;
  font-weight: 440;
  margin-bottom: 10px;
`;

const StyledTextField = styled.input`
  color: ${({ theme, disabled }) => (disabled ? theme.text.disabled : "inherit")};
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: 4px;

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

export function TextField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <StyledTextField type="text" {...props} />;
}

export const InvalidInput = styled.p`
  color: ${({ theme }) => theme.text.invalid};
  font-size: 0.8rem;
`;
