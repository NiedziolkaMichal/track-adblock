import Link from "next/link";
import styled, { css } from "styled-components";

const stylePrimary = css`
  display: block;
  width: fit-content;
  padding: 10px 18px;
  background-color: ${({ theme }) => theme.button.primary.background};
  color: ${({ theme }) => theme.button.primary.text};
  border-radius: 4px;
  font-weight: 480;
  font-size: 0.9rem;

  :hover {
    background-color: ${({ theme }) => theme.button.primary.backgroundHover};
  }
`;

export const LinkPrimary = styled(Link)`
  ${stylePrimary}
`;

export const ButtonPrimary = styled.button`
  ${stylePrimary}
`;

const styleSecondary = css`
  display: block;
  width: fit-content;
  padding: 10px 18px;
  color: ${({ theme }) => theme.button.secondary.text};
  font-weight: 480;
  font-size: 0.9rem;

  :hover {
    background-color: ${({ theme }) => theme.button.secondary.backgroundHover};
    color: ${({ theme }) => theme.button.secondary.textHover};
  }
`;

export const LinkSecondary = styled(Link)`
  ${styleSecondary}
`;

export const ButtonSecondary = styled.button`
  ${styleSecondary}
`;

const styleValid = css<{ disabled?: boolean }>`
  display: block;
  width: fit-content;
  padding: 10px 18px;
  background-color: ${({ theme }) => theme.button.valid.background};
  color: ${({ theme }) => theme.button.valid.text};
  border-radius: 4px;
  font-weight: 480;
  font-size: 0.9rem;

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: default;
    `}

  :hover {
    background-color: ${({ theme }) => theme.button.valid.backgroundHover};
  }
`;

export const LinkValid = styled(Link)`
  ${styleValid}
`;

export const ButtonValid = styled.button`
  ${styleValid}
`;

export const ButtonShapeShifter = styled.button<{ $state: "primary" | "valid" }>`
  ${({ $state }) => $state === "primary" && stylePrimary};
  ${({ $state }) => $state === "valid" && styleValid};

  transition: all cubic-bezier(0, 1, 0.5, 1) 0.5s;
`;
